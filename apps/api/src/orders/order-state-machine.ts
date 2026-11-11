import { OrderStatus, UserRole } from '@qc/shared-types';

export interface TransitionRule {
  allowedTo: OrderStatus[];
  allowedRoles: UserRole[];
}

/**
 * Deterministic State Transition Matrix for Zepto/Blinkit Quick Commerce Model
 */
export const ORDER_TRANSITION_RULES: Record<OrderStatus, TransitionRule> = {
  [OrderStatus.CREATED]: {
    allowedTo: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED],
    allowedRoles: [UserRole.CUSTOMER, UserRole.SUPER_ADMIN],
  },
  [OrderStatus.PAYMENT_PENDING]: {
    allowedTo: [OrderStatus.CONFIRMED, OrderStatus.PAYMENT_FAILED, OrderStatus.CANCELLED],
    allowedRoles: [UserRole.CUSTOMER, UserRole.SUPER_ADMIN],
  },
  [OrderStatus.PAYMENT_FAILED]: {
    allowedTo: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED],
    allowedRoles: [UserRole.CUSTOMER, UserRole.SUPER_ADMIN],
  },
  [OrderStatus.CONFIRMED]: {
    allowedTo: [OrderStatus.STORE_ACCEPTED, OrderStatus.CANCELLED],
    allowedRoles: [UserRole.STORE_MANAGER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER],
  },
  [OrderStatus.STORE_ACCEPTED]: {
    allowedTo: [OrderStatus.PICKING, OrderStatus.CANCELLED],
    allowedRoles: [UserRole.STORE_MANAGER, UserRole.PICKER, UserRole.SUPER_ADMIN],
  },
  [OrderStatus.PICKING]: {
    allowedTo: [OrderStatus.PACKED, OrderStatus.CANCELLED],
    allowedRoles: [UserRole.PICKER, UserRole.PACKER, UserRole.STORE_MANAGER, UserRole.SUPER_ADMIN],
  },
  [OrderStatus.PACKED]: {
    allowedTo: [OrderStatus.RIDER_ASSIGNED, OrderStatus.CANCELLED],
    allowedRoles: [UserRole.PACKER, UserRole.STORE_MANAGER, UserRole.SUPER_ADMIN],
  },
  [OrderStatus.RIDER_ASSIGNED]: {
    allowedTo: [OrderStatus.PICKED_UP, OrderStatus.CANCELLED],
    allowedRoles: [UserRole.RIDER, UserRole.STORE_MANAGER, UserRole.SUPER_ADMIN],
  },
  [OrderStatus.PICKED_UP]: {
    allowedTo: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELLED],
    allowedRoles: [UserRole.RIDER, UserRole.SUPER_ADMIN],
  },
  [OrderStatus.OUT_FOR_DELIVERY]: {
    allowedTo: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
    allowedRoles: [UserRole.RIDER, UserRole.SUPER_ADMIN],
  },
  [OrderStatus.DELIVERED]: {
    allowedTo: [OrderStatus.REFUND_PENDING], // In case of damaged items
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.SUPPORT_AGENT],
  },
  [OrderStatus.CANCELLED]: {
    allowedTo: [OrderStatus.REFUND_PENDING],
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  [OrderStatus.REFUND_PENDING]: {
    allowedTo: [OrderStatus.REFUNDED],
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
  [OrderStatus.REFUNDED]: {
    allowedTo: [],
    allowedRoles: [],
  },
};

export class OrderStateMachine {
  /**
   * Validates whether transition from fromStatus to toStatus is permitted for user with given role
   */
  static canTransition(from: OrderStatus, to: OrderStatus, role: UserRole): boolean {
    // Super Admin has emergency master bypass for operational recovery
    if (role === UserRole.SUPER_ADMIN) return true;

    const rule = ORDER_TRANSITION_RULES[from];
    if (!rule) return false;

    const isStatusAllowed = rule.allowedTo.includes(to);
    const isRoleAllowed = rule.allowedRoles.includes(role);

    return isStatusAllowed && isRoleAllowed;
  }
}
