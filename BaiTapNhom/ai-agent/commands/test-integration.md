# Command: Test Integration

## Usage

```
@ai-agent test-integration <test-type>
```

## Test Types

| Type | Description |
|------|-------------|
| `all` | Test tất cả services và integrations |
| `services` | Test từng service riêng lẻ |
| `gateway` | Test API Gateway routing |
| `inter-service` | Test giao tiếp giữa services |
| `e2e` | Test end-to-end flow |

## Prerequisites

Trước khi test:
1. Tất cả services đang chạy
2. Database đã seed data (Food Service)
3. Frontend đã configure đúng API URL

## Test 1: Individual Services

### User Service (:8081)

```bash
echo "=== Testing User Service ==="

# Health check
curl -s http://localhost:8081/actuator/health

# Register
curl -s -X POST http://localhost:8081/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456","email":"test@test.com"}'

# Login
curl -s -X POST http://localhost:8081/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'

# Get users
curl -s http://localhost:8081/users

echo "User Service: OK"
```

### Food Service (:8082)

```bash
echo "=== Testing Food Service ==="

# Health check
curl -s http://localhost:8082/actuator/health

# Get all foods
curl -s http://localhost:8082/foods

# Get food by ID
curl -s http://localhost:8082/foods/1

# Create food
curl -s -X POST http://localhost:8082/foods \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Food","price":25000,"category":"MAIN"}'

echo "Food Service: OK"
```

### Order Service (:8083)

```bash
echo "=== Testing Order Service ==="

# Health check
curl -s http://localhost:8083/actuator/health

# Get orders
curl -s http://localhost:8083/orders

# Create order (requires User & Food services)
curl -s -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"foodId":1,"quantity":2}]}'

echo "Order Service: OK"
```

### Payment Service (:8084)

```bash
echo "=== Testing Payment Service ==="

# Health check
curl -s http://localhost:8084/actuator/health

# Process payment (requires Order service)
curl -s -X POST http://localhost:8084/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId":1,"method":"COD","amount":90000}'

echo "Payment Service: OK"
```

## Test 2: API Gateway (:8080)

```bash
echo "=== Testing API Gateway ==="

# Gateway health
curl -s http://localhost:8080/actuator/health

# Route to User Service
curl -s http://localhost:8080/api/users

# Route to Food Service
curl -s http://localhost:8080/api/foods

# Route to Order Service
curl -s http://localhost:8080/api/orders

# Route to Payment Service
# (May fail if no payments yet)
curl -s http://localhost:8080/api/payments

echo "API Gateway: OK"
```

## Test 3: Inter-Service Communication

### Order → User Service

```bash
echo "=== Testing Order → User ==="

# Create order with valid user
curl -s -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"foodId":1,"quantity":1}]}'

# Should succeed if User 1 exists

# Create order with invalid user
curl -s -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":9999,"items":[{"foodId":1,"quantity":1}]}'

# Should fail with "User not found"
```

### Order → Food Service

```bash
echo "=== Testing Order → Food ==="

# Create order with valid food
curl -s -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"foodId":1,"quantity":1}]}'

# Should succeed if Food 1 exists

# Create order with invalid food
curl -s -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"foodId":9999,"quantity":1}]}'

# Should fail with "Food not found"
```

### Payment → Order Service

```bash
echo "=== Testing Payment → Order ==="

# First, create an order
ORDER_RESPONSE=$(curl -s -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"foodId":1,"quantity":2}]}')

echo "Order created: $ORDER_RESPONSE"

# Extract order ID (simple approach)
ORDER_ID=1  # Adjust based on actual response

# Process payment
curl -s -X POST http://localhost:8084/payments \
  -H "Content-Type: application/json" \
  -d "{\"orderId\":$ORDER_ID,\"method\":\"COD\",\"amount\":90000}"

# Check order status changed to PAID
curl -s http://localhost:8083/orders/$ORDER_ID
```

## Test 4: End-to-End Flow

### Full Test Script

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api"
echo "=========================================="
echo "       E2E Integration Test"
echo "=========================================="

# Step 1: Register
echo -e "\n[1/6] Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"e2euser","password":"123456","email":"e2e@test.com"}')
echo "Response: $REGISTER_RESPONSE"

# Step 2: Login
echo -e "\n[2/6] Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"e2euser","password":"123456"}')
echo "Response: $LOGIN_RESPONSE"

# Step 3: Get Foods
echo -e "\n[3/6] Getting food menu..."
FOODS_RESPONSE=$(curl -s $BASE_URL/foods)
echo "Response: $FOODS_RESPONSE" | head -c 200

# Step 4: Create Order
echo -e "\n[4/6] Creating order..."
ORDER_RESPONSE=$(curl -s -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"foodId":1,"quantity":2},{"foodId":2,"quantity":1}]}')
echo "Response: $ORDER_RESPONSE"

# Step 5: Process Payment
echo -e "\n[5/6] Processing payment..."
PAYMENT_RESPONSE=$(curl -s -X POST $BASE_URL/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId":1,"method":"BANKING","amount":140000}')
echo "Response: $PAYMENT_RESPONSE"

# Step 6: Verify Order Status
echo -e "\n[6/6] Verifying order status..."
ORDER_STATUS=$(curl -s $BASE_URL/orders/1)
echo "Order: $ORDER_STATUS"

echo -e "\n=========================================="
echo "       Test Complete!"
echo "=========================================="
```

## Test 5: CORS Test

```javascript
// Run in browser console (with frontend at localhost:3000)

// Test 1: Simple GET
fetch('http://localhost:8080/api/foods')
  .then(res => res.json())
  .then(data => console.log('CORS GET OK:', data.length, 'items'))
  .catch(err => console.error('CORS GET Failed:', err));

// Test 2: POST with credentials
fetch('http://localhost:8080/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test', password: '123456' }),
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log('CORS POST OK:', data))
  .catch(err => console.error('CORS POST Failed:', err));
```

## Expected Results

### Success Indicators

```
✅ All services return 200/201 for valid requests
✅ Gateway routes requests correctly
✅ Inter-service calls work
✅ Order status updates after payment
✅ Notification appears in Payment Service console
✅ No CORS errors from frontend
```

### Common Failures

| Error | Cause | Fix |
|-------|-------|-----|
| Connection refused | Service not running | Start the service |
| 404 Not Found | Wrong URL or missing data | Check endpoint and seed data |
| CORS error | CORS not configured | Update allowedOrigins |
| 500 Internal Error | Code bug or service unavailable | Check logs |

## Troubleshooting Commands

```bash
# Check if port is in use
netstat -ano | findstr :8081

# Check service logs
# (View terminal where service is running)

# Test network connectivity
ping localhost

# Test specific port
curl -v http://localhost:8081/actuator/health
```

## Demo Checklist

Before demo, verify:

```markdown
- [ ] User Service: register, login, get users
- [ ] Food Service: get foods, create food
- [ ] Order Service: create order (with User+Food validation)
- [ ] Payment Service: process payment, update order, notification
- [ ] Gateway: all routes work
- [ ] Frontend: full flow works
- [ ] LAN: services accessible from other machines
```
