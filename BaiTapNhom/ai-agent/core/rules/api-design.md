# REST API Design Rules

## RESTful Principles

### 1. Use Nouns for Resources
```
✅ GET /foods
✅ GET /users
✅ POST /orders

❌ GET /getFood
❌ GET /getAllUsers
❌ POST /createOrder
```

### 2. Use HTTP Methods Correctly

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resource | Yes |
| POST | Create resource | No |
| PUT | Update entire resource | Yes |
| PATCH | Partial update | No |
| DELETE | Remove resource | Yes |

### 3. Use Plural Nouns
```
✅ /foods
✅ /users
✅ /orders

❌ /food
❌ /user
❌ /order
```

---

## URL Structure

### Resource Hierarchy
```
/users                      # Collection
/users/{id}                 # Single resource
/users/{id}/orders          # Sub-collection
/orders/{id}/items          # Nested resource
```

### Query Parameters for Filtering
```
GET /foods?category=MAIN
GET /foods?minPrice=20000&maxPrice=50000
GET /orders?userId=1&status=PENDING
```

### Pagination
```
GET /foods?page=0&size=10
GET /foods?offset=0&limit=10

Response:
{
  "content": [...],
  "page": 0,
  "size": 10,
  "totalElements": 100,
  "totalPages": 10
}
```

---

## HTTP Status Codes

### Success (2xx)
```
200 OK              - Successful GET, PUT, PATCH
201 Created         - Successful POST
204 No Content      - Successful DELETE
```

### Client Errors (4xx)
```
400 Bad Request     - Validation error, malformed request
401 Unauthorized    - Authentication required
403 Forbidden       - Authenticated but not authorized
404 Not Found       - Resource doesn't exist
409 Conflict        - Resource conflict (duplicate)
422 Unprocessable   - Semantic error
```

### Server Errors (5xx)
```
500 Internal Error  - Unexpected server error
502 Bad Gateway     - Upstream service failed
503 Unavailable     - Service temporarily down
```

---

## Request/Response Format

### Request Body (POST/PUT)
```json
POST /foods
Content-Type: application/json

{
  "name": "Phở bò",
  "price": 45000,
  "category": "MAIN"
}
```

### Success Response
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "name": "Phở bò",
  "price": 45000,
  "category": "MAIN",
  "createdAt": "2024-01-15T10:30:00"
}
```

### Error Response
```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Name is required",
  "path": "/foods"
}
```

### Validation Error Response
```json
HTTP/1.1 400 Bad Request

{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "price",
      "message": "Price must be positive"
    }
  ]
}
```

---

## API Design for Each Service

### User Service APIs
```
POST   /register              # Đăng ký user mới
POST   /login                 # Đăng nhập
GET    /users                 # Lấy danh sách users
GET    /users/{id}            # Lấy user theo ID
```

### Food Service APIs
```
GET    /foods                 # Lấy danh sách món
GET    /foods/{id}            # Lấy món theo ID
POST   /foods                 # Thêm món mới
PUT    /foods/{id}            # Cập nhật món
DELETE /foods/{id}            # Xóa món
```

### Order Service APIs
```
POST   /orders                # Tạo đơn hàng
GET    /orders                # Lấy danh sách đơn
GET    /orders/{id}           # Lấy chi tiết đơn
PUT    /orders/{id}/status    # Cập nhật trạng thái
```

### Payment Service APIs
```
POST   /payments              # Thanh toán
GET    /payments/{orderId}    # Lấy thông tin thanh toán
```

---

## Versioning (Optional)

```
/api/v1/foods
/api/v2/foods
```

Hoặc qua header:
```
Accept: application/vnd.nhom03.v1+json
```

---

## CORS Headers

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

---

## Best Practices

### DO
- Use consistent naming
- Return appropriate status codes
- Validate input data
- Handle errors gracefully
- Document APIs

### DON'T
- Use verbs in URLs
- Return HTML for API errors
- Expose internal errors to clients
- Ignore HTTP method semantics
- Mix singular and plural nouns

---

## Example Controller

```java
@RestController
@RequestMapping("/foods")
@RequiredArgsConstructor
public class FoodController {
    
    private final FoodService foodService;
    
    @GetMapping
    public ResponseEntity<List<FoodResponse>> getAllFoods(
            @RequestParam(required = false) Category category) {
        List<FoodResponse> foods = foodService.getAllFoods(category);
        return ResponseEntity.ok(foods);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FoodResponse> getFoodById(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getFoodById(id));
    }
    
    @PostMapping
    public ResponseEntity<FoodResponse> createFood(
            @Valid @RequestBody FoodRequest request) {
        FoodResponse food = foodService.createFood(request);
        URI location = URI.create("/foods/" + food.getId());
        return ResponseEntity.created(location).body(food);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<FoodResponse> updateFood(
            @PathVariable Long id,
            @Valid @RequestBody FoodRequest request) {
        return ResponseEntity.ok(foodService.updateFood(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.noContent().build();
    }
}
```
