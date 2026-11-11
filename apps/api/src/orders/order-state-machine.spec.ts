import { OrderStateMachine } from './order-state-machine';
import { OrderStatus, UserRole } from '@qc/shared-types';

describe('OrderStateMachine (14-State Engine)', () => {
  it('should allow valid happy-path progression through delivery lifecycle', () => {
    // 1. CREATED -> PAYMENT_PENDING (Customer)
    expect(OrderStateMachine.canTransition(OrderStatus.CREATED, OrderStatus.PAYMENT_PENDING, UserRole.CUSTOMER)).toBe(true);

    // 2. PAYMENT_PENDING -> CONFIRMED (Payment Gateway / Customer)
    expect(OrderStateMachine.canTransition(OrderStatus.PAYMENT_PENDING, OrderStatus.CONFIRMED, UserRole.CUSTOMER)).toBe(true);

    // 3. CONFIRMED -> STORE_ACCEPTED (Store Manager)
    expect(OrderStateMachine.canTransition(OrderStatus.CONFIRMED, OrderStatus.STORE_ACCEPTED, UserRole.STORE_MANAGER)).toBe(true);

    // 4. STORE_ACCEPTED -> PICKING (Picker)
    expect(OrderStateMachine.canTransition(OrderStatus.STORE_ACCEPTED, OrderStatus.PICKING, UserRole.PICKER)).toBe(true);

    // 5. PICKING -> PACKED (Packer)
    expect(OrderStateMachine.canTransition(OrderStatus.PICKING, OrderStatus.PACKED, UserRole.PACKER)).toBe(true);

    // 6. PACKED -> RIDER_ASSIGNED (Store Manager / Dispatch Engine)
    expect(OrderStateMachine.canTransition(OrderStatus.PACKED, OrderStatus.RIDER_ASSIGNED, UserRole.STORE_MANAGER)).toBe(true);

    // 7. RIDER_ASSIGNED -> PICKED_UP (Rider upon tote scan)
    expect(OrderStateMachine.canTransition(OrderStatus.RIDER_ASSIGNED, OrderStatus.PICKED_UP, UserRole.RIDER)).toBe(true);

    // 8. PICKED_UP -> OUT_FOR_DELIVERY (Rider)
    expect(OrderStateMachine.canTransition(OrderStatus.PICKED_UP, OrderStatus.OUT_FOR_DELIVERY, UserRole.RIDER)).toBe(true);

    // 9. OUT_FOR_DELIVERY -> DELIVERED (Rider with customer OTP)
    expect(OrderStateMachine.canTransition(OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED, UserRole.RIDER)).toBe(true);
  });

  it('should strictly reject illegal jumps in state', () => {
    // Cannot jump from CREATED directly to DELIVERED
    expect(OrderStateMachine.canTransition(OrderStatus.CREATED, OrderStatus.DELIVERED, UserRole.CUSTOMER)).toBe(false);

    // Cannot jump from PICKING directly to DELIVERED
    expect(OrderStateMachine.canTransition(OrderStatus.PICKING, OrderStatus.DELIVERED, UserRole.PICKER)).toBe(false);

    // Cannot jump backward from DELIVERED to CREATED
    expect(OrderStateMachine.canTransition(OrderStatus.DELIVERED, OrderStatus.CREATED, UserRole.RIDER)).toBe(false);
  });

  it('should reject unauthorized roles attempting state transitions', () => {
    // A Customer cannot mark an order as PICKED_UP
    expect(OrderStateMachine.canTransition(OrderStatus.RIDER_ASSIGNED, OrderStatus.PICKED_UP, UserRole.CUSTOMER)).toBe(false);

    // A Rider cannot accept order at the store
    expect(OrderStateMachine.canTransition(OrderStatus.CONFIRMED, OrderStatus.STORE_ACCEPTED, UserRole.RIDER)).toBe(false);
  });

  it('should allow Super Admin emergency operational bypass', () => {
    expect(OrderStateMachine.canTransition(OrderStatus.CONFIRMED, OrderStatus.DELIVERED, UserRole.SUPER_ADMIN)).toBe(true);
  });
});
