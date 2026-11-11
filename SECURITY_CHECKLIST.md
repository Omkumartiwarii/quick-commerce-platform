# SECURITY & COMPLIANCE SPECIFICATION
## Quick Commerce Ecosystem Hardening Guide
### Standards: OWASP Top 10, CERT-In Guidelines & Indian Digital Personal Data Protection (DPDP) Act

---

## 1. Authentication & Session Hardening
- [x] **Argon2id Password Hashing**: Employed for all administrative, store, and internal accounts (`memoryCost: 65536, timeCost: 3, parallelism: 4`). No bcrypt or SHA variants for passwords.
- [x] **SMS OTP Rate Limiting**: Maximum 3 OTP requests per 10 minutes per phone number; maximum 5 failed attempts before 1-hour account lockout.
- [x] **Cryptographic OTP Generation**: 6-digit numeric OTP generated via Node.js `crypto.randomInt(100000, 999999)` with SHA-256 hash storage and 5-minute TTL.
- [x] **Refresh Token Rotation (RTR)**: Refresh tokens are single-use. When used, the entire token family is reissued; attempting to reuse a consumed refresh token triggers automatic revocation of all active sessions for that user.
- [x] **Device Fingerprinting**: User sessions store hashed user-agent, IP, and hardware identifiers for anomalous login detection.

---

## 2. API & Application Layer Security
- [x] **Zero Frontend Payment Trust**: Order confirmation is triggered exclusively by verified Razorpay server webhooks or server-to-server Razorpay API verification. Frontend redirect states are treated as unconfirmed hints.
- [x] **Webhook Signature Verification**: Mandatory `X-Razorpay-Signature` HMAC-SHA256 calculation matching the raw incoming payload against `RAZORPAY_WEBHOOK_SECRET`.
- [x] **Strict Idempotency Keys**: All `POST /checkout` and `POST /payments` requests enforce unique client idempotency keys stored in Redis with atomic distributed locks (`SET key val NX EX 300`).
- [x] **Parameterized Queries**: All database interactions use Prisma ORM prepared statements; raw SQL is strictly audited and executed via `$queryRawUnsafe` with explicit parameter bindings.
- [x] **Content Security Policy (CSP) & Headers**:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- [x] **CORS Whitelist**: Explicit origins configured for customer web, admin web, and store web portals. Wildcards (`*`) are disallowed.

---

## 3. Data Protection, PII & Privacy (DPDP Compliance)
- [x] **PII Masking**: Customer phone numbers are masked in dark store and rider applications (e.g. `+91 98****3210`) using virtual proxy call routing.
- [x] **Rider Geolocation Privacy**: GPS telemetry is collected **only** when the rider is in an active shift and assigned an active batch. All tracking terminates immediately upon shift logout.
- [x] **Encryption at Rest**: AWS RDS PostgreSQL volume encryption enabled using AWS KMS customer-managed keys (`ap-south-1`).
- [x] **Encryption in Transit**: TLS 1.3 enforced for all internal microservice and external client communication.

---

## 4. Concurrency & Financial Protection
- [x] **Anti-Overselling Guardrails**: Pessimistic locking (`SELECT FOR UPDATE`) on `store_inventories` during checkout reservation prevents double-spending of stock.
- [x] **Compensating Ledger**: Inventory mutations and payment refunds write immutable compensating entries. Historical transactions are strictly append-only.
- [x] **Integer Mathematics**: All calculations operate in integer paise to eliminate floating-point rounding errors.

---

## 5. Indian Regulatory Compliance Matrix

| Regulation | Requirement | Implementation |
|---|---|---|
| **GST Act (2017)** | Tiered GST rates (0%, 5%, 12%, 18%, 28%) and split CGST+SGST/IGST | Stored per SKU in `product_variants.tax_rate_percent`; auto-split on `order_invoices` based on store state vs delivery state. |
| **FSSAI Food Safety** | Display FSSAI license numbers of dark store and packager | Displayed on product pages, order summary, and printed on every delivery invoice. |
| **Legal Metrology Rules** | Mandatory MRP, Net Quantity, Best Before / Expiry date, Country of Origin | Captured as mandatory fields in `product_variants` and displayed above the fold. |
| **Consumer Protection (E-Commerce) Rules 2020** | Grievance officer details, 48-hour grievance acknowledgment, clear cancellation/refund policies | Grievance officer contact exposed in app settings; automated refund SLA monitoring. |
