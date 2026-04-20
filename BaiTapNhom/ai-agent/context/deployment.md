# LAN Deployment Guide

## Overview

Hướng dẫn triển khai hệ thống trên mạng LAN với 5 máy tính riêng biệt.

## Port Mapping

| Service | Port | Machine |
|---------|------|---------|
| Frontend | 3000 | Máy 1 |
| User Service | 8081 | Máy 2 |
| Food Service | 8082 | Máy 3 |
| Order Service | 8083 | Máy 4 |
| Payment Service | 8084 | Máy 5 |
| API Gateway | 8080 | Máy 5 |

## Network Setup

### Step 1: Xác định IP của từng máy

```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

Ví dụ:
- Máy 1 (Frontend): `192.168.1.100`
- Máy 2 (User Service): `192.168.1.101`
- Máy 3 (Food Service): `192.168.1.102`
- Máy 4 (Order Service): `192.168.1.103`
- Máy 5 (Payment + Gateway): `192.168.1.104`

### Step 2: Tắt Firewall hoặc mở ports

```bash
# Windows - Mở port trong Windows Firewall
netsh advfirewall firewall add rule name="Spring Boot" dir=in action=allow protocol=TCP localport=8081-8084

# Linux
sudo ufw allow 8081:8084/tcp
```

## Configuration

### Frontend (.env)

```bash
# Nếu dùng Gateway
VITE_API_URL=http://192.168.1.104:8080/api

# Nếu KHÔNG dùng Gateway (gọi trực tiếp)
VITE_USER_SERVICE_URL=http://192.168.1.101:8081
VITE_FOOD_SERVICE_URL=http://192.168.1.102:8082
VITE_ORDER_SERVICE_URL=http://192.168.1.103:8083
VITE_PAYMENT_SERVICE_URL=http://192.168.1.104:8084
```

### API Gateway (application.yml)

```yaml
server:
  port: 8080

spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://192.168.1.101:8081
          predicates:
            - Path=/api/users/**
          filters:
            - RewritePath=/api/users/(?<segment>.*), /${segment}
        
        - id: food-service
          uri: http://192.168.1.102:8082
          predicates:
            - Path=/api/foods/**
          filters:
            - RewritePath=/api/foods/(?<segment>.*), /${segment}
        
        - id: order-service
          uri: http://192.168.1.103:8083
          predicates:
            - Path=/api/orders/**
          filters:
            - RewritePath=/api/orders/(?<segment>.*), /${segment}
        
        - id: payment-service
          uri: http://192.168.1.104:8084
          predicates:
            - Path=/api/payments/**
          filters:
            - RewritePath=/api/payments/(?<segment>.*), /${segment}

      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins:
              - "http://192.168.1.100:3000"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders:
              - "*"
            allowCredentials: true
```

### Backend Services (CORS Config)

Mỗi service cần cấu hình CORS cho phép Frontend:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://192.168.1.100:3000",  // Frontend
                        "http://192.168.1.104:8080"   // Gateway
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Order Service (Inter-service calls)

```java
@Service
public class OrderService {
    
    private final String USER_SERVICE_URL = "http://192.168.1.101:8081";
    private final String FOOD_SERVICE_URL = "http://192.168.1.102:8082";
    
    private final RestTemplate restTemplate;
    
    public Order createOrder(OrderRequest request) {
        // Validate user
        UserResponse user = restTemplate.getForObject(
            USER_SERVICE_URL + "/users/" + request.getUserId(),
            UserResponse.class
        );
        
        // Get food info
        for (OrderItemRequest item : request.getItems()) {
            FoodResponse food = restTemplate.getForObject(
                FOOD_SERVICE_URL + "/foods/" + item.getFoodId(),
                FoodResponse.class
            );
        }
        
        // Create order...
    }
}
```

### Payment Service (Inter-service calls)

```java
@Service
public class PaymentService {
    
    private final String ORDER_SERVICE_URL = "http://192.168.1.103:8083";
    
    public Payment processPayment(PaymentRequest request) {
        // Process payment...
        
        // Update order status
        restTemplate.put(
            ORDER_SERVICE_URL + "/orders/" + request.getOrderId() + "/status",
            new StatusUpdate("PAID")
        );
        
        // Send notification
        System.out.println("User đã đặt đơn #" + request.getOrderId() + " thành công");
        
        return payment;
    }
}
```

## Startup Order

> **Lưu ý**: Tất cả commands chạy từ root của repository (`BaiTapNhom/`)

1. **Máy 2**: Start User Service
   ```bash
   cd backend/user-service
   mvn spring-boot:run
   ```

2. **Máy 3**: Start Food Service
   ```bash
   cd backend/food-service
   mvn spring-boot:run
   ```

3. **Máy 4**: Start Order Service
   ```bash
   cd backend/order-service
   mvn spring-boot:run
   ```

4. **Máy 5**: Start Payment Service + API Gateway
   ```bash
   cd backend/payment-service
   mvn spring-boot:run
   
   # Terminal 2
   cd backend/api-gateway
   mvn spring-boot:run
   ```

5. **Máy 1**: Start Frontend
   ```bash
   cd frontend
   npm run dev -- --host
   ```

## Verify Deployment

### Test từng service

```bash
# User Service
curl http://192.168.1.101:8081/users

# Food Service
curl http://192.168.1.102:8082/foods

# Order Service
curl http://192.168.1.103:8083/orders

# Payment Service
curl http://192.168.1.104:8084/payments

# Gateway
curl http://192.168.1.104:8080/api/foods
```

### Test từ Frontend

1. Mở browser: `http://192.168.1.100:3000`
2. Test đăng ký user
3. Test đăng nhập
4. Test xem menu
5. Test tạo order
6. Test thanh toán

## Troubleshooting

### 1. Connection refused
- Check firewall
- Verify IP và port
- Ensure service đang chạy

### 2. CORS error
- Check CORS config của backend
- Verify allowedOrigins

### 3. Service không gọi được nhau
- Check IP configuration
- Verify network connectivity: `ping 192.168.1.x`

### 4. Frontend không connect được
- Check VITE_API_URL
- Verify Gateway đang chạy
- Check browser console for errors

## Demo Checklist

- [ ] User đăng ký thành công
- [ ] User đăng nhập thành công
- [ ] Xem được danh sách món
- [ ] Thêm món vào giỏ hàng
- [ ] Tạo order thành công
- [ ] Thanh toán thành công
- [ ] Nhận được thông báo
