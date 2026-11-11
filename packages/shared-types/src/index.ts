// ==============================================================================
// 1. ENUMS & CONSTANTS
// ==============================================================================

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CITY_MANAGER = 'CITY_MANAGER',
  STORE_MANAGER = 'STORE_MANAGER',
  PICKER = 'PICKER',
  PACKER = 'PACKER',
  RIDER = 'RIDER',
  CUSTOMER = 'CUSTOMER',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
}

export enum OrderStatus {
  CREATED = 'CREATED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  CONFIRMED = 'CONFIRMED',
  STORE_ACCEPTED = 'STORE_ACCEPTED',
  PICKING = 'PICKING',
  PACKED = 'PACKED',
  RIDER_ASSIGNED = 'RIDER_ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  RAZORPAY_UPI = 'RAZORPAY_UPI',
  RAZORPAY_CARD = 'RAZORPAY_CARD',
  RAZORPAY_NETBANKING = 'RAZORPAY_NETBANKING',
  COD = 'COD',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum StockMovementType {
  PROCUREMENT = 'PROCUREMENT',
  CUSTOMER_ORDER = 'CUSTOMER_ORDER',
  RESERVATION_RELEASE = 'RESERVATION_RELEASE',
  DAMAGED_WRITE_OFF = 'DAMAGED_WRITE_OFF',
  AUDIT_CORRECTION = 'AUDIT_CORRECTION',
}

export enum AssignmentStatus {
  OFFERED = 'OFFERED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  TIMEOUT = 'TIMEOUT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum RiderShiftStatus {
  OFFLINE = 'OFFLINE',
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
}

// ==============================================================================
// 2. DOMAIN MODELS & DTOs
// ==============================================================================

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface ServiceabilityResult {
  isServiceable: boolean;
  storeId?: string;
  storeCode?: string;
  storeName?: string;
  zoneId?: string;
  estimatedDeliveryMinutes?: number;
  distanceMeters?: number;
  reason?: string;
}

export interface ProductVariantDto {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  packSize: string;
  mrpPaise: number;
  sellingPricePaise: number;
  discountPercent: number;
  taxRatePercent: number;
  hsnCode: string;
  weightGrams: number;
  inStock: boolean;
  availableQuantity: number;
  imageUrl: string;
}

export interface CartItemDto {
  variantId: string;
  quantity: number;
  unitPricePaise: number;
  totalPricePaise: number;
  productName: string;
  sku: string;
}

export interface PriceBreakdown {
  itemsSubtotalPaise: number;
  taxPaise: number;
  deliveryFeePaise: number;
  handlingFeePaise: number;
  discountPaise: number;
  totalPaise: number;
}

export interface OrderItemSnapshot {
  productVariantId: string;
  batchId?: string;
  productName: string;
  variantTitle: string;
  sku: string;
  hsnCode: string;
  taxRatePercent: number;
  unitPricePaise: number;
  quantity: number;
  totalPricePaise: number;
}

export interface OrderSummaryDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  storeId: string;
  storeName: string;
  customerId: string;
  items: OrderItemSnapshot[];
  priceBreakdown: PriceBreakdown;
  deliveryOtp: string;
  estimatedDeliveryAt: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface RiderTelemetryDto {
  riderId: string;
  orderId?: string;
  latitude: number;
  longitude: number;
  bearing: number;
  speed: number;
  timestamp: string;
}
