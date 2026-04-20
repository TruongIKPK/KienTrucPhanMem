# Coding Standards

## General Principles

1. **Clean Code**: Code dễ đọc, dễ hiểu, dễ maintain
2. **DRY**: Don't Repeat Yourself
3. **KISS**: Keep It Simple, Stupid
4. **Single Responsibility**: Mỗi class/function làm 1 việc

---

## Java / Spring Boot Standards

### Project Structure

Mỗi service nằm trong `backend/{service-name}/`:

```
backend/{service-name}/
├── src/main/java/com/nhom03/{servicename}/
│   ├── controller/     # REST controllers
│   ├── service/        # Business logic
│   ├── repository/     # Data access
│   ├── model/          # JPA entities
│   ├── dto/            # Data transfer objects
│   ├── config/         # Configuration classes
│   ├── exception/      # Custom exceptions
│   └── {ServiceName}Application.java
├── src/main/resources/
│   └── application.yml
└── pom.xml
```

### Controller Layer
```java
@RestController
@RequestMapping("/foods")
@RequiredArgsConstructor
public class FoodController {
    
    private final FoodService foodService;
    
    @GetMapping
    public ResponseEntity<List<FoodResponse>> getAllFoods() {
        return ResponseEntity.ok(foodService.getAllFoods());
    }
    
    @PostMapping
    public ResponseEntity<FoodResponse> createFood(@Valid @RequestBody FoodRequest request) {
        FoodResponse food = foodService.createFood(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(food);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FoodResponse> getFoodById(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getFoodById(id));
    }
}
```

### Service Layer
```java
@Service
@RequiredArgsConstructor
public class FoodService {
    
    private final FoodRepository foodRepository;
    
    public List<FoodResponse> getAllFoods() {
        return foodRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public FoodResponse createFood(FoodRequest request) {
        Food food = Food.builder()
            .name(request.getName())
            .price(request.getPrice())
            .build();
        
        return toResponse(foodRepository.save(food));
    }
    
    private FoodResponse toResponse(Food food) {
        return FoodResponse.builder()
            .id(food.getId())
            .name(food.getName())
            .price(food.getPrice())
            .build();
    }
}
```

### Repository Layer
```java
@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    
    List<Food> findByCategory(Category category);
    
    Optional<Food> findByName(String name);
}
```

### Entity
```java
@Entity
@Table(name = "foods")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Food {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Double price;
    
    @Enumerated(EnumType.STRING)
    private Category category;
}
```

### DTO
```java
@Data
@Builder
public class FoodRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;
    
    private Category category;
}

@Data
@Builder
public class FoodResponse {
    private Long id;
    private String name;
    private Double price;
    private Category category;
}
```

### Exception Handling
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.joining(", "));
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            message,
            LocalDateTime.now()
        );
        return ResponseEntity.badRequest().body(error);
    }
}
```

---

## ReactJS Standards

### Project Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Loading.jsx
│   ├── auth/
│   ├── food/
│   └── order/
├── pages/
├── services/
├── context/
├── hooks/
└── utils/
```

### Component Pattern
```jsx
// Functional component with hooks
const FoodCard = ({ food, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  
  const handleAdd = () => {
    onAddToCart(food, quantity);
  };
  
  return (
    <div className="food-card">
      <h3>{food.name}</h3>
      <p>{food.price.toLocaleString()}đ</p>
      <input 
        type="number" 
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
      />
      <button onClick={handleAdd}>Thêm vào giỏ</button>
    </div>
  );
};

export default FoodCard;
```

### Custom Hook Pattern
```jsx
// hooks/useAuth.js
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token
    }
    setLoading(false);
  }, []);
  
  const login = async (credentials) => {
    const response = await userService.login(credentials);
    localStorage.setItem('token', response.data.token);
    setUser(response.data);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return { user, loading, login, logout };
};
```

### API Service Pattern
```jsx
// services/foodService.js
import api from './api';

export const foodService = {
  getAll: () => api.get('/foods'),
  getById: (id) => api.get(`/foods/${id}`),
  create: (data) => api.post('/foods', data),
  update: (id, data) => api.put(`/foods/${id}`, data),
  delete: (id) => api.delete(`/foods/${id}`),
};
```

---

## Code Quality Rules

### DO
- Sử dụng meaningful variable/function names
- Viết unit tests cho business logic
- Handle errors properly
- Validate input data
- Use constants for magic numbers/strings

### DON'T
- Hardcode values
- Catch generic exceptions
- Leave commented-out code
- Use `System.out.println` in production (use logger)
- Commit sensitive data (passwords, keys)

---

## Git Commit Standards

```
feat: add user registration endpoint
fix: handle null pointer in order service
refactor: extract payment logic to service
docs: update API documentation
test: add unit tests for food service
chore: update dependencies
```
