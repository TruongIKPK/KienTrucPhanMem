# API Endpoints Reference

## Overview

Tất cả API endpoints trong hệ thống Mini Food Ordering System.

## API Gateway (:8080)

Entry point duy nhất cho Frontend (khi dùng Gateway).

| Route | Target Service |
|-------|----------------|
| `/api/users/**` | User Service :8081 |
| `/api/foods/**` | Food Service :8082 |
| `/api/orders/**` | Order Service :8083 |
| `/api/payments/**` | Payment Service :8084 |

---

## User Service (:8081)

Base URL: `http://{host}:8081`

### POST /register
Đăng ký user mới.

**Request:**
```json
{
  "username": "john",
  "password": "123456",
  "email": "john@example.com",
  "role": "USER"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "role": "USER"
}
```

### POST /login
Đăng nhập user.

**Request:**
```json
{
  "username": "john",
  "password": "123456"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "john",
  "role": "USER",
  "token": "jwt-token-here"
}
```

### GET /users
Lấy danh sách users (ADMIN).

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "role": "USER"
  }
]
```

### GET /users/{id}
Lấy thông tin user theo ID (internal).

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "role": "USER"
}
```

---

## Food Service (:8082)

Base URL: `http://{host}:8082`

### GET /foods
Lấy danh sách món ăn.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Phở bò",
    "description": "Phở bò tái chín",
    "price": 45000,
    "imageUrl": "https://example.com/pho.jpg",
    "category": "MAIN"
  }
]
```

### GET /foods/{id}
Lấy thông tin món theo ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Phở bò",
  "description": "Phở bò tái chín",
  "price": 45000,
  "imageUrl": "https://example.com/pho.jpg",
  "category": "MAIN"
}
```

### POST /foods
Thêm món mới (ADMIN).

**Request:**
```json
{
  "name": "Cơm tấm",
  "description": "Cơm tấm sườn bì chả",
  "price": 50000,
  "imageUrl": "https://example.com/comtam.jpg",
  "category": "MAIN"
}
```

**Response:** `201 Created`

### PUT /foods/{id}
Sửa món ăn.

**Request:**
```json
{
  "name": "Cơm tấm đặc biệt",
  "price": 55000
}
```

**Response:** `200 OK`

### DELETE /foods/{id}
Xóa món ăn.

**Response:** `204 No Content`

---

## Order Service (:8083)

Base URL: `http://{host}:8083`

### POST /orders
Tạo đơn hàng mới.

**Request:**
```json
{
  "userId": 1,
  "items": [
    {
      "foodId": 1,
      "quantity": 2
    },
    {
      "foodId": 3,
      "quantity": 1
    }
  ],
  "note": "Ít cay"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "foodId": 1,
      "foodName": "Phở bò",
      "quantity": 2,
      "price": 45000,
      "subtotal": 90000
    }
  ],
  "totalAmount": 140000,
  "status": "PENDING",
  "createdAt": "2024-01-15T10:30:00"
}
```

### GET /orders
Lấy danh sách đơn hàng.

**Query params:**
- `userId` (optional): Filter theo user

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "userId": 1,
    "totalAmount": 140000,
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

### GET /orders/{id}
Lấy chi tiết đơn hàng.

**Response:** `200 OK`

### PUT /orders/{id}/status
Cập nhật trạng thái đơn (internal).

**Request:**
```json
{
  "status": "PAID"
}
```

**Response:** `200 OK`

---

## Payment Service (:8084)

Base URL: `http://{host}:8084`

### POST /payments
Thanh toán đơn hàng.

**Request:**
```json
{
  "orderId": 1,
  "method": "COD",
  "amount": 140000
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "orderId": 1,
  "method": "COD",
  "amount": 140000,
  "status": "SUCCESS",
  "message": "User john đã đặt đơn #1 thành công"
}
```

### GET /payments/{orderId}
Lấy thông tin thanh toán theo order.

**Response:** `200 OK`

---

## Error Responses

Tất cả services trả về error theo format:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/orders"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |
