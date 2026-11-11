# ENVIRONMENT VARIABLES SPECIFICATION
## Comprehensive Configuration Guide for Quick Commerce Services

---

## 1. Core API & Worker Services (`apps/api`, `apps/worker`)

```bash
# ==============================================================================
# ENVIRONMENT & RUNTIME
# ==============================================================================
NODE_ENV=development                 # 'development' | 'test' | 'staging' | 'production'
PORT=4000                            # Core API HTTP Port
WORKER_PORT=4001                     # Health/Prometheus Port for Worker
API_PREFIX=v1
APP_NAME="Zepto Quick Commerce Core API"
LOG_LEVEL=debug                      # 'debug' | 'info' | 'warn' | 'error'

# ==============================================================================
# DATABASE (PostgreSQL 17 + PostGIS)
# ==============================================================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quick_commerce_db?schema=public&sslmode=prefer"
DATABASE_DIRECT_URL="postgresql://postgres:postgres@localhost:5432/quick_commerce_db?schema=public"
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=25

# ==============================================================================
# CACHE & MESSAGE BROKER (Redis 7.2 / ElastiCache)
# ==============================================================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_DB=0
REDIS_TLS_ENABLED=false

# ==============================================================================
# JWT & SECURITY
# ==============================================================================
JWT_ACCESS_SECRET="develop-super-secret-access-key-minimum-32-chars-long!"
JWT_REFRESH_SECRET="develop-super-secret-refresh-key-minimum-32-chars-long!"
JWT_ACCESS_EXPIRATION_TIME="15m"
JWT_REFRESH_EXPIRATION_TIME="7d"

# ==============================================================================
# MEILISEARCH (Product Search Engine)
# ==============================================================================
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_API_KEY="masterKeyQuickCommerce2026"
MEILISEARCH_INDEX_PREFIX="qc_dev"

# ==============================================================================
# RAZORPAY PAYMENT GATEWAY (Indian Currency - INR)
# ==============================================================================
RAZORPAY_KEY_ID="rzp_test_YourTestKeyIdHere"
RAZORPAY_KEY_SECRET="YourTestKeySecretHere"
RAZORPAY_WEBHOOK_SECRET="YourWebhookSecretHere"

# ==============================================================================
# SMS OTP GATEWAY (Indian DLT Registered)
# ==============================================================================
SMS_PROVIDER="MOCK"                  # 'MOCK' | 'FAST2SMS' | 'MSG91' | 'TWILIO'
SMS_API_KEY="test_sms_key"
SMS_SENDER_ID="QCCOMM"
SMS_DLT_TE_ID="1207161234567890123"

# ==============================================================================
# GOOGLE MAPS PLATFORM
# ==============================================================================
GOOGLE_MAPS_API_KEY="AIzaSyMockKeyForDevCoordinatesAndDistanceMatrix"

# ==============================================================================
# AWS S3 (Media Storage)
# ==============================================================================
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="mock_aws_access_key"
AWS_SECRET_ACCESS_KEY="mock_aws_secret_key"
AWS_S3_BUCKET_NAME="qc-assets-noida-dev"
AWS_CLOUDFRONT_DOMAIN="https://cdn.quickcommerce.internal"

# ==============================================================================
# SENTRY & OBSERVABILITY
# ==============================================================================
SENTRY_DSN=""
OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318"
```

---

## 2. Customer Web & Admin Portals (`apps/customer-web`, `apps/admin-web`, `apps/store-web`)

```bash
# Next.js Public Environment Variables
NEXT_PUBLIC_API_URL="http://localhost:4000/v1"
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_YourTestKeyIdHere"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyMockKeyForDevCoordinatesAndDistanceMatrix"
NEXT_PUBLIC_DEFAULT_CITY="Noida"
NEXT_PUBLIC_DEFAULT_LAT="28.6280"
NEXT_PUBLIC_DEFAULT_LNG="77.3649"
```

---

## 3. Mobile Applications (`apps/customer-mobile`, `apps/delivery-mobile`)

```bash
# Expo React Native App Config (.env)
EXPO_PUBLIC_API_URL="http://10.0.2.2:4000/v1"   # 10.0.2.2 for Android Emulator, or LAN IP
EXPO_PUBLIC_SOCKET_URL="http://10.0.2.2:4000"
EXPO_PUBLIC_RAZORPAY_KEY_ID="rzp_test_YourTestKeyIdHere"
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyMockKeyForDevCoordinatesAndDistanceMatrix"
```
