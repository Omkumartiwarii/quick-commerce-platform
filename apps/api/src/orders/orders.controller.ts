import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { OrderStatus, UserRole, PaymentMethod } from '@qc/shared-types';

@ApiTags('Orders & State Machine')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Atomically reserve stock & create order' })
  @ApiResponse({ status: 201, description: 'Order created with price breakdown & delivery OTP' })
  async checkout(
    @Body()
    body: {
      customerId: string;
      storeId: string;
      items: any[];
      paymentMethod: PaymentMethod;
      idempotencyKey: string;
      deliveryAddress: any;
    },
  ) {
    return this.ordersService.createOrder(body);
  }

  @Post(':orderId/transition')
  @ApiOperation({ summary: 'Execute verified state transition in 14-state order machine' })
  async transitionStatus(
    @Param('orderId') orderId: string,
    @Body() body: { toStatus: OrderStatus; role: UserRole; reason?: string },
  ) {
    return this.ordersService.transitionOrderStatus(orderId, body.toStatus, body.role, body.reason);
  }

  @Post(':orderId/verify-delivery-otp')
  @ApiOperation({ summary: 'Verify 4-digit customer delivery OTP on handover' })
  async verifyDeliveryOtp(
    @Param('orderId') orderId: string,
    @Body() body: { otp: string; role: UserRole },
  ) {
    return this.ordersService.verifyDeliveryOtp(orderId, body.otp, body.role || UserRole.RIDER);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Retrieve full order details, SLA timer & status histories' })
  async getOrder(@Param('orderId') orderId: string) {
    return this.ordersService.getOrder(orderId);
  }
}
