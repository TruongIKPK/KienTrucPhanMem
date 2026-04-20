# Service Creation Workflow

## Overview

Quy trình tạo Spring Boot service mới trong dự án Mini Food Ordering System.

## Service Creation Flow

```
┌────────────────┐
│ 1. Setup       │
│    Project     │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 2. Configure   │
│    App         │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 3. Create      │
│    Models      │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 4. Create      │
│    Repository  │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 5. Create      │
│    Service     │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 6. Create      │
│   Controller   │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 7. Config      │
│    CORS        │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 8. Test &      │
│    Run         │
└────────────────┘
```

---

## Step 1: Setup Project

### Option A: Spring Initializr (Recommended)

1. Go to https://start.spring.io
2. Configure:
   - Project: Maven
   - Language: Java
   - Spring Boot: 3.2.x
   - Group: com.nhom03
   - Artifact: {service-name}
   - Packaging: Jar
   - Java: 17
3. Add Dependencies:
   - Spring Web
   - Spring Data JPA
   - H2 Database
   - Lombok
   - Validation
4. Generate & Download

### Option B: Manual Setup

```bash
# Từ root của repo
mkdir -p backend/{service-name}
cd backend/{service-name}
```

Create `pom.xml` from template: `core/templates/service.md`

### Project Structure (Monorepo)

Tất cả services nằm trong thư mục `backend/`:

```
backend/{service-name}/
├── src/main/java/com/nhom03/{servicename}/
│   ├── {ServiceName}Application.java
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── config/
│   └── exception/
├── src/main/resources/
│   └── application.yml
└── pom.xml
```

---

## Step 2: Configure Application

### application.yml

```yaml
server:
  port: {PORT}  # 8081/8082/8083/8084

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

logging:
  level:
    com.nhom03: DEBUG
```

### Main Application

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

---

## Step 3: Create Models

### Entity

```java
package com.nhom03.{servicename}.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "{entities}")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class {Entity} {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    // Add fields based on context/database.md
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### Enums (if needed)

```java
package com.nhom03.{servicename}.model;

public enum Status {
    ACTIVE,
    INACTIVE
}
```

---

## Step 4: Create Repository

```java
package com.nhom03.{servicename}.repository;

import com.nhom03.{servicename}.model.{Entity};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface {Entity}Repository extends JpaRepository<{Entity}, Long> {
    
    // Custom query methods as needed
    Optional<{Entity}> findByName(String name);
    
    List<{Entity}> findByStatus(Status status);
}
```

---

## Step 5: Create Service

### DTOs

```java
// Request DTO
package com.nhom03.{servicename}.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class {Entity}Request {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    // Add fields with validation
}

// Response DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class {Entity}Response {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
}
```

### Service Class

```java
package com.nhom03.{servicename}.service;

import com.nhom03.{servicename}.dto.*;
import com.nhom03.{servicename}.exception.ResourceNotFoundException;
import com.nhom03.{servicename}.model.{Entity};
import com.nhom03.{servicename}.repository.{Entity}Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class {Entity}Service {
    
    private final {Entity}Repository repository;
    
    public List<{Entity}Response> getAll() {
        return repository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public {Entity}Response getById(Long id) {
        {Entity} entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("{Entity}", id));
        return toResponse(entity);
    }
    
    public {Entity}Response create({Entity}Request request) {
        {Entity} entity = {Entity}.builder()
            .name(request.getName())
            .build();
        return toResponse(repository.save(entity));
    }
    
    public {Entity}Response update(Long id, {Entity}Request request) {
        {Entity} entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("{Entity}", id));
        entity.setName(request.getName());
        return toResponse(repository.save(entity));
    }
    
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("{Entity}", id);
        }
        repository.deleteById(id);
    }
    
    private {Entity}Response toResponse({Entity} entity) {
        return {Entity}Response.builder()
            .id(entity.getId())
            .name(entity.getName())
            .createdAt(entity.getCreatedAt())
            .build();
    }
}
```

---

## Step 6: Create Controller

```java
package com.nhom03.{servicename}.controller;

import com.nhom03.{servicename}.dto.*;
import com.nhom03.{servicename}.service.{Entity}Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/{entities}")
@RequiredArgsConstructor
public class {Entity}Controller {
    
    private final {Entity}Service service;
    
    @GetMapping
    public ResponseEntity<List<{Entity}Response>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<{Entity}Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }
    
    @PostMapping
    public ResponseEntity<{Entity}Response> create(
            @Valid @RequestBody {Entity}Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(service.create(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<{Entity}Response> update(
            @PathVariable Long id,
            @Valid @RequestBody {Entity}Request request) {
        return ResponseEntity.ok(service.update(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Step 7: Configure CORS

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
                    .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:8080"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Exception Handler

```java
package com.nhom03.{servicename}.exception;

// ResourceNotFoundException.java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " not found with id: " + id);
    }
}

// GlobalExceptionHandler.java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", 404);
        error.put("message", ex.getMessage());
        error.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", 400);
        error.put("message", "Validation failed");
        error.put("errors", ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.toList()));
        return ResponseEntity.badRequest().body(error);
    }
}
```

---

## Step 8: Test & Run

### Run Service

```bash
# Từ root của repo
cd backend/{service-name}
mvn spring-boot:run
```

### Test with curl/Postman

```bash
# GET all
curl http://localhost:{PORT}/{entities}

# GET by ID
curl http://localhost:{PORT}/{entities}/1

# POST
curl -X POST http://localhost:{PORT}/{entities} \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'

# PUT
curl -X PUT http://localhost:{PORT}/{entities}/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated"}'

# DELETE
curl -X DELETE http://localhost:{PORT}/{entities}/1
```

### H2 Console

Access: `http://localhost:{PORT}/h2-console`
- JDBC URL: `jdbc:h2:mem:{service}db`
- User: `sa`
- Password: (empty)

---

## Quick Reference: Service Mapping

| Service | Port | Package | Main Entity |
|---------|------|---------|-------------|
| User Service | 8081 | userservice | User |
| Food Service | 8082 | foodservice | Food |
| Order Service | 8083 | orderservice | Order, OrderItem |
| Payment Service | 8084 | paymentservice | Payment |
