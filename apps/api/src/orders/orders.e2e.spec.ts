import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { InventoryService } from '../inventory/inventory.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { OrderStatus, UserRole, PaymentMethod } from '@qc/shared-types';

describe('End-to-End Quick Commerce Delivery Workflow (Zepto/Blinkit Architecture)', () => {
  let ordersService: OrdersService;
  let inventoryService: InventoryService;
  let redisService: RedisService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, InventoryService, PrismaService, RedisService],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    inventoryService = module.get<InventoryService>(InventoryService);
    redisService = module.get<RedisService>(RedisService);
    await redisService.onModuleInit();
  });

  it('should execute the full 10-minute order lifecycle from checkout to OTP delivery', async () => {
    const storeId = 'store-noida-sec62';
    const variantId = 'AMUL-TAAZA-500ML';

    // 1. Initial inventory setup
    inventoryService.setInitialStock(storeId, variantId, 20);

    // 2. Customer places order via UPI
    const order = await ordersService.createOrder({
      customerId: 'cust-uuid-noida-01',
      storeId,
      items: [
        {
          variantId,
          quantity: 2,
          unitPricePaise: 2700,
          name: 'Amul Taaza Milk',
          sku: 'AMUL-TAAZA-500ML',
        },
      ],
      paymentMethod: PaymentMethod.RAZORPAY_UPI,
      idempotencyKey: 'idemp-uuid-e2e-001',
      deliveryAddress: {
        apartment: 'Flat 402, Tower B',
        sector: 'Noida Sector 62',
        pincode: '201309',
      },
    });

    expect(order.id).toBeDefined();
    expect(order.status).toBe(OrderStatus.PAYMENT_PENDING);
    expect(order.deliveryOtp).toHaveLength(4);
    expect(order.priceBreakdown.totalPaise).toBe(2700 * 2 + 1500 + 400); // Items + Delivery + Handling

    // Verify inventory was atomically reserved (20 - 2 = 18 available, 2 reserved)
    const stockAfterReservation = inventoryService.getStock(storeId, variantId);
    expect(stockAfterReservation.available).toBe(18);
    expect(stockAfterReservation.reserved).toBe(2);

    // 3. Payment Confirmed
    const confirmedOrder = await ordersService.transitionOrderStatus(
      order.id,
      OrderStatus.CONFIRMED,
      UserRole.CUSTOMER,
      'Razorpay webhook verified signature',
    );
    expect(confirmedOrder.status).toBe(OrderStatus.CONFIRMED);

    // 4. Store Manager Accepts Order
    const acceptedOrder = await ordersService.transitionOrderStatus(
      order.id,
      OrderStatus.STORE_ACCEPTED,
      UserRole.STORE_MANAGER,
    );
    expect(acceptedOrder.status).toBe(OrderStatus.STORE_ACCEPTED);

    // 5. Store Picker scans item barcodes & begins picking
    const pickingOrder = await ordersService.transitionOrderStatus(
      order.id,
      OrderStatus.PICKING,
      UserRole.PICKER,
    );
    expect(pickingOrder.status).toBe(OrderStatus.PICKING);

    // 6. Packer verifies bag seal & marks Packed
    const packedOrder = await ordersService.transitionOrderStatus(
      order.id,
      OrderStatus.PACKED,
      UserRole.PACKER,
    );
    expect(packedOrder.status).toBe(OrderStatus.PACKED);

    // 7. Auto-Dispatch Engine assigns nearby EV Rider
    const assignedOrder = await ordersService.transitionOrderStatus(
      order.id,
      OrderStatus.RIDER_ASSIGNED,
      UserRole.STORE_MANAGER,
    );
    expect(assignedOrder.status).toBe(OrderStatus.RIDER_ASSIGNED);

    // 8. Rider arrives at dark store and scans tote bag barcode
    const pickedUpOrder = await ordersService.transitionOrderStatus(
      order.id,
      OrderStatus.PICKED_UP,
      UserRole.RIDER,
    );
    expect(pickedUpOrder.status).toBe(OrderStatus.PICKED_UP);

    // 9. Rider departs for customer address
    const outOrder = await ordersService.transitionOrderStatus(
      order.id,
      OrderStatus.OUT_FOR_DELIVERY,
      UserRole.RIDER,
    );
    expect(outOrder.status).toBe(OrderStatus.OUT_FOR_DELIVERY);

    // 10. Rider reaches customer door and submits correct Delivery OTP
    const deliveredOrder = await ordersService.verifyDeliveryOtp(
      order.id,
      order.deliveryOtp,
      UserRole.RIDER,
    );
    expect(deliveredOrder.status).toBe(OrderStatus.DELIVERED);
    expect(deliveredOrder.deliveredAt).toBeDefined();

    // Verify stock is permanently deducted (reserved cleared, available remains 18)
    const stockAfterDelivery = inventoryService.getStock(storeId, variantId);
    expect(stockAfterDelivery.available).toBe(18);
    expect(stockAfterDelivery.reserved).toBe(0);
  });
});
