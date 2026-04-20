# Known Issues & Limitations

## Overview

Document này ghi lại các issues đã biết và limitations trong dự án Mini Food Ordering System.

---

## Database Issues

### Issue: Data Loss on Restart

**Description**: H2 in-memory database mất data khi service restart.

**Impact**: Medium - Development inconvenience

**Workaround**:
1. Implement DataSeeder để seed data on startup
2. Hoặc đổi sang file-based H2

```java
// DataSeeder example
@Component
public class DataSeeder implements CommandLineRunner {
    @Override
    public void run(String... args) {
        // Seed data here
    }
}
```

**Status**: By design (for demo purposes)

---

### Issue: No Cross-Service Transactions

**Description**: Không có distributed transaction giữa các services.

**Impact**: Low - Có thể có inconsistent data

**Example**: Order created but payment fails

**Workaround**:
- Implement compensation logic
- Use eventual consistency
- Accept for demo scope

**Status**: Accepted limitation

---

## Network Issues

### Issue: Service Discovery Not Implemented

**Description**: Services sử dụng hardcoded URLs.

**Impact**: Medium - Khó scale/deploy

**Workaround**:
- Use environment variables for URLs
- Configure in application.yml

```yaml
services:
  user:
    url: ${USER_SERVICE_URL:http://localhost:8081}
```

**Status**: Accepted for demo scope

---

### Issue: No Circuit Breaker

**Description**: Không có circuit breaker cho inter-service calls.

**Impact**: Medium - Cascade failures possible

**Workaround**:
- Add timeout configuration
- Basic try-catch handling
- Optional: Add Resilience4j

**Status**: Bonus feature

---

### Issue: CORS Configuration for LAN

**Description**: CORS cần update cho mỗi LAN deployment.

**Impact**: Low - Manual configuration needed

**Workaround**:
- Use environment variables
- Update allowedOrigins list

```java
.allowedOrigins(
    "http://localhost:3000",
    "http://${FRONTEND_HOST}:3000"
)
```

**Status**: Known, document in deployment guide

---

## Authentication Issues

### Issue: Simple Password Storage

**Description**: Passwords stored in plain text.

**Impact**: High (in production) - Security risk

**Workaround**:
- Add BCrypt encoding
- For demo: Accept as limitation

```java
// Better approach
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

**Status**: Accepted for demo (not production-ready)

---

### Issue: JWT Not Fully Implemented

**Description**: JWT validation may not be complete.

**Impact**: Medium - Auth not fully secure

**Workaround**:
- Simple token generation/validation
- Skip for demo if time-constrained

**Status**: Optional feature

---

## Frontend Issues

### Issue: Cart State Not Persisted

**Description**: Cart clears on page refresh.

**Impact**: Low - UX inconvenience

**Workaround**:
- Store cart in localStorage
- Implement cart persistence

```javascript
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(items));
}, [items]);
```

**Status**: Enhancement

---

### Issue: No Real-Time Updates

**Description**: Order status không auto-update.

**Impact**: Low - User needs to refresh

**Workaround**:
- Manual refresh
- Optional: Add polling
- Optional: WebSocket

**Status**: Accepted limitation

---

## Integration Issues

### Issue: Synchronous Service Calls

**Description**: Order Service blocks during User/Food validation.

**Impact**: Medium - Slow response time

**Workaround**:
- Accept for demo
- Add timeout configuration

```java
RestTemplate restTemplate = builder
    .setConnectTimeout(Duration.ofSeconds(5))
    .setReadTimeout(Duration.ofSeconds(10))
    .build();
```

**Status**: Accepted for demo

---

### Issue: No Retry Mechanism

**Description**: Failed inter-service calls not retried.

**Impact**: Medium - Temporary failures cause errors

**Workaround**:
- Basic retry in catch block
- Optional: Add Spring Retry

**Status**: Bonus feature

---

## Performance Issues

### Issue: N+1 Queries in Order Creation

**Description**: Multiple calls to Food Service for each item.

**Impact**: Low - Slow for large orders

**Workaround**:
- Batch API call
- Accept for demo scope

**Status**: Accepted limitation

---

### Issue: No Caching

**Description**: Food list fetched every time.

**Impact**: Low - Unnecessary load

**Workaround**:
- Add simple caching
- Frontend-side caching

**Status**: Enhancement

---

## Deployment Issues

### Issue: Firewall Blocks Ports

**Description**: Windows firewall may block service ports.

**Impact**: High - Services unreachable

**Workaround**:
```bash
# Open ports in Windows Firewall
netsh advfirewall firewall add rule name="Spring Boot" dir=in action=allow protocol=TCP localport=8080-8084
```

**Status**: Document in deployment guide

---

### Issue: localhost Not Working Across Machines

**Description**: localhost không resolve đúng trên LAN.

**Impact**: High - Integration fails

**Workaround**:
- Use IP addresses (192.168.x.x)
- Document clearly

**Status**: Document in deployment guide

---

## Demo-Specific Issues

### Issue: Notification Only in Console

**Description**: Notification chỉ log trong console.

**Impact**: Low - Hard to demo

**Workaround**:
- Show terminal during demo
- Return notification in API response

**Status**: Accepted for demo

---

### Issue: No Data Validation UI

**Description**: Frontend không show validation errors clearly.

**Impact**: Low - Poor UX

**Workaround**:
- Add error display components
- Show server validation messages

**Status**: Enhancement

---

## Issue Tracking

| Issue | Severity | Status | Owner |
|-------|----------|--------|-------|
| Data loss on restart | Medium | By design | - |
| No distributed tx | Low | Accepted | - |
| Hardcoded URLs | Medium | Use env vars | All |
| No circuit breaker | Medium | Bonus | - |
| Plain password | High | Accepted for demo | - |
| Cart not persisted | Low | Enhancement | Frontend |
| Sync service calls | Medium | Accepted | - |
| Firewall blocks | High | Document | All |

---

## Reporting New Issues

Khi phát hiện issue mới:
1. Add vào file này
2. Include: Description, Impact, Workaround
3. Set Status: New → Investigating → Accepted/Fixed

---

## Updates

Last updated: Project initialization
