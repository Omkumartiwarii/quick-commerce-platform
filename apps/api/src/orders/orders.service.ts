import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { RedisService } from '../redis/redis.service';
import { OrderStatus, UserRole, PaymentMethod } from '@qc/shared-types';
import { OrderStateMachine } from './order-state-machine';

interface CheckoutCartItem {
  variantId: string;
  quantity: number;
  unitPricePaise: number;
  name: string;
  sku: string;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly inMemoryOrders = new Map<string, any>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Creates an order with atomic stock reservation and 10-minute lock
   */
  async createOrder(params: {
    customerId: string;
    storeId: string;
    items: CheckoutCartItem[];
    paymentMethod: PaymentMethod;
    idempotencyKey: string;
    deliveryAddress: any;
  }) {
    // 1. Idempotency Check
    const cachedOrder = await this.redis.get(`idemp:${params.idempotencyKey}`);
    if (cachedOrder) {
      this.logger.log(`Idempotent order returned for key ${params.idempotencyKey}`);
      return JSON.parse(cachedOrder);
    }

    if (!params.items || params.items.length === 0) {
      throw new BadRequestException('Cannot create order with an empty cart');
    }

    // 2. Atomically reserve inventory
    const reservationItems = params.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity }));
    await this.inventoryService.reserveStock(params.storeId, reservationItems, params.idempotencyKey);

    // 3. Calculate integer paise financials
    const itemsSubtotalPaise = params.items.reduce((sum, item) => sum + item.unitPricePaise * item.quantity, 0);
    const deliveryFeePaise = itemsSubtotalPaise >= 19900 ? 0 : 1500; // Free above ₹199
    const handlingFeePaise = 400; // ₹4.00
    const taxPaise = Math.round(itemsSubtotalPaise * 0.05); // 5% GST estimate
    const totalPaise = itemsSubtotalPaise + deliveryFeePaise + handlingFeePaise;

    // 4. Generate 4-digit Delivery OTP
    const deliveryOtp = crypto.randomInt(1000, 9999).toString();
    const deliveryOtpHash = crypto.createHash('sha256').update(deliveryOtp).digest('hex');

    const orderId = `ord-${crypto.randomUUID()}`;
    const orderNumber = `ORD-NOIDA-${Date.now().toString().slice(-6)}`;
    const estimatedDeliveryAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const orderRecord = {
      id: orderId,
      orderNumber,
      customerId: params.customerId,
      storeId: params.storeId,
      status: params.paymentMethod === PaymentMethod.COD ? OrderStatus.CONFIRMED : OrderStatus.PAYMENT_PENDING,
      paymentMethod: params.paymentMethod,
      items: params.items,
      priceBreakdown: {
        itemsSubtotalPaise,
        deliveryFeePaise,
        handlingFeePaise,
        taxPaise,
        totalPaise,
      },
      deliveryOtp, // Returned to customer
      deliveryOtpHash,
      deliveryAddressSnapshot: params.deliveryAddress,
      estimatedDeliveryAt: estimatedDeliveryAt.toISOString(),
      createdAt: new Date().toISOString(),
      statusHistories: [
        {
          fromStatus: OrderStatus.CREATED,
          toStatus: params.paymentMethod === PaymentMethod.COD ? OrderStatus.CONFIRMED : OrderStatus.PAYMENT_PENDING,
          timestamp: new Date().toISOString(),
          reason: 'Initial order placement',
        },
      ],
    };

    // Store in memory & Redis
    this.inMemoryOrders.set(orderId, orderRecord);
    await this.redis.set(`idemp:${params.idempotencyKey}`, JSON.stringify(orderRecord), 86400); // 24h

    this.logger.log(`Order ${orderNumber} created in state ${orderRecord.status}`);
    return orderRecord;
  }

  /**
   * Executes a verified order state transition through the 14-state machine
   */
  async transitionOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    actorRole: UserRole,
    reason?: string,
  ) {
    const order = this.inMemoryOrders.get(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const currentStatus: OrderStatus = order.status;
    const isAllowed = OrderStateMachine.canTransition(currentStatus, newStatus, actorRole);

    if (!isAllowed) {
      throw new ForbiddenException(
        `Transition from ${currentStatus} to ${newStatus} is not permitted for role ${actorRole}`,
      );
    }

    // Handle cancellation: release reserved stock!
    if (newStatus === OrderStatus.CANCELLED) {
      const reservationItems = order.items.map((i: any) => ({ variantId: i.variantId, quantity: i.quantity }));
      await this.inventoryService.releaseReservation(order.storeId, reservationItems);
    }

    // Handle delivery: permanently commit stock deduction!
    if (newStatus === OrderStatus.DELIVERED) {
      const reservationItems = order.items.map((i: any) => ({ variantId: i.variantId, quantity: i.quantity }));
      await this.inventoryService.commitReservation(order.storeId, reservationItems);
      order.deliveredAt = new Date().toISOString();
    }

    order.status = newStatus;
    order.statusHistories.push({
      fromStatus: currentStatus,
      toStatus: newStatus,
      timestamp: new Date().toISOString(),
      reason: reason || `Updated by ${actorRole}`,
    });

    this.logger.log(`Order ${order.orderNumber} transitioned: ${currentStatus} -> ${newStatus}`);
    return order;
  }

  /**
   * Verifies 4-digit Delivery OTP when rider hands over groceries to customer
   */
  async verifyDeliveryOtp(orderId: string, inputOtp: string, actorRole: UserRole) {
    const order = this.inMemoryOrders.get(orderId);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    if (order.deliveryOtp !== inputOtp) {
      throw new BadRequestException('Incorrect delivery OTP. Please verify with customer.');
    }

    return this.transitionOrderStatus(orderId, OrderStatus.DELIVERED, actorRole, 'OTP verified by rider');
  }

  async getOrder(orderId: string) {
    const order = this.inMemoryOrders.get(orderId);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    return order;
  }
}
