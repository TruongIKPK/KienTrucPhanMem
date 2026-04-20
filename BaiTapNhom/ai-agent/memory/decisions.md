# Architectural Decision Records (ADRs)

## Overview

Document này ghi lại các quyết định kiến trúc quan trọng trong dự án Mini Food Ordering System.

---

## ADR-001: Service-Based Architecture

### Status
Accepted

### Context
Dự án yêu cầu xây dựng hệ thống đặt món ăn với 5 chức năng chính, phân công cho 5 người.

### Decision
Sử dụng **Service-Based Architecture** với mỗi chức năng là một Spring Boot service độc lập.

### Rationale
- Phù hợp với yêu cầu bài tập
- Dễ phân công công việc (1 người = 1 service)
- Học được kiến trúc phân tán
- Dễ demo và test từng phần

### Consequences
- (+) Clear separation of concerns
- (+) Independent development
- (-) Cần quản lý inter-service communication
- (-) Cần handle failures between services

---

## ADR-002: REST API Communication

### Status
Accepted

### Context
Cần chọn phương thức giao tiếp giữa các services.

### Decision
Sử dụng **REST API (HTTP/JSON)** cho tất cả giao tiếp.

### Rationale
- Simple và dễ hiểu
- Stateless
- Dễ test với Postman/curl
- Không cần message broker phức tạp

### Alternatives Considered
- gRPC: Phức tạp hơn, không cần performance cao
- Message Queue: Overkill cho bài tập

### Consequences
- (+) Simple implementation
- (+) Easy debugging
- (-) Synchronous, có thể slow
- (-) No guaranteed delivery

---

## ADR-003: H2 In-Memory Database

### Status
Accepted

### Context
Cần chọn database cho các services.

### Decision
Sử dụng **H2 in-memory database** cho mỗi service.

### Rationale
- Không cần setup database server
- Đủ cho demo
- Mỗi service có DB riêng (đúng pattern)
- Fast development

### Alternatives Considered
- MySQL/PostgreSQL: Cần setup, overkill
- Shared H2: Vi phạm service independence

### Consequences
- (+) Zero setup
- (+) Fast
- (-) Data mất khi restart
- (-) Không persistent

---

## ADR-004: API Gateway Pattern

### Status
Accepted (Optional)

### Context
Frontend cần gọi nhiều services, cần single entry point.

### Decision
Sử dụng **Spring Cloud Gateway** làm API Gateway.

### Rationale
- Single entry point cho frontend
- Centralized CORS handling
- Route management
- Potential for load balancing, retry

### Alternatives Considered
- Direct calls: Simpler nhưng CORS complex
- Nginx: Cần thêm setup

### Consequences
- (+) Clean architecture
- (+) Centralized routing
- (-) Additional service to manage
- (-) Single point of failure

---

## ADR-005: JWT Authentication (Optional)

### Status
Accepted (Optional)

### Context
Cần authentication mechanism cho users.

### Decision
Sử dụng **simple JWT token** cho authentication.

### Rationale
- Stateless authentication
- Can be shared across services
- Industry standard

### Implementation
- User Service generates token on login
- Frontend stores in localStorage
- Sent in Authorization header
- Services validate token

### Consequences
- (+) Stateless, scalable
- (+) Cross-service compatible
- (-) Token management complexity
- (-) Need to handle expiration

---

## ADR-006: Frontend State Management

### Status
Accepted

### Context
Frontend cần quản lý state (user, cart).

### Decision
Sử dụng **React Context API** cho global state.

### Rationale
- Built-in React feature
- Đủ cho scope của project
- Simple to implement
- No external dependencies

### Alternatives Considered
- Redux: Overkill cho app size này
- Zustand: External dependency

### Consequences
- (+) Simple, no extra deps
- (+) Familiar pattern
- (-) Not ideal for complex state
- (-) Prop drilling if overused

---

## ADR-007: RestTemplate for Service Communication

### Status
Accepted

### Context
Backend services cần gọi nhau.

### Decision
Sử dụng **RestTemplate** cho inter-service HTTP calls.

### Rationale
- Simple và synchronous
- Built into Spring
- Easy error handling
- Good for small scale

### Alternatives Considered
- WebClient: Reactive, more complex
- Feign Client: Requires additional setup

### Consequences
- (+) Simple implementation
- (+) Blocking = easy to reason about
- (-) Not reactive
- (-) Thread blocking during calls

---

## ADR-008: CORS Configuration

### Status
Accepted

### Context
Frontend và backend chạy trên different origins.

### Decision
Configure **CORS on both Gateway and individual services**.

### Implementation
- Gateway: Global CORS filter
- Services: WebMvcConfigurer bean
- Allow frontend origins
- Allow credentials for auth

### Consequences
- (+) Frontend can call APIs
- (+) Credentials supported
- (-) Need to maintain allowed origins list

---

## ADR-009: Error Handling Strategy

### Status
Accepted

### Context
Cần consistent error handling across services.

### Decision
Sử dụng **GlobalExceptionHandler** với standard error format.

### Error Format
```json
{
  "timestamp": "...",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed"
}
```

### Consequences
- (+) Consistent error responses
- (+) Easy frontend handling
- (+) Debugging friendly

---

## ADR-010: Notification Implementation

### Status
Accepted

### Context
Cần gửi notification khi thanh toán thành công.

### Decision
Sử dụng **console logging** cho notification.

### Rationale
- Simplest implementation
- Meets demo requirements
- No external services needed

### Future Enhancement
- REST call to notification service
- Email notification
- Push notification

### Consequences
- (+) Zero complexity
- (+) Easy to demo
- (-) Not production-ready
- (-) Only visible in server logs

---

## Decision Log

| ADR | Decision | Date |
|-----|----------|------|
| 001 | Service-Based Architecture | Project start |
| 002 | REST API Communication | Project start |
| 003 | H2 In-Memory Database | Project start |
| 004 | API Gateway | Optional |
| 005 | JWT Authentication | Optional |
| 006 | React Context | Project start |
| 007 | RestTemplate | Project start |
| 008 | CORS Configuration | Project start |
| 009 | Error Handling | Project start |
| 010 | Console Notification | Project start |
