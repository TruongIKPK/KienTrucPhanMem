# API Gateway Route Configuration Template

## Basic Spring Cloud Gateway Setup

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.nhom03</groupId>
    <artifactId>api-gateway</artifactId>
    <version>1.0.0</version>
    <name>API Gateway</name>
    
    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2023.0.0</spring-cloud.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
    </dependencies>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## Route Configuration (YAML)

### Basic Routes

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
```

### CORS Configuration

```yaml
spring:
  cloud:
    gateway:
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
            exposedHeaders:
              - "Authorization"
            allowCredentials: true
            maxAge: 3600
```

### Full Configuration

```yaml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  
  cloud:
    gateway:
      # Default filters applied to all routes
      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Origin Access-Control-Allow-Credentials, RETAIN_UNIQUE
      
      routes:
        - id: user-service
          uri: http://${USER_SERVICE_HOST:localhost}:8081
          predicates:
            - Path=/api/users/**
          filters:
            - RewritePath=/api/users/(?<segment>.*), /${segment}
        
        - id: food-service
          uri: http://${FOOD_SERVICE_HOST:localhost}:8082
          predicates:
            - Path=/api/foods/**
          filters:
            - RewritePath=/api/foods/(?<segment>.*), /${segment}
        
        - id: order-service
          uri: http://${ORDER_SERVICE_HOST:localhost}:8083
          predicates:
            - Path=/api/orders/**
          filters:
            - RewritePath=/api/orders/(?<segment>.*), /${segment}
        
        - id: payment-service
          uri: http://${PAYMENT_SERVICE_HOST:localhost}:8084
          predicates:
            - Path=/api/payments/**
          filters:
            - RewritePath=/api/payments/(?<segment>.*), /${segment}
      
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

logging:
  level:
    org.springframework.cloud.gateway: DEBUG
    reactor.netty: DEBUG
```

---

## Route Configuration (Java Config)

```java
package com.nhom03.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // User Service
            .route("user-service", r -> r
                .path("/api/users/**")
                .filters(f -> f.rewritePath("/api/users/(?<segment>.*)", "/${segment}"))
                .uri("http://localhost:8081"))
            
            // Food Service
            .route("food-service", r -> r
                .path("/api/foods/**")
                .filters(f -> f.rewritePath("/api/foods/(?<segment>.*)", "/${segment}"))
                .uri("http://localhost:8082"))
            
            // Order Service
            .route("order-service", r -> r
                .path("/api/orders/**")
                .filters(f -> f.rewritePath("/api/orders/(?<segment>.*)", "/${segment}"))
                .uri("http://localhost:8083"))
            
            // Payment Service
            .route("payment-service", r -> r
                .path("/api/payments/**")
                .filters(f -> f.rewritePath("/api/payments/(?<segment>.*)", "/${segment}"))
                .uri("http://localhost:8084"))
            
            .build();
    }
}
```

---

## CORS Configuration (Java)

```java
package com.nhom03.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://192.168.1.100:3000"
        ));
        corsConfig.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}
```

---

## Bonus: Retry Filter

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/users/**
          filters:
            - RewritePath=/api/users/(?<segment>.*), /${segment}
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

---

## Bonus: Circuit Breaker

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/users/**
          filters:
            - name: CircuitBreaker
              args:
                name: userServiceCB
                fallbackUri: forward:/fallback/users
```

```java
@RestController
public class FallbackController {
    
    @GetMapping("/fallback/users")
    public ResponseEntity<Map<String, String>> usersFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(Map.of(
                "error", "User service is temporarily unavailable",
                "message", "Please try again later"
            ));
    }
}
```

---

## Logging Filter

```java
package com.nhom03.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingFilter implements GlobalFilter, Ordered {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        logger.info("Request: {} {}", 
            exchange.getRequest().getMethod(),
            exchange.getRequest().getURI());
        
        long startTime = System.currentTimeMillis();
        
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            long duration = System.currentTimeMillis() - startTime;
            logger.info("Response: {} - {}ms", 
                exchange.getResponse().getStatusCode(),
                duration);
        }));
    }
    
    @Override
    public int getOrder() {
        return -1;
    }
}
```

---

## Main Application

```java
package com.nhom03.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiGatewayApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```

---

## Environment Variables for LAN

```bash
# Windows
set USER_SERVICE_HOST=192.168.1.101
set FOOD_SERVICE_HOST=192.168.1.102
set ORDER_SERVICE_HOST=192.168.1.103
set PAYMENT_SERVICE_HOST=192.168.1.104
set FRONTEND_HOST=192.168.1.100

# Linux/Mac
export USER_SERVICE_HOST=192.168.1.101
export FOOD_SERVICE_HOST=192.168.1.102
export ORDER_SERVICE_HOST=192.168.1.103
export PAYMENT_SERVICE_HOST=192.168.1.104
export FRONTEND_HOST=192.168.1.100
```
