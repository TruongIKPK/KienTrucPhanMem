# Backend - Mini Food Ordering System

Backend microservices cho hệ thống đặt món ăn nội bộ.

## Architecture

```
                     ┌─────────────────┐
                     │    Frontend     │
                     │  ReactJS :3000  │
                     └────────┬────────┘
                              │
                     ┌────────▼────────┐
                     │   API Gateway   │
                     │      :8080      │
                     └────────┬────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
┌──────▼──────┐  ┌────────────▼────────────┐  ┌──────▼──────┐
│    User     │  │         Food            │  │    Order    │
│   :8081     │  │        :8082            │  │    :8083    │
└─────────────┘  └─────────────────────────┘  └──────┬──────┘
                                                     │
                                              ┌──────▼──────┐
                                              │   Payment   │
                                              │    :8084    │
                                              └─────────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 8080 | Single entry point, routing |
| User Service | 8081 | User registration, login |
| Food Service | 8082 | CRUD foods, data seeder |
| Order Service | 8083 | Create/manage orders |
| Payment Service | 8084 | Payment processing, notifications |

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **H2 Database** (in-memory)
- **Spring Cloud Gateway**
- **Lombok**
- **Maven**
- **Docker** + **Docker Compose**

## Docker (Recommended)

### Prerequisites

- Docker Desktop installed
- Docker Compose v2+

### Quick Start with Docker

```bash
# Navigate to backend folder
cd backend

# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### Docker Commands

```bash
# View logs of all services
docker-compose logs -f

# View logs of specific service
docker-compose logs -f user-service

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose up --build user-service

# Check service status
docker-compose ps
```

### Service URLs (Docker)

| Service | External URL | Internal URL (Docker Network) |
|---------|-------------|-------------------------------|
| API Gateway | http://localhost:8080 | http://api-gateway:8080 |
| User Service | http://localhost:8081 | http://user-service:8081 |
| Food Service | http://localhost:8082 | http://food-service:8082 |
| Order Service | http://localhost:8083 | http://order-service:8083 |
| Payment Service | http://localhost:8084 | http://payment-service:8084 |

### Test via Gateway (Docker)

```bash
# Get all users
curl http://localhost:8080/api/users

# Get all foods
curl http://localhost:8080/api/foods

# Create order (via gateway)
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"foodId":1,"quantity":2}]}'
```

---

## Manual Setup (Without Docker)

## Quick Start

### 1. Start Services (theo thứ tự)

```bash
# Terminal 1 - User Service
cd backend/user-service
mvn spring-boot:run

# Terminal 2 - Food Service
cd backend/food-service
mvn spring-boot:run

# Terminal 3 - Order Service
cd backend/order-service
mvn spring-boot:run

# Terminal 4 - Payment Service
cd backend/payment-service
mvn spring-boot:run

# Terminal 5 - API Gateway (optional)
cd backend/api-gateway
mvn spring-boot:run
```

### 2. Test Endpoints

```bash
# Register user
curl -X POST http://localhost:8081/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"123456","email":"john@test.com"}'

# Login
curl -X POST http://localhost:8081/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"123456"}'

# Get foods (auto seeded)
curl http://localhost:8082/foods

# Create order
curl -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"foodId":1,"quantity":2}]}'

# Process payment
curl -X POST http://localhost:8084/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId":1,"method":"COD","amount":90000}'
```

### 3. Via API Gateway

```bash
# All requests through gateway (port 8080)
curl http://localhost:8080/api/users
curl http://localhost:8080/api/foods
curl http://localhost:8080/api/orders
curl http://localhost:8080/api/payments/1
```

## H2 Console

Access H2 database console for each service:

- User Service: http://localhost:8081/h2-console (JDBC URL: `jdbc:h2:mem:userdb`)
- Food Service: http://localhost:8082/h2-console (JDBC URL: `jdbc:h2:mem:fooddb`)
- Order Service: http://localhost:8083/h2-console (JDBC URL: `jdbc:h2:mem:orderdb`)
- Payment Service: http://localhost:8084/h2-console (JDBC URL: `jdbc:h2:mem:paymentdb`)

## API Endpoints

### User Service (:8081)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Register new user |
| POST | /login | User login |
| GET | /users | Get all users |
| GET | /users/{id} | Get user by ID |

### Food Service (:8082)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /foods | Get all foods |
| GET | /foods/{id} | Get food by ID |
| POST | /foods | Create new food |
| PUT | /foods/{id} | Update food |
| DELETE | /foods/{id} | Delete food |

### Order Service (:8083)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /orders | Create new order |
| GET | /orders | Get all orders |
| GET | /orders/{id} | Get order by ID |
| PUT | /orders/{id}/status | Update order status |

### Payment Service (:8084)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /payments | Process payment |
| GET | /payments/{orderId} | Get payment by order ID |

## Inter-Service Communication

- **Order Service** calls:
  - User Service (`/users/{id}`) - validate user
  - Food Service (`/foods/{id}`) - get food details

- **Payment Service** calls:
  - Order Service (`/orders/{id}`) - get order
  - Order Service (`PUT /orders/{id}/status`) - update status

## LAN Deployment

### Option 1: Docker on single machine

```bash
# Clone repo on server
cd backend
docker-compose up -d --build
```

Frontend connects to `http://<server-ip>:8080`

### Option 2: Multiple machines (Manual)

Update URLs in application.yml for each service:

```yaml
# Order Service
services:
  user:
    url: http://192.168.1.101:8081
  food:
    url: http://192.168.1.102:8082

# Payment Service
services:
  order:
    url: http://192.168.1.103:8083
```

### Option 3: Docker on multiple machines

Set environment variables when running containers:

```bash
# On machine running order-service
docker run -e USER_SERVICE_URL=http://192.168.1.101:8081 \
           -e FOOD_SERVICE_URL=http://192.168.1.102:8082 \
           -p 8083:8083 order-service
```

## Demo Flow

1. User đăng ký (`POST /register`)
2. User đăng nhập (`POST /login`)
3. Xem menu (`GET /foods`)
4. Tạo order (`POST /orders`)
5. Thanh toán (`POST /payments`)
6. Nhận thông báo (console log)

## Nhóm 03

Mini Food Ordering System - Kiến trúc phần mềm
#   D e m o K T P M  
 