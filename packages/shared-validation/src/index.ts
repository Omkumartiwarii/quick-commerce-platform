import { z } from 'zod';
import { OrderStatus, PaymentMethod } from '@qc/shared-types';

// ==============================================================================
// 1. AUTHENTICATION & IDENTITY SCHEMAS
// ==============================================================================

// E.164 Indian mobile number (+91 followed by 10 digits starting with 6, 7, 8, or 9)
export const IndianPhoneSchema = z
  .string()
  .trim()
  .regex(/^\+91[6-9]\d{9}$/, {
    message: 'Must be a valid Indian mobile number starting with +91 (e.g. +919876543210)',
  });

export const SendOtpSchema = z.object({
  phone: IndianPhoneSchema,
  purpose: z.enum(['LOGIN', 'REGISTRATION', 'CHECKOUT', 'DELIVERY_VERIFICATION']).default('LOGIN'),
});

export const VerifyOtpSchema = z.object({
  phone: IndianPhoneSchema,
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must contain only digits'),
});

export const StaffLoginSchema = z.object({
  email: z.string().email('Invalid work email address').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(20, 'Invalid refresh token'),
});

// ==============================================================================
// 2. GEOGRAPHY & SERVICEABILITY SCHEMAS
// ==============================================================================

export const GeoCoordinateSchema = z.object({
  latitude: z.number().min(8.0).max(37.0, 'Latitude must be within India'),
  longitude: z.number().min(68.0).max(98.0, 'Longitude must be within India'),
});

export const IndianPincodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9][0-9]{5}$/, { message: 'Must be a valid 6-digit Indian PIN code' });

export const CreateAddressSchema = z.object({
  recipientName: z.string().min(2).max(100),
  recipientPhone: IndianPhoneSchema,
  addressType: z.enum(['HOME', 'WORK', 'OTHER']).default('HOME'),
  flatApartment: z.string().min(1).max(255),
  streetAddress: z.string().min(3).max(500),
  landmark: z.string().max(255).optional(),
  city: z.string().default('Noida'),
  state: z.string().default('Uttar Pradesh'),
  pincode: IndianPincodeSchema,
  latitude: z.number(),
  longitude: z.number(),
  isDefault: z.boolean().default(false),
});

// ==============================================================================
// 3. CART & CHECKOUT SCHEMAS
// ==============================================================================

export const AddToCartSchema = z.object({
  storeId: z.string().uuid('Invalid store UUID'),
  variantId: z.string().uuid('Invalid product variant UUID'),
  quantity: z.number().int().positive().max(50, 'Cannot exceed 50 units per SKU'),
});

export const CreateCheckoutSessionSchema = z.object({
  storeId: z.string().uuid(),
  addressId: z.string().uuid(),
  couponCode: z.string().trim().max(30).optional(),
  tipPaise: z.number().int().nonnegative().default(0),
  idempotencyKey: z.string().uuid('Idempotency key must be a valid UUID v4'),
});

// ==============================================================================
// 4. ORDER & PAYMENT SCHEMAS
// ==============================================================================

export const CreateOrderSchema = z.object({
  checkoutSessionId: z.string().uuid(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  idempotencyKey: z.string().uuid(),
});

export const RazorpayVerifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  razorpayOrderId: z.string().min(5),
  razorpayPaymentId: z.string().min(5),
  razorpaySignature: z.string().min(10),
});

export const DeliveryOtpVerificationSchema = z.object({
  orderId: z.string().uuid(),
  deliveryOtp: z.string().length(4, 'Delivery OTP is 4 digits').regex(/^\d{4}$/),
  latitude: z.number(),
  longitude: z.number(),
});

// ==============================================================================
// 5. STORE OPERATIONS & INVENTORY SCHEMAS
// ==============================================================================

export const ScanBarcodePickSchema = z.object({
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  scannedBarcode: z.string().min(5).max(100),
  batchNumber: z.string().min(2),
});

export const InventoryAdjustmentSchema = z.object({
  storeId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  batchNumber: z.string(),
  deltaQuantity: z.number().int(),
  reason: z.enum(['DAMAGED', 'EXPIRED', 'PHYSICAL_AUDIT_SURPLUS', 'PHYSICAL_AUDIT_SHORTAGE', 'RETURN']),
  auditNote: z.string().min(5).max(500),
});

export const RiderTelemetrySchema = z.object({
  riderId: z.string().uuid(),
  orderId: z.string().uuid().optional(),
  latitude: z.number(),
  longitude: z.number(),
  bearing: z.number().min(0).max(360).default(0),
  speed: z.number().nonnegative().default(0),
});
