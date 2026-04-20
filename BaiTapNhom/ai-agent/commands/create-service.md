# Command: Create Service

## Usage

```
@ai-agent create-service <service-name> <port>
```

## Examples

```
@ai-agent create-service user-service 8081
@ai-agent create-service food-service 8082
@ai-agent create-service order-service 8083
@ai-agent create-service payment-service 8084
```

## What This Command Does

1. Tạo Spring Boot project structure
2. Generate pom.xml với dependencies
3. Create application.yml với port và H2 config
4. Setup CORS configuration
5. Create exception handler
6. Create main application class

## Output Structure

Tất cả services nằm trong thư mục `backend/`:

```
backend/{service-name}/
├── src/main/java/com/nhom03/{servicename}/
│   ├── config/
│   │   └── CorsConfig.java
│   ├── exception/
│   │   ├── ResourceNotFoundException.java
│   │   └── GlobalExceptionHandler.java
│   └── {ServiceName}Application.java
├── src/main/resources/
│   └── application.yml
└── pom.xml
```

## Step-by-Step Instructions

### Step 1: Create Directory Structure

```bash
# Từ thư mục root của repo
mkdir -p backend/{service-name}/src/main/java/com/nhom03/{servicename}/config
mkdir -p backend/{service-name}/src/main/java/com/nhom03/{servicename}/exception
mkdir -p backend/{service-name}/src/main/java/com/nhom03/{servicename}/controller
mkdir -p backend/{service-name}/src/main/java/com/nhom03/{servicename}/service
mkdir -p backend/{service-name}/src/main/java/com/nhom03/{servicename}/repository
mkdir -p backend/{service-name}/src/main/java/com/nhom03/{servicename}/model
mkdir -p backend/{service-name}/src/main/java/com/nhom03/{servicename}/dto
mkdir -p backend/{service-name}/src/main/resources
```

### Step 2: Create pom.xml

See template: `core/templates/service.md`

Replace:
- `{service-name}` → actual service name (e.g., `user-service`)
- `{Service Name}` → display name (e.g., `User Service`)

### Step 3: Create application.yml

```yaml
server:
  port: {PORT}

spring:
  application:
    name: {service-name}
  
  datasource:
    url: jdbc:h2:mem:{service}db
    driver-class-name: org.h2.Driver
    username: sa
    password:
  
  h2:
    console:
      enabled: true
      path: /h2-console
  
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
```

### Step 4: Create Main Application

```java
package com.nhom03.{servicename};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class {ServiceName}Application {
    
    public static void main(String[] args) {
        SpringApplication.run({ServiceName}Application.class, args);
    }
}
```

### Step 5: Create CORS Config

```java
package com.nhom03.{servicename}.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000", "http://localhost:8080")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Step 6: Create Exception Classes

```java
// ResourceNotFoundException.java
package com.nhom03.{servicename}.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " not found with id: " + id);
    }
}

// GlobalExceptionHandler.java
package com.nhom03.{servicename}.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .reduce((a, b) -> a + ", " + b)
            .orElse("Validation failed");
        return buildError(HttpStatus.BAD_REQUEST, message);
    }
    
    private ResponseEntity<Map<String, Object>> buildError(HttpStatus status, String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", status.value());
        error.put("error", status.getReasonPhrase());
        error.put("message", message);
        return ResponseEntity.status(status).body(error);
    }
}
```

### Step 7: Run Service

```bash
cd backend/{service-name}
mvn spring-boot:run
```

### Step 8: Verify

```bash
# Check service is running
curl http://localhost:{PORT}/actuator/health

# Access H2 console
# Open browser: http://localhost:{PORT}/h2-console
```

## Service-Specific Notes

### User Service (8081)
- Add User entity, repository, service, controller
- Implement register/login endpoints
- Optional: JWT token generation

### Food Service (8082)
- Add Food entity with Category enum
- Add DataSeeder for sample data
- CRUD endpoints for foods

### Order Service (8083)
- Add RestTemplate configuration
- Add service URLs for User and Food services
- Implement inter-service calls

### Payment Service (8084)
- Add RestTemplate configuration
- Add Order service URL
- Implement notification logging

## Related

- Template: `core/templates/service.md`
- Workflow: `workflows/service-flow.md`
- Context: `context/stack.md`
