# Command: Create Endpoint

## Usage

```
@ai-agent create-endpoint <service> <entity> <endpoint-type>
```

## Examples

```
@ai-agent create-endpoint user-service User crud
@ai-agent create-endpoint food-service Food crud
@ai-agent create-endpoint order-service Order create-list
@ai-agent create-endpoint payment-service Payment create
```

## Endpoint Types

| Type | Endpoints Generated |
|------|---------------------|
| `crud` | GET all, GET by ID, POST, PUT, DELETE |
| `create-list` | POST, GET all, GET by ID |
| `create` | POST only |
| `read-only` | GET all, GET by ID |

## What This Command Does

1. Tạo Entity class với JPA annotations
2. Tạo Repository interface
3. Tạo Request/Response DTOs
4. Tạo Service class với business logic
5. Tạo Controller với REST endpoints

## Step-by-Step: CRUD Endpoint

### Step 1: Create Entity

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
    
    // Add fields from context/database.md
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### Step 2: Create Repository

```java
package com.nhom03.{servicename}.repository;

import com.nhom03.{servicename}.model.{Entity};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface {Entity}Repository extends JpaRepository<{Entity}, Long> {
    // Add custom queries as needed
}
```

### Step 3: Create DTOs

```java
// {Entity}Request.java
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

// {Entity}Response.java
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

### Step 4: Create Service

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
        return repository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("{Entity}", id));
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

### Step 5: Create Controller

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

## Specific Endpoint Examples

### User Service: Login Endpoint

```java
// In UserController
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(userService.login(request));
}

// In UserService
public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new InvalidCredentialsException("User not found"));
    
    if (!user.getPassword().equals(request.getPassword())) {
        throw new InvalidCredentialsException("Invalid password");
    }
    
    return LoginResponse.builder()
        .id(user.getId())
        .username(user.getUsername())
        .role(user.getRole().name())
        .token(generateSimpleToken(user))
        .build();
}
```

### Order Service: Create with Service Calls

```java
// In OrderService
public OrderResponse createOrder(OrderRequest request) {
    // Call User Service
    validateUser(request.getUserId());
    
    // Call Food Service for each item
    List<OrderItem> items = request.getItems().stream()
        .map(this::buildOrderItem)
        .collect(Collectors.toList());
    
    double total = items.stream()
        .mapToDouble(OrderItem::getSubtotal)
        .sum();
    
    Order order = Order.builder()
        .userId(request.getUserId())
        .items(items)
        .totalAmount(total)
        .status(OrderStatus.PENDING)
        .build();
    
    return toResponse(orderRepository.save(order));
}

private void validateUser(Long userId) {
    try {
        restTemplate.getForObject(userServiceUrl + "/users/" + userId, UserResponse.class);
    } catch (HttpClientErrorException.NotFound e) {
        throw new ResourceNotFoundException("User", userId);
    }
}

private OrderItem buildOrderItem(OrderItemRequest req) {
    FoodResponse food = restTemplate.getForObject(
        foodServiceUrl + "/foods/" + req.getFoodId(),
        FoodResponse.class
    );
    
    return OrderItem.builder()
        .foodId(food.getId())
        .foodName(food.getName())
        .price(food.getPrice())
        .quantity(req.getQuantity())
        .subtotal(food.getPrice() * req.getQuantity())
        .build();
}
```

## Test Endpoints

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

## Related

- Template: `core/templates/api-endpoint.md`
- Rules: `core/rules/api-design.md`
- API Docs: `context/api.md`
