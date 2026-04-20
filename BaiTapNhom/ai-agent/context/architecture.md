# Architecture - Service-Based Architecture

## Overview

Dự án Mini Food Ordering System sử dụng **Service-Based Architecture** - mỗi chức năng được triển khai như một service độc lập, giao tiếp qua REST API.

## System Architecture

### Với API Gateway (Khuyến nghị)

```
┌─────────────────┐
│    Frontend     │
│  ReactJS :3000  │
└────────┬────────┘
         │ REST
         ▼
┌─────────────────┐
│   API Gateway   │
│ Spring Cloud    │
│     :8080       │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    │         │          │          │
    ▼         ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ User  │ │ Food  │ │ Order │ │Payment│
│:8081  │ │:8082  │ │:8083  │ │:8084  │
└───────┘ └───────┘ └───┬───┘ └───┬───┘
                        │         │
                   ┌────┴────┐    │
                   ▼         ▼    ▼
              User Svc   Food Svc Order Svc
```

### Không có Gateway (Fallback)

```
┌─────────────────┐
│    Frontend     │
│  ReactJS :3000  │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    │         │          │          │
    ▼         ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ User  │ │ Food  │ │ Order │ │Payment│
│:8081  │ │:8082  │ │:8083  │ │:8084  │
└───────┘ └───────┘ └───────┘ └───────┘
```

## Service Responsibilities

### 1. User Service (:8081)
- Đăng ký user mới
- Đăng nhập (trả JWT optional)
- Quản lý danh sách users
- Phân quyền USER/ADMIN

### 2. Food Service (:8082)
- CRUD món ăn
- Seed dữ liệu mẫu
- Không cần auth phức tạp

### 3. Order Service (:8083)
- Tạo đơn hàng
- Lấy danh sách đơn hàng
- **Gọi User Service** để validate user
- **Gọi Food Service** để lấy thông tin món

### 4. Payment + Notification Service (:8084)
- Xử lý thanh toán (COD/Banking)
- **Gọi Order Service** để update trạng thái
- Gửi notification (console log hoặc REST)

### 5. API Gateway (:8080)
- Single entry point cho Frontend
- Route requests đến services
- CORS handling
- (Bonus) Load balancing, retry

## Data Flow

### Flow 1: User Login
```
Frontend → Gateway → User Service → Response
```

### Flow 2: View Menu
```
Frontend → Gateway → Food Service → Response
```

### Flow 3: Create Order
```
Frontend → Gateway → Order Service
                         ├── → User Service (validate)
                         └── → Food Service (get foods)
                     ← Response
```

### Flow 4: Payment
```
Frontend → Gateway → Payment Service
                         └── → Order Service (update status)
                     ← Notification
```

## Service Independence

Mỗi service:
- Có codebase riêng (Spring Boot project trong `backend/`)
- Có database riêng (H2 in-memory)
- Có port riêng
- Deploy độc lập
- Scale độc lập

> **Monorepo**: Tất cả services nằm trong cùng 1 repository (`BaiTapNhom/`) để dễ quản lý, review code và demo. Mỗi service là 1 thư mục con trong `backend/`.

## Communication Pattern

- **Synchronous**: REST API (HTTP)
- **Format**: JSON
- **Error handling**: HTTP status codes + error messages

## Deployment Model (LAN)

```
Machine 1 (192.168.x.1): Frontend :3000
Machine 2 (192.168.x.2): User Service :8081
Machine 3 (192.168.x.3): Food Service :8082
Machine 4 (192.168.x.4): Order Service :8083
Machine 5 (192.168.x.5): Payment Service :8084 + API Gateway :8080
```
