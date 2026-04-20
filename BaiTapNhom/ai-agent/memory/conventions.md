# Team Conventions

## Overview

Document này ghi lại các quy ước đã thống nhất trong team nhom_03 cho dự án Mini Food Ordering System.

---

## Coding Conventions

### Java/Spring Boot

| Rule | Convention |
|------|------------|
| Java Version | 17+ |
| Spring Boot Version | 3.2.x |
| Package naming | `com.nhom03.{servicename}` |
| Class naming | PascalCase |
| Method naming | camelCase |
| Constant naming | UPPER_SNAKE_CASE |

### ReactJS

| Rule | Convention |
|------|------------|
| React Version | 18.x |
| Component type | Functional components only |
| File naming | PascalCase for components |
| State management | Context API |
| HTTP client | Axios |

---

## API Conventions

### URL Format
```
/{resource}           # Collection
/{resource}/{id}      # Single resource
/{resource}/{id}/{sub-resource}  # Nested
```

### HTTP Methods
| Method | Usage |
|--------|-------|
| GET | Retrieve data |
| POST | Create new resource |
| PUT | Update entire resource |
| DELETE | Remove resource |

### Response Format
```json
{
  "id": 1,
  "field": "value",
  "createdAt": "2024-01-15T10:30:00"
}
```

### Error Format
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Description"
}
```

---

## Git Conventions

### Branch Naming
```
main                    # Production
develop                 # Development
feature/{feature-name}  # New features
bugfix/{bug-name}       # Bug fixes
```

### Commit Messages
```
feat: add user registration
fix: handle null pointer in order service
refactor: extract payment logic
docs: update API documentation
test: add unit tests for food service
```

---

## Port Conventions

| Service | Port | Fixed |
|---------|------|-------|
| Frontend | 3000 | Yes |
| API Gateway | 8080 | Yes |
| User Service | 8081 | Yes |
| Food Service | 8082 | Yes |
| Order Service | 8083 | Yes |
| Payment Service | 8084 | Yes |

---

## File Structure Conventions

### Backend Service
```
{service-name}/
├── src/main/java/com/nhom03/{servicename}/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── config/
│   └── exception/
└── src/main/resources/
    └── application.yml
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── utils/
└── public/
```

---

## Communication Conventions

### API Contract Agreement
- Define API contracts before implementation
- Use JSON format for request/response
- Include field types and validation rules

### Code Review
- Review critical changes
- Test integration before merge
- Document breaking changes

---

## Testing Conventions

### API Testing
- Use Postman/curl for manual testing
- Test all endpoints before integration
- Include error cases

### Integration Testing
- Start services in correct order
- Test inter-service communication
- Verify data flow

---

## Documentation Conventions

### Code Comments
- Vietnamese allowed for complex logic
- English for technical terms
- Avoid obvious comments

### API Documentation
- Document in `context/api.md`
- Include request/response examples
- List all status codes

---

## Security Conventions

### Authentication
- JWT token (optional but recommended)
- Store token in localStorage
- Send in Authorization header

### CORS
- Allow frontend origin
- Allow common HTTP methods
- Support credentials

---

## Deployment Conventions

### Local Development
```
localhost:3000  → Frontend
localhost:8080  → Gateway
localhost:808x  → Services
```

### LAN Deployment
```
192.168.x.x:3000  → Frontend
192.168.x.x:8080  → Gateway
192.168.x.x:808x  → Services
```

---

## Agreement Log

| Date | Convention | Agreed By |
|------|------------|-----------|
| - | Port assignment | Team |
| - | Package naming | Team |
| - | API format | Team |
| - | Git workflow | Team |

---

## Updates

Cập nhật file này khi team đồng ý convention mới.
