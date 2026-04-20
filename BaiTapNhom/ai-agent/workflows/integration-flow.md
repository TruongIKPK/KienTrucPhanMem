# Integration Workflow

## Overview

Quy trình tích hợp các services trong dự án Mini Food Ordering System.

## Integration Points

```
┌─────────────┐
│  Frontend   │
│   :3000     │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│ API Gateway │
│   :8080     │
└──────┬──────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│    User     │ │    Food     │ │    Order    │ │   Payment   │
│   :8081     │ │   :8082     │ │   :8083     │ │   :8084     │
└─────────────┘ └─────────────┘ └─────┬───────┘ └──────┬──────┘
                                      │                │
                               ┌──────┴────┐           │
                               ▼           ▼           ▼
                            User Svc   Food Svc    Order Svc
```

---

## Integration Phases

### Phase 1: Individual Service Testing

```markdown
Checklist for each service:
- [ ] Service starts without errors
- [ ] All endpoints return correct responses
- [ ] H2 console accessible
- [ ] CORS configured
```

### Phase 2: Frontend → Gateway Integration

```markdown
- [ ] Gateway routes correctly
- [ ] Frontend can reach Gateway
- [ ] CORS works through Gateway
```

### Phase 3: Backend → Backend Integration

```markdown
- [ ] Order Service → User Service
- [ ] Order Service → Food Service
- [ ] Payment Service → Order Service
```

### Phase 4: End-to-End Testing

```markdown
- [ ] Full user flow works
- [ ] Error handling works
- [ ] Notifications appear
```

---

## Phase 1: Individual Service Testing

### Test Each Service Independently

**User Service (:8081)**
```bash
# Register
curl -X POST http://localhost:8081/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"123456","email":"john@test.com"}'

# Login
curl -X POST http://localhost:8081/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"123456"}'

# Get users
curl http://localhost:8081/users
```

**Food Service (:8082)**
```bash
# Get all foods
curl http://localhost:8082/foods

# Get food by ID
curl http://localhost:8082/foods/1

# Create food
curl -X POST http://localhost:8082/foods \
  -H "Content-Type: application/json" \
  -d '{"name":"Phở bò","price":45000,"category":"MAIN"}'
```

**Order Service (:8083)**
```bash
# Create order
curl -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"foodId":1,"quantity":2}]}'

# Get orders
curl http://localhost:8083/orders
```

**Payment Service (:8084)**
```bash
# Process payment
curl -X POST http://localhost:8084/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId":1,"method":"COD","amount":90000}'
```

---

## Phase 2: Frontend → Gateway Integration

### Gateway Route Testing

```bash
# Through Gateway
curl http://localhost:8080/api/users
curl http://localhost:8080/api/foods
curl http://localhost:8080/api/orders
curl http://localhost:8080/api/payments
```

### Frontend API Configuration

```javascript
// src/services/api.js
const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### CORS Verification

```javascript
// Test from browser console
fetch('http://localhost:8080/api/foods')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('CORS error:', err));
```

---

## Phase 3: Backend → Backend Integration

### Order Service Integration

**Order Service needs to call:**
1. User Service - validate user exists
2. Food Service - get food details

```java
// OrderService.java
@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final RestTemplate restTemplate;
    
    // URLs from application.yml or environment
    @Value("${services.user.url:http://localhost:8081}")
    private String userServiceUrl;
    
    @Value("${services.food.url:http://localhost:8082}")
    private String foodServiceUrl;
    
    public Order createOrder(OrderRequest request) {
        // Step 1: Validate user
        UserResponse user = restTemplate.getForObject(
            userServiceUrl + "/users/" + request.getUserId(),
            UserResponse.class
        );
        
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }
        
        // Step 2: Get food details
        List<OrderItem> items = new ArrayList<>();
        double total = 0;
        
        for (OrderItemRequest itemReq : request.getItems()) {
            FoodResponse food = restTemplate.getForObject(
                foodServiceUrl + "/foods/" + itemReq.getFoodId(),
                FoodResponse.class
            );
            
            if (food == null) {
                throw new ResourceNotFoundException("Food not found: " + itemReq.getFoodId());
            }
            
            OrderItem item = OrderItem.builder()
                .foodId(food.getId())
                .foodName(food.getName())
                .price(food.getPrice())
                .quantity(itemReq.getQuantity())
                .subtotal(food.getPrice() * itemReq.getQuantity())
                .build();
            
            items.add(item);
            total += item.getSubtotal();
        }
        
        // Step 3: Create order
        Order order = Order.builder()
            .userId(request.getUserId())
            .items(items)
            .totalAmount(total)
            .status(OrderStatus.PENDING)
            .build();
        
        return orderRepository.save(order);
    }
}
```

### Payment Service Integration

**Payment Service needs to call:**
1. Order Service - update order status

```java
// PaymentService.java
@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final RestTemplate restTemplate;
    
    @Value("${services.order.url:http://localhost:8083}")
    private String orderServiceUrl;
    
    public Payment processPayment(PaymentRequest request) {
        // Step 1: Create payment record
        Payment payment = Payment.builder()
            .orderId(request.getOrderId())
            .method(request.getMethod())
            .amount(request.getAmount())
            .status(PaymentStatus.SUCCESS)
            .build();
        
        payment = paymentRepository.save(payment);
        
        // Step 2: Update order status
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, String> statusUpdate = Map.of("status", "PAID");
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(statusUpdate, headers);
            
            restTemplate.put(
                orderServiceUrl + "/orders/" + request.getOrderId() + "/status",
                entity
            );
        } catch (Exception e) {
            // Log but don't fail payment
            log.error("Failed to update order status", e);
        }
        
        // Step 3: Send notification
        sendNotification(request.getOrderId());
        
        return payment;
    }
    
    private void sendNotification(Long orderId) {
        System.out.println("==========================================");
        System.out.println("🎉 THÔNG BÁO: Thanh toán thành công!");
        System.out.println("Đơn hàng #" + orderId + " đã được thanh toán");
        System.out.println("==========================================");
    }
}
```

### RestTemplate Configuration

```java
// RestTemplateConfig.java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();
    }
}
```

---

## Phase 4: End-to-End Testing

### Test Script

```markdown
## E2E Test: Complete Order Flow

### Prerequisites
- All services running
- Database seeded with sample data

### Steps

1. **Register User**
   - POST /api/users/register
   - Expected: 201 Created, user object

2. **Login User**
   - POST /api/users/login
   - Expected: 200 OK, token in response

3. **View Menu**
   - GET /api/foods
   - Expected: 200 OK, list of foods

4. **Create Order**
   - POST /api/orders
   - Body: { userId, items: [...] }
   - Expected: 201 Created, order with PENDING status

5. **Process Payment**
   - POST /api/payments
   - Body: { orderId, method, amount }
   - Expected: 200 OK, payment success
   - Verify: Order status changed to PAID
   - Verify: Notification in console

6. **View Orders**
   - GET /api/orders?userId={id}
   - Expected: Order with PAID status
```

### Automated Test Script (curl)

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api"

echo "=== E2E Test ==="

# 1. Register
echo "\n1. Register user..."
curl -s -X POST $BASE_URL/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456","email":"test@test.com"}'

# 2. Login
echo "\n2. Login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}')
echo $LOGIN_RESPONSE

# 3. Get Foods
echo "\n3. Get foods..."
curl -s $BASE_URL/foods | head -c 200

# 4. Create Order
echo "\n4. Create order..."
ORDER_RESPONSE=$(curl -s -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"foodId":1,"quantity":2}]}')
echo $ORDER_RESPONSE
ORDER_ID=$(echo $ORDER_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

# 5. Pay Order
echo "\n5. Pay order..."
curl -s -X POST $BASE_URL/payments \
  -H "Content-Type: application/json" \
  -d "{\"orderId\":$ORDER_ID,\"method\":\"COD\",\"amount\":90000}"

# 6. Check Order Status
echo "\n6. Check order status..."
curl -s $BASE_URL/orders/$ORDER_ID

echo "\n=== Test Complete ==="
```

---

## Troubleshooting

### Service Not Responding

```bash
# Check if service is running
curl http://localhost:{PORT}/actuator/health

# Check logs
# In service terminal, look for errors
```

### Inter-Service Call Failed

```bash
# Test direct call
curl http://localhost:8081/users/1

# Check if RestTemplate is configured
# Check URL in application.yml
```

### CORS Error

```bash
# Verify CORS config in Gateway
# Check allowedOrigins includes frontend URL

# Test preflight
curl -X OPTIONS http://localhost:8080/api/foods \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
```

### Data Not Persisting

```
- H2 in-memory resets on restart (expected)
- Check DataSeeder runs on startup
- Access H2 console to verify data
```

---

## LAN Integration Checklist

```markdown
- [ ] Each service uses correct IP (not localhost)
- [ ] Firewall allows ports 8080-8084
- [ ] CORS allows all team IPs
- [ ] Frontend .env has correct Gateway IP
- [ ] All services can ping each other
```
