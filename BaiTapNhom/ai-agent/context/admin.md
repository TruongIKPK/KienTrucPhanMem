# Admin Features

## Overview

Hệ thống có phân quyền USER/ADMIN. Admin có quyền quản lý món ăn (CRUD) trong hệ thống.

## Admin Account

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |

## Admin Permissions

| Feature | USER | ADMIN |
|---------|------|-------|
| Xem menu | ✅ | ✅ |
| Đặt hàng | ✅ | ✅ |
| Thanh toán | ✅ | ✅ |
| Xem lịch sử đơn | ✅ | ✅ |
| Thêm món ăn | ❌ | ✅ |
| Sửa món ăn | ❌ | ✅ |
| Xóa món ăn | ❌ | ✅ |
| Xem danh sách users | ❌ | ✅ |

## Admin Page (Frontend)

**Route:** `/admin`

**Components:**
- `AdminPage.jsx` - Trang chính quản lý món ăn
- `FoodTable.jsx` - Bảng danh sách món ăn
- `FoodForm.jsx` - Form thêm/sửa món
- `AdminRoute.jsx` - Route guard bảo vệ trang admin

**Features:**
- Hiển thị danh sách món ăn dạng bảng
- Thêm món mới (modal form)
- Sửa món ăn (modal form)
- Xóa món ăn (confirm dialog)
- Thống kê số lượng món theo danh mục

## Authorization Flow

```
Frontend                    API Gateway                Food Service
    |                           |                           |
    |-- POST /api/foods ------->|                           |
    |   + X-User-Role: ADMIN    |-- POST /foods ----------->|
    |                           |   + X-User-Role: ADMIN    |
    |                           |                           |-- Check Role
    |                           |                           |   if ADMIN: OK
    |                           |                           |   else: 403
    |<-- 201 Created -----------|<-- 201 Created -----------|
```

## API Endpoints (Admin Only)

### POST /foods
Thêm món mới.

**Headers:**
```
X-User-Role: ADMIN
```

**Request:**
```json
{
  "name": "Phở bò",
  "description": "Phở bò tái chín",
  "price": 45000,
  "imageUrl": "https://...",
  "category": "MAIN"
}
```

**Response:** `201 Created` hoặc `403 Forbidden`

### PUT /foods/{id}
Sửa món ăn.

**Headers:**
```
X-User-Role: ADMIN
```

**Response:** `200 OK` hoặc `403 Forbidden`

### DELETE /foods/{id}
Xóa món ăn.

**Headers:**
```
X-User-Role: ADMIN
```

**Response:** `204 No Content` hoặc `403 Forbidden`

## Frontend Implementation

### AuthContext
```javascript
const value = {
  user,
  isAuthenticated: !!user,
  isAdmin: user?.role === 'ADMIN',
};
```

### api.js (Auto send role header)
```javascript
api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    config.headers['X-User-Role'] = user.role;
  }
  return config;
});
```

### AdminRoute (Route Guard)
```jsx
const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Navigate to="/menu" />;
  }
  
  return children;
};
```

## Backend Implementation

### FoodController
```java
@PostMapping
public ResponseEntity<?> createFood(
    @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
    @Valid @RequestBody FoodRequest request) {
    
    if (!"ADMIN".equalsIgnoreCase(role)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of("message", "Only ADMIN can create food"));
    }
    // ... create food
}
```

## Security Notes

- Đây là cách authorization đơn giản cho demo
- Production nên dùng JWT claims hoặc Spring Security
- Header `X-User-Role` có thể bị giả mạo nếu không có JWT verification
