# API Gateway Configuration

## Overview

API Gateway sử dụng **Spring Cloud Gateway** làm single entry point cho Frontend, routing requests đến các backend services.

## Dependencies

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2023.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## Basic Configuration

```yaml
# application.yml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        # User Service
        - id: user-service
          uri: http://${USER_SERVICE_HOST:localhost}:8081
          predicates:
            - Path=/api/users/**
          filters:
            - RewritePath=/api/users/(?<segment>.*), /${segment}
        
        # Food Service
        - id: food-service
          uri: http://${FOOD_SERVICE_HOST:localhost}:8082
          predicates:
            - Path=/api/foods/**
          filters:
            - RewritePath=/api/foods/(?<segment>.*), /${segment}
        
        # Order Service
        - id: order-service
          uri: http://${ORDER_SERVICE_HOST:localhost}:8083
          predicates:
            - Path=/api/orders/**
          filters:
            - RewritePath=/api/orders/(?<segment>.*), /${segment}
        
        # Payment Service
        - id: payment-service
          uri: http://${PAYMENT_SERVICE_HOST:localhost}:8084
          predicates:
            - Path=/api/payments/**
          filters:
            - RewritePath=/api/payments/(?<segment>.*), /${segment}

      # Global CORS configuration
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:3000"
              - "http://${FRONTEND_HOST:localhost}:3000"
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

## Route Mapping

| Frontend URL | Gateway Route | Target Service |
|--------------|---------------|----------------|
| `/api/users/register` | `/api/users/**` | `http://user-service:8081/register` |
| `/api/users/login` | `/api/users/**` | `http://user-service:8081/login` |
| `/api/foods` | `/api/foods/**` | `http://food-service:8082/foods` |
| `/api/orders` | `/api/orders/**` | `http://order-service:8083/orders` |
| `/api/payments` | `/api/payments/**` | `http://payment-service:8084/payments` |

## Environment Variables

```bash
# LAN deployment
USER_SERVICE_HOST=192.168.1.101
FOOD_SERVICE_HOST=192.168.1.102
ORDER_SERVICE_HOST=192.168.1.103
PAYMENT_SERVICE_HOST=192.168.1.104
FRONTEND_HOST=192.168.1.100
```

## CORS Configuration (Alternative - Java Config)

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://192.168.1.100:3000"
        ));
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}
```

## Bonus Features

### 1. Retry Filter
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://${USER_SERVICE_HOST:localhost}:8081
          predicates:
            - Path=/api/users/**
          filters:
            - name: Retry
              args:
                retries: 3
                statuses: BAD_GATEWAY, SERVICE_UNAVAILABLE
                methods: GET, POST
                backoff:
                  firstBackoff: 100ms
                  maxBackoff: 500ms
                  factor: 2
```

### 2. Circuit Breaker
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          filters:
            - name: CircuitBreaker
              args:
                name: userServiceCB
                fallbackUri: forward:/fallback/users
```

### 3. Rate Limiting
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
```

### 4. Logging Filter
```java
@Component
public class LoggingFilter implements GlobalFilter, Ordered {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        logger.info("Request: {} {}", 
            exchange.getRequest().getMethod(),
            exchange.getRequest().getURI());
        
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            logger.info("Response: {}", 
                exchange.getResponse().getStatusCode());
        }));
    }
    
    @Override
    public int getOrder() {
        return -1;
    }
}
```

## Health Check Endpoint

```java
@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "api-gateway"
        ));
    }
}
```

## Main Application

```java
@SpringBootApplication
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```
