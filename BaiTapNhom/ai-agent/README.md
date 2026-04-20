# AI-Agent Bundle - nhom_03

> Single source of truth cho dự án **Mini Food Ordering System**

## Quick Reference

| Thành phần | Mô tả |
|------------|-------|
| **Project** | Mini Food Ordering System (ShopeeFood mini) |
| **Architecture** | Service-Based Architecture |
| **Team** | nhom_03 (5 người) |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | ReactJS + Axios |
| Backend | Java 17+ / Spring Boot 3.x |
| API Gateway | Spring Cloud Gateway |
| Database | H2 / In-Memory |
| Communication | REST API (HTTP) |

## Services

| Service | Port | Người phụ trách |
|---------|------|-----------------|
| Frontend | :3000 | Người 1 |
| User Service | :8081 | Người 2 |
| Food Service | :8082 | Người 3 |
| Order Service | :8083 | Người 4 |
| Payment + Notification | :8084 | Người 5 |
| API Gateway | :8080 | Người 5 |

## Project Structure (Monorepo)

Tất cả services nằm trong **cùng 1 repository** (monorepo):

```
BaiTapNhom/
├── frontend/                 # ReactJS Frontend (Người 1)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Spring Boot Services
│   ├── user-service/         # User Service :8081 (Người 2)
│   │   ├── src/main/java/
│   │   ├── src/main/resources/
│   │   └── pom.xml
│   │
│   ├── food-service/         # Food Service :8082 (Người 3)
│   │   ├── src/main/java/
│   │   ├── src/main/resources/
│   │   └── pom.xml
│   │
│   ├── order-service/        # Order Service :8083 (Người 4)
│   │   ├── src/main/java/
│   │   ├── src/main/resources/
│   │   └── pom.xml
│   │
│   ├── payment-service/      # Payment+Notification :8084 (Người 5)
│   │   ├── src/main/java/
│   │   ├── src/main/resources/
│   │   └── pom.xml
│   │
│   └── api-gateway/          # API Gateway :8080 (Bonus)
│       ├── src/main/java/
│       ├── src/main/resources/
│       └── pom.xml
│
├── ai-agent/                 # AI-agent documentation
│   └── ...
│
└── README.md                 # Project README
```

## AI-Agent Folder Structure

```
ai-agent/
├── README.md                 # File này
├── core/
│   ├── system.prompt.md      # System prompt chính
│   ├── rules/                # Coding rules
│   ├── persona/              # Role-specific personas
│   └── templates/            # Code templates
├── context/
│   ├── architecture.md       # Kiến trúc hệ thống
│   ├── api.md                # API endpoints
│   ├── api-gateway.md        # Gateway configuration
│   ├── database.md           # Data models
│   ├── stack.md              # Tech stack chi tiết
│   └── deployment.md         # Hướng dẫn deploy LAN
├── workflows/                # Quy trình làm việc
├── commands/                 # Lệnh AI-agent
└── memory/                   # Team conventions & decisions
```

## Startup Order (Khi làm việc với AI)

1. **`core/system.prompt.md`** — Đọc đầu tiên
2. **`context/`** — Đọc trước khi thiết kế/code
3. **`core/rules/`** — Tuân theo khi code
4. **`core/persona/`** — Chọn persona phù hợp với task
5. **`workflows/`** — Quy trình cho từng loại task
6. **`memory/`** — Check conventions và decisions

## Demo Flow

```
1. User đăng ký + login
2. Xem danh sách món
3. Thêm vào giỏ → tạo order
4. Thanh toán (COD/Banking)
5. Nhận thông báo
```

## Tiêu chí chấm điểm

| Tiêu chí | Điểm |
|----------|------|
| Đúng kiến trúc Service-Based | 3 |
| API hoạt động | 2 |
| Giao tiếp giữa services | 2 |
| Frontend chạy mượt | 1.5 |
| Demo hoàn chỉnh | 1 |
| **Tổng** | **9.5** |
