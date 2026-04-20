# REST API Endpoint Template

## Basic CRUD Endpoint Pattern

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
    
    // Add more fields as needed
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### Repository

```java
package com.nhom03.{servicename}.repository;

import com.nhom03.{servicename}.model.{Entity};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface {Entity}Repository extends JpaRepository<{Entity}, Long> {
    
    // Custom query methods
    Optional<{Entity}> findByName(String name);
    
    List<{Entity}> findByNameContaining(String keyword);
}
```

### DTO - Request

```java
package com.nhom03.{servicename}.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class {Entity}Request {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    private String name;
    
    // Add more fields with validation
}
```

### DTO - Response

```java
package com.nhom03.{servicename}.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class {Entity}Response {
    
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    
    // Add more fields
}
```

### Service

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
    
    // GET all
    public List<{Entity}Response> getAll() {
        return repository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    // GET by ID
    public {Entity}Response getById(Long id) {
        {Entity} entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("{Entity}", id));
        return toResponse(entity);
    }
    
    // POST - Create
    public {Entity}Response create({Entity}Request request) {
        {Entity} entity = {Entity}.builder()
            .name(request.getName())
            .build();
        
        return toResponse(repository.save(entity));
    }
    
    // PUT - Update
    public {Entity}Response update(Long id, {Entity}Request request) {
        {Entity} entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("{Entity}", id));
        
        entity.setName(request.getName());
        // Update other fields
        
        return toResponse(repository.save(entity));
    }
    
    // DELETE
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("{Entity}", id);
        }
        repository.deleteById(id);
    }
    
    // Mapper: Entity -> Response
    private {Entity}Response toResponse({Entity} entity) {
        return {Entity}Response.builder()
            .id(entity.getId())
            .name(entity.getName())
            .createdAt(entity.getCreatedAt())
            .build();
    }
}
```

### Controller

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
    
    // GET all
    @GetMapping
    public ResponseEntity<List<{Entity}Response>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
    
    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<{Entity}Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }
    
    // POST - Create
    @PostMapping
    public ResponseEntity<{Entity}Response> create(
            @Valid @RequestBody {Entity}Request request) {
        {Entity}Response response = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    // PUT - Update
    @PutMapping("/{id}")
    public ResponseEntity<{Entity}Response> update(
            @PathVariable Long id,
            @Valid @RequestBody {Entity}Request request) {
        return ResponseEntity.ok(service.update(id, request));
    }
    
    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Service-Specific Examples

### User Service - Login Endpoint

```java
// LoginRequest.java
@Data
public class LoginRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}

// LoginResponse.java
@Data
@Builder
public class LoginResponse {
    private Long id;
    private String username;
    private String role;
    private String token;
}

// UserController.java
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(userService.login(request));
}

// UserService.java
public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new InvalidCredentialsException("Invalid username"));
    
    if (!user.getPassword().equals(request.getPassword())) {
        throw new InvalidCredentialsException("Invalid password");
    }
    
    String token = generateToken(user);  // Simple token generation
    
    return LoginResponse.builder()
        .id(user.getId())
        .username(user.getUsername())
        .role(user.getRole().name())
        .token(token)
        .build();
}
```

### Order Service - Create Order with Service Calls

```java
// OrderRequest.java
@Data
public class OrderRequest {
    @NotNull
    private Long userId;
    
    @NotEmpty
    private List<OrderItemRequest> items;
    
    private String note;
}

// OrderService.java
public OrderResponse createOrder(OrderRequest request) {
    // 1. Validate user
    UserResponse user = validateUser(request.getUserId());
    
    // 2. Get food details and create items
    List<OrderItem> items = new ArrayList<>();
    double total = 0;
    
    for (OrderItemRequest itemReq : request.getItems()) {
        FoodResponse food = getFoodDetails(itemReq.getFoodId());
        
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
    
    // 3. Create order
    Order order = Order.builder()
        .userId(request.getUserId())
        .items(items)
        .totalAmount(total)
        .note(request.getNote())
        .status(OrderStatus.PENDING)
        .build();
    
    return toResponse(orderRepository.save(order));
}

private UserResponse validateUser(Long userId) {
    try {
        return restTemplate.getForObject(
            userServiceUrl + "/users/" + userId,
            UserResponse.class
        );
    } catch (HttpClientErrorException.NotFound e) {
        throw new ResourceNotFoundException("User", userId);
    }
}
```

---

## Placeholders

| Placeholder | Example |
|-------------|---------|
| `{Entity}` | `Food` |
| `{entities}` | `foods` |
| `{servicename}` | `foodservice` |
