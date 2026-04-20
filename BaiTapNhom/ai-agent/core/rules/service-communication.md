# Inter-Service Communication Rules

## Overview

Trong Service-Based Architecture, các services giao tiếp với nhau qua REST API (HTTP). Document này mô tả patterns và best practices cho inter-service communication.

## Communication Flow

```
┌─────────────┐    REST    ┌─────────────┐
│   Order     │ ─────────► │    User     │
│   Service   │            │   Service   │
└─────────────┘            └─────────────┘
       │
       │ REST
       ▼
┌─────────────┐
│    Food     │
│   Service   │
└─────────────┘

┌─────────────┐    REST    ┌─────────────┐
│  Payment    │ ─────────► │    Order    │
│   Service   │            │   Service   │
└─────────────┘            └─────────────┘
```

---

## RestTemplate Configuration

### Bean Configuration
```java
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

### Service URLs Configuration
```yaml
# application.yml
services:
  user:
    url: ${USER_SERVICE_URL:http://localhost:8081}
  food:
    url: ${FOOD_SERVICE_URL:http://localhost:8082}
  order:
    url: ${ORDER_SERVICE_URL:http://localhost:8083}
```

```java
@ConfigurationProperties(prefix = "services")
@Data
public class ServiceUrls {
    private ServiceUrl user;
    private ServiceUrl food;
    private ServiceUrl order;
    
    @Data
    public static class ServiceUrl {
        private String url;
    }
}
```

---

## Order Service → User Service

### Validate User
```java
@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final RestTemplate restTemplate;
    private final ServiceUrls serviceUrls;
    private final OrderRepository orderRepository;
    
    public Order createOrder(OrderRequest request) {
        // 1. Validate user exists
        UserResponse user = validateUser(request.getUserId());
        
        // 2. Get food details
        List<OrderItem> items = request.getItems().stream()
            .map(this::createOrderItem)
            .collect(Collectors.toList());
        
        // 3. Create order
        Order order = Order.builder()
            .userId(request.getUserId())
            .items(items)
            .totalAmount(calculateTotal(items))
            .status(OrderStatus.PENDING)
            .build();
        
        return orderRepository.save(order);
    }
    
    private UserResponse validateUser(Long userId) {
        try {
            String url = serviceUrls.getUser().getUrl() + "/users/" + userId;
            return restTemplate.getForObject(url, UserResponse.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResourceNotFoundException("User not found: " + userId);
        } catch (RestClientException e) {
            throw new ServiceUnavailableException("User service unavailable");
        }
    }
}
```

---

## Order Service → Food Service

### Get Food Details
```java
@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final RestTemplate restTemplate;
    private final ServiceUrls serviceUrls;
    
    private OrderItem createOrderItem(OrderItemRequest itemRequest) {
        // Get food details from Food Service
        FoodResponse food = getFoodDetails(itemRequest.getFoodId());
        
        return OrderItem.builder()
            .foodId(food.getId())
            .foodName(food.getName())
            .price(food.getPrice())
            .quantity(itemRequest.getQuantity())
            .subtotal(food.getPrice() * itemRequest.getQuantity())
            .build();
    }
    
    private FoodResponse getFoodDetails(Long foodId) {
        try {
            String url = serviceUrls.getFood().getUrl() + "/foods/" + foodId;
            return restTemplate.getForObject(url, FoodResponse.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResourceNotFoundException("Food not found: " + foodId);
        } catch (RestClientException e) {
            throw new ServiceUnavailableException("Food service unavailable");
        }
    }
}
```

---

## Payment Service → Order Service

### Update Order Status
```java
@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final RestTemplate restTemplate;
    private final ServiceUrls serviceUrls;
    private final PaymentRepository paymentRepository;
    
    public Payment processPayment(PaymentRequest request) {
        // 1. Get order details
        OrderResponse order = getOrder(request.getOrderId());
        
        // 2. Validate amount
        if (!order.getTotalAmount().equals(request.getAmount())) {
            throw new InvalidPaymentException("Amount mismatch");
        }
        
        // 3. Process payment (simulated)
        Payment payment = Payment.builder()
            .orderId(request.getOrderId())
            .method(request.getMethod())
            .amount(request.getAmount())
            .status(PaymentStatus.SUCCESS)
            .build();
        
        payment = paymentRepository.save(payment);
        
        // 4. Update order status
        updateOrderStatus(request.getOrderId(), "PAID");
        
        // 5. Send notification
        sendNotification(order);
        
        return payment;
    }
    
    private OrderResponse getOrder(Long orderId) {
        try {
            String url = serviceUrls.getOrder().getUrl() + "/orders/" + orderId;
            return restTemplate.getForObject(url, OrderResponse.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResourceNotFoundException("Order not found: " + orderId);
        }
    }
    
    private void updateOrderStatus(Long orderId, String status) {
        try {
            String url = serviceUrls.getOrder().getUrl() + "/orders/" + orderId + "/status";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, String> body = Map.of("status", status);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            
            restTemplate.put(url, entity);
        } catch (RestClientException e) {
            // Log error but don't fail payment
            log.error("Failed to update order status", e);
        }
    }
    
    private void sendNotification(OrderResponse order) {
        // Console log notification
        System.out.println("===========================================");
        System.out.println("🎉 NOTIFICATION: Đặt hàng thành công!");
        System.out.println("Order #" + order.getId());
        System.out.println("Total: " + order.getTotalAmount() + "đ");
        System.out.println("===========================================");
    }
}
```

---

## Error Handling

### Custom Exceptions
```java
public class ServiceUnavailableException extends RuntimeException {
    public ServiceUnavailableException(String message) {
        super(message);
    }
}

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

### Exception Handler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleServiceUnavailable(ServiceUnavailableException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.SERVICE_UNAVAILABLE.value(),
            ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
```

---

## Retry Pattern (Bonus)

### With Spring Retry
```xml
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
</dependency>
```

```java
@Configuration
@EnableRetry
public class RetryConfig {
}

@Service
public class OrderService {
    
    @Retryable(
        value = {RestClientException.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    private UserResponse validateUser(Long userId) {
        String url = serviceUrls.getUser().getUrl() + "/users/" + userId;
        return restTemplate.getForObject(url, UserResponse.class);
    }
    
    @Recover
    private UserResponse recoverValidateUser(RestClientException e, Long userId) {
        throw new ServiceUnavailableException("User service unavailable after retries");
    }
}
```

---

## Circuit Breaker Pattern (Bonus)

### With Resilience4j
```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
</dependency>
```

```java
@Service
public class OrderService {
    
    @CircuitBreaker(name = "userService", fallbackMethod = "fallbackValidateUser")
    private UserResponse validateUser(Long userId) {
        String url = serviceUrls.getUser().getUrl() + "/users/" + userId;
        return restTemplate.getForObject(url, UserResponse.class);
    }
    
    private UserResponse fallbackValidateUser(Long userId, Exception e) {
        throw new ServiceUnavailableException("User service is currently unavailable");
    }
}
```

---

## Best Practices

### DO
- Set connection and read timeouts
- Handle service unavailability gracefully
- Log inter-service calls
- Use DTOs for communication
- Validate responses

### DON'T
- Create tight coupling between services
- Share database between services
- Make synchronous calls in loops (use batch if needed)
- Ignore errors from other services
- Expose internal service URLs to frontend

---

## Testing Inter-Service Communication

### Mock Server for Tests
```java
@SpringBootTest
@AutoConfigureMockMvc
public class OrderServiceIntegrationTest {
    
    @MockBean
    private RestTemplate restTemplate;
    
    @Test
    void createOrder_ShouldValidateUser() {
        // Mock user service response
        when(restTemplate.getForObject(
            contains("/users/1"),
            eq(UserResponse.class)
        )).thenReturn(new UserResponse(1L, "john", "USER"));
        
        // Mock food service response
        when(restTemplate.getForObject(
            contains("/foods/1"),
            eq(FoodResponse.class)
        )).thenReturn(new FoodResponse(1L, "Phở bò", 45000.0));
        
        // Test create order
        OrderRequest request = new OrderRequest(1L, List.of(
            new OrderItemRequest(1L, 2)
        ));
        
        Order result = orderService.createOrder(request);
        
        assertNotNull(result);
        assertEquals(90000.0, result.getTotalAmount());
    }
}
```
