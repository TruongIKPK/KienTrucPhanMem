# Docker Resource Limits Documentation

## Resource Limit Configuration in Docker Compose

This example demonstrates how to limit CPU and memory resources for containers.

### Configuration Details:

#### Redis Container Limits:
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'      # Max 50% of single CPU core
      memory: 512M     # Max 512MB RAM
    reservations:
      cpus: '0.25'     # Reserve min 25% CPU
      memory: 256M     # Reserve min 256MB RAM
```

### Key Concepts:

1. **CPU Limits (cpus)**
   - `'0.5'` = 50% of one CPU core
   - `'1'` = single full CPU core
   - `'2'` = two full CPU cores
   - Supports decimal values like '0.25', '0.5', '0.75'

2. **Memory Limits (memory)**
   - Supported units: b, k, m, g
   - Examples: '512m', '1g', '256MB'
   - If container exceeds limit, it can be killed

3. **Reservations vs Limits**
   - **reservations**: Minimum guaranteed resources
   - **limits**: Maximum resources that can be used
   - Container can burst above reservation up to limit

### Services in This Example:

1. **Redis** (redis_limited)
   - CPU: 0.5 cores max, 0.25 reserved
   - Memory: 512MB max, 256MB reserved
   - Max memory policy: LRU (evict least recently used)

2. **Redis Commander** (redis_commander)
   - Web UI for monitoring Redis
   - CPU: 0.25 cores max
   - Memory: 256MB max
   - Access at: http://localhost:8081

3. **Stress Test** (redis_stress_test)
   - Runs benchmark operations to test limits
   - Runs once and exits (restart: "no")

### Monitoring Resource Usage:

#### Using Docker Stats:
```bash
docker stats
```

#### Using Redis Commander:
- Access http://localhost:8081
- View memory usage and stats
- Monitor key count

#### Using Docker Commands:
```bash
# Get container stats
docker stats redis_limited

# Inspect container limits
docker inspect redis_limited | grep -A 20 "HostConfig"
```

### Command Line Alternatives:

To run with resource limits without Compose:
```bash
docker run -d \
  --name redis_limited \
  --cpus="0.5" \
  --memory="512m" \
  --memory-reservation="256m" \
  redis:7-alpine
```

### What Happens When Limits Are Exceeded:

- **CPU Limit**: Container is throttled (slowed down), not killed
- **Memory Limit**: Container may be killed (OOMKilled) if it exceeds hard limit

### Best Practices:

1. Always set resource limits for production containers
2. Use reservations to guarantee minimum resources
3. Monitor container performance regularly
4. Adjust limits based on actual usage patterns
5. Consider burst requirements when setting limits

### Testing the Limits:

1. Run `docker compose up`
2. In another terminal, monitor resources:
   ```bash
   docker stats redis_limited
   ```
3. Access Redis Commander at http://localhost:8081
4. Watch as stress-test applies load to Redis
5. Observe memory and CPU usage staying within limits
