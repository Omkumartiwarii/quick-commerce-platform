# API SPECIFICATION & PROTOCOL STANDARDS
## Core API: REST (OpenAPI 3.1) & Real-Time Gateway (Socket.IO)
### Base URL: `https://api.zepto-quickcommerce.internal/v1`

---

## 1. Authentication & Security Headers

All protected endpoints require an `Authorization` header:
```
Authorization: Bearer <jwt_access_token>
```
All state-modifying requests (`POST`, `PUT`, `PATCH`) support an idempotency header:
```
Idempotency-Key: <unique_client_uuid_v4>
```
Standard responses adhere to the JSend-compliant envelope:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-11-11T12:00:00.000Z",
    "requestId": "req-98f9832a"
  }
}
```

---

## 2. REST Endpoints by Domain

### 2.1 Identity & Authentication
- `POST /v1/auth/customer/otp/send`: Request 6-digit OTP for an Indian phone number (`+91XXXXXXXXXX`).
- `POST /v1/auth/customer/otp/verify`: Verify OTP, return `{ accessToken, refreshToken, isNewCustomer }`.
- `POST /v1/auth/staff/login`: Staff/Admin login with email and password (`Argon2id`).
- `POST /v1/auth/token/refresh`: Refresh expired access token with valid rotation.
- `POST /v1/auth/logout`: Revoke active session in Redis and database.
- `GET  /v1/auth/me`: Current user identity, roles, and granular permissions.

### 2.2 Geography & Serviceability
- `GET  /v1/geo/cities`: List active operating cities (e.g. Noida).
- `POST /v1/geo/serviceability/check`:
  - **Body**: `{ "latitude": 28.6280, "longitude": 77.3649 }`
  - **Response**:
    ```json
    {
      "isServiceable": true,
      "store": {
        "id": "store-uuid-sec62",
        "name": "Noida Sector 62 Dark Store",
        "estimatedDeliveryMinutes": 12,
        "distanceMeters": 1420
      },
      "zoneId": "zone-noida-central"
    }
    ```
- `GET  /v1/geo/addresses`: Customer saved delivery addresses.
- `POST /v1/geo/addresses`: Save new delivery address with PostGIS coordinates.

### 2.3 Product Catalog & Search
- `GET  /v1/catalog/categories`: Hierarchical category tree with icons.
- `GET  /v1/catalog/categories/:slug/products`: Paginated products within a category for a specific `storeId`.
- `GET  /v1/catalog/products/:id`: Full product detail with variants, MRP, selling price, nutrition, and FSSAI tags.
- `GET  /v1/catalog/search`: High-speed Meilisearch query with query suggestions and typo tolerance.

### 2.4 Cart & Checkout
- `GET  /v1/cart`: Get current active cart with live store inventory checks.
- `POST /v1/cart/items`: Add or update item quantity (with instantaneous stock validation).
- `DELETE /v1/cart/items/:variantId`: Remove item.
- `POST /v1/cart/apply-coupon`: Apply promo code and calculate discount.
- `POST /v1/checkout/session`:
  - Create checkout session.
  - Atomically reserve inventory with 10-minute lock.
  - Return frozen price snapshot (item totals, GST split, delivery fee, platform fee).

### 2.5 Orders & Payments
- `POST /v1/orders/create`:
  - Convert checkout session into `Order` in `PAYMENT_PENDING` or `CONFIRMED` state.
  - Return Razorpay `order_id` or confirm COD.
- `POST /v1/payments/razorpay/verify`:
  - **Body**: `{ "orderId", "razorpayPaymentId", "razorpayOrderId", "razorpaySignature" }`.
  - Server-side cryptographic HMAC-SHA256 verification.
- `POST /v1/payments/webhook`:
  - Dedicated webhook listener for Razorpay events (`order.paid`, `payment.failed`, `refund.processed`).
  - Strict deduplication via `payment_webhook_events`.
- `GET  /v1/orders/customer`: Paginated order history.
- `GET  /v1/orders/:orderId`: Complete order status, live coordinates, items, and GST invoice download link.
- `POST /v1/orders/:orderId/cancel`: Cancel order (allowed before `PACKED` state; triggers instant stock release & refund).

### 2.6 Dark Store Operations
- `GET  /v1/store-ops/orders/queue`: Real-time list of orders waiting for picking, packing, or dispatch.
- `POST /v1/store-ops/orders/:orderId/accept`: Dark store accepts order.
- `POST /v1/store-ops/orders/:orderId/pick-item`:
  - Scan barcode of item.
  - Validates correct SKU and batch expiry date (FEFO).
- `POST /v1/store-ops/orders/:orderId/pack`:
  - Mark order as packed and bagged with bag seal barcode.
- `POST /v1/store-ops/inventory/adjust`: Authorized stock adjustment with audit reason.
- `POST /v1/store-ops/procurement/receive-goods`: Inward new batch from supplier with barcode scan.

### 2.7 Rider & Delivery Telematics
- `POST /v1/delivery/status`: Rider toggles `ONLINE` / `OFFLINE`.
- `GET  /v1/delivery/assignments/current`: Current active order delivery task.
- `POST /v1/delivery/assignments/:id/accept`: Accept assignment within 30-second window.
- `POST /v1/delivery/assignments/:id/reject`: Reject assignment, triggers auto-failover.
- `POST /v1/delivery/orders/:orderId/pickup`: Handover from dark store verified via tote scan.
- `POST /v1/delivery/orders/:orderId/complete`: Submit 4-digit customer delivery OTP and GPS fix.
- `POST /v1/delivery/location/ping`: Batch upload GPS coordinates when on active shift.

### 2.8 Super Admin & Analytics
- `GET  /v1/admin/overview`: Real-time GMV, order volume, live rider count, active store status.
- `POST /v1/admin/stores`: Provision new dark store with geofenced delivery polygon.
- `POST /v1/admin/catalog/products`: Create/update catalog items and variants.
- `GET  /v1/admin/finance/settlements`: Daily financial reconciliation and Razorpay payout balance.
- `GET  /v1/admin/audit-logs`: Append-only compliance log.

---

## 3. Real-Time WebSocket Specifications (Socket.IO)

### 3.1 Namespaces & Authentication
- All WebSocket connections connect to `wss://api.zepto-quickcommerce.internal/<namespace>` with `{ auth: { token: "Bearer ..." } }`.

### 3.2 Namespace: `/orders`
- **Client Joins**: `order:<orderId>` (Room access strictly verified by customer ID or store staff).
- **Server Events Emitted**:
  - `order:status_updated`: `{ orderId, status, timestamp, eta }`
  - `order:item_substituted`: `{ orderId, originalSku, substitutedSku }`

### 3.3 Namespace: `/tracking`
- **Client Joins**: `track:<orderId>` (Authorized for customer of the order).
- **Rider Emits**: `rider:telemetry`: `{ orderId, latitude, longitude, bearing, speed }` (Throttled to every 3 seconds).
- **Server Broadcasts**: `rider:position`: `{ latitude, longitude, bearing, remainingMeters, etaSeconds }`

### 3.4 Namespace: `/store-ops`
- **Store Tablet Joins**: `store:<storeId>`
- **Server Events Emitted**:
  - `order:new_incoming`: Audio buzzer trigger and order details.
  - `order:rider_arrived`: Notifies packing bay that assigned rider has reached the dark store gate.
