# Frontend - Mini Food Ordering System

Frontend React cho hệ thống đặt món ăn nội bộ.

## Tech Stack

- **React 19** + Vite
- **Tailwind CSS v4** - Styling
- **React Router v7** - Routing
- **Axios** - HTTP Client
- **React Context** - State Management

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## Cấu trúc thư mục

```
src/
├── components/
│   ├── common/      # Button, Input, Loading, Navbar
│   ├── auth/        # LoginForm, RegisterForm
│   ├── food/        # FoodCard, FoodList
│   ├── cart/        # CartItem, CartSummary
│   └── order/       # OrderCard, OrderList, PaymentForm
├── pages/           # Các trang chính
├── services/        # API services (Axios)
├── context/         # AuthContext, CartContext
├── utils/           # Formatters, helpers
├── App.jsx          # Main App với Router
└── index.css        # Tailwind styles
```

## Pages

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/` | HomePage | Trang chủ |
| `/login` | LoginPage | Đăng nhập |
| `/register` | RegisterPage | Đăng ký |
| `/menu` | MenuPage | Danh sách món |
| `/cart` | CartPage | Giỏ hàng |
| `/checkout` | CheckoutPage | Thanh toán |
| `/orders` | OrdersPage | Lịch sử đơn |

## API Endpoints

Frontend gọi API qua Gateway (port 8080) hoặc trực tiếp:

- **User Service** (:8081): `/api/users/*`
- **Food Service** (:8082): `/api/foods/*`
- **Order Service** (:8083): `/api/orders/*`
- **Payment Service** (:8084): `/api/payments/*`

## Environment Variables

Tạo file `.env` từ `.env.example`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_USER_SERVICE_URL=http://localhost:8081
VITE_FOOD_SERVICE_URL=http://localhost:8082
VITE_ORDER_SERVICE_URL=http://localhost:8083
VITE_PAYMENT_SERVICE_URL=http://localhost:8084
```

Khi deploy trên LAN, thay `localhost` bằng IP thực:

```env
VITE_API_URL=http://192.168.1.100:8080/api
```

## Design System

Starbucks-inspired design với:

- **Primary Color**: `#00754A` (Green Accent)
- **Brand Color**: `#006241` (Starbucks Green)
- **Background**: `#f2f0eb` (Warm Cream)
- **Border Radius**: `50px` (Pill buttons), `12px` (Cards)

## Demo Flow

1. Đăng ký tài khoản → `/register`
2. Đăng nhập → `/login`
3. Xem menu và thêm món vào giỏ → `/menu`
4. Kiểm tra giỏ hàng → `/cart`
5. Thanh toán → `/checkout`
6. Xem đơn hàng → `/orders`

## Nhóm 03

Mini Food Ordering System - Kiến trúc phần mềm
