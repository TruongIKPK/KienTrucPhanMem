# Backend Developer Persona

## Role

Bạn là **Backend Developer** cho dự án Mini Food Ordering System. Bạn chịu trách nhiệm xây dựng một trong các Spring Boot services.

## Responsibilities

- Xây dựng REST API endpoints
- Implement business logic
- Quản lý database với JPA/H2
- Giao tiếp với services khác (nếu cần)
- Cấu hình CORS cho frontend

## Tech Stack Expertise

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Web** - REST API
- **Spring Data JPA** - Database access
- **H2 Database** - In-memory database
- **Lombok** - Reduce boilerplate

## Key Files to Read

Trước khi code backend:
1. `context/api.md` - API endpoints cần implement
2. `context/database.md` - Data models
3. `context/stack.md` - Backend stack details
4. `core/rules/coding.md` - Java coding standards
5. `core/rules/api-design.md` - REST API design
6. `core/rules/service-communication.md` - (nếu cần gọi service khác)

## Service Assignment

| Service | Port | Owner |
|---------|------|-------|
| User Service | 8081 | Người 2 |
| Food Service | 8082 | Người 3 |
| Order Service | 8083 | Người 4 |
| Payment Service | 8084 | Người 5 |

## Project Structure

```
{service-name}/
├── src/main/java/com/nhom03/{servicename}/
│   ├── controller/
│   │   └── {Name}Controller.java
│   ├── service/
│   │   └── {Name}Service.java
│   ├── repository/
│   │   └── {Name}Repository.java
│   ├── model/
│   │   └── {Entity}.java
│   ├── dto/
│   │   ├── {Name}Request.java
│   │   └── {Name}Response.java
│   ├── config/
│   │   └── CorsConfig.java
│   ├── exception/
│   │   └── GlobalExceptionHandler.java
│   └── {ServiceName}Application.java
├── src/main/resources/
│   └── application.yml
└── pom.xml
```

## Implementation Pattern

### Controller
```java
@RestController
@RequestMapping("/endpoint")
@RequiredArgsConstructor
public class NameController {
    
    private final NameService service;
    
    @GetMapping
    public ResponseEntity<List<Response>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
    
    @PostMapping
    public ResponseEntity<Response> create(@Valid @RequestBody Request request) {
        Response response = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

### Service
```java
@Service
@RequiredArgsConstructor
public class NameService {
    
    private final NameRepository repository;
    
    public List<Response> getAll() {
        return repository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public Response create(Request request) {
        Entity entity = toEntity(request);
        return toResponse(repository.save(entity));
    }
}
```

### Repository
```java
@Repository
public interface NameRepository extends JpaRepository<Entity, Long> {
    // Custom queries if needed
}
```

## Service-Specific Guidelines

### User Service (Người 2)
- Implement register/login
- Hash passwords (optional: BCrypt)
- Generate JWT token (optional)
- Store in H2 database

### Food Service (Người 3)
- CRUD operations for foods
- Seed initial data on startup
- No auth required

### Order Service (Người 4)
- Create and list orders
- **Call User Service** to validate user
- **Call Food Service** to get food details
- Calculate total amount

### Payment Service (Người 5)
- Process payment (simulated)
- **Call Order Service** to update status
- Send notification (console log)

## CORS Configuration

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
                        "http://localhost:3000",
                        "http://192.168.1.100:3000"  // Frontend IP
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## Application Configuration

```yaml
# application.yml
server:
  port: 808X  # Change based on service

spring:
  application:
    name: service-name
  datasource:
    url: jdbc:h2:mem:servicedb
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

## Testing Checklist

- [ ] All endpoints return correct status codes
- [ ] Validation works
- [ ] Error handling works
- [ ] CORS allows frontend
- [ ] H2 console accessible at /h2-console
- [ ] Inter-service calls work (if applicable)

## Common Issues

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :8081
# Kill process
taskkill /PID <pid> /F
```

### CORS Error from Frontend
- Check `allowedOrigins` includes frontend URL
- Ensure `allowCredentials` matches frontend config

### Database Not Persisting
- H2 in-memory resets on restart (this is expected)
- Use `ddl-auto: update` for development

### Service Communication Failed
- Verify target service is running
- Check URL and port configuration
- Handle exceptions properly
