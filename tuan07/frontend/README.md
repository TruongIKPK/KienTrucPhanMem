# Frontend — Movie Ticket System

ReactJS 18 + Vite + TypeScript + TailwindCSS, **The Verge** inspired UI (xem `/DESIGN.md`).

Frontend chỉ giao tiếp **một** điểm duy nhất: API Gateway tại `VITE_API_GATEWAY_URL`
(mặc định `http://localhost:8080`). Không gọi trực tiếp các microservice khác.

## Stack

- **Vite 5** + **React 18** + **TypeScript 5**
- **TailwindCSS 3** với token theo The Verge: `canvas`, `mint`, `ultraviolet`, `slate`,
  `tileYellow`, `tilePink`, `tileOrange`, `purpleRule`, `linkBlue`, `focusCyan`…
- **Fonts (Google substitutes — vì Manuka & PolySans là proprietary):**
  - `font-display` → **Bebas Neue** (substitute Manuka)
  - `font-sans` → **Space Grotesk** (substitute PolySans)
  - `font-mono` → **Space Mono** (substitute PolySans Mono)
- **TanStack Query** — server state (movies, bookings, polling status)
- **Zustand** — client state (token, user) persisted to `localStorage`
- **react-hook-form + zod** — form validation
- **axios** — HTTP client + interceptors (Bearer token, 401 redirect)
- **sonner** — toast

## Cấu trúc

```
src/
  api/         # axios client + endpoint wrappers
  components/  # Button, Input, PillTag, MovieCard, StoryStreamTile, SeatPicker, Layout
  hooks/       # useAuth, useMovies, useBookings (TanStack Query)
  pages/       # Login, Register, MovieList, Booking, BookingHistory
  routes/      # router + ProtectedRoute
  store/       # useAuthStore (zustand persist)
  styles/      # tailwind base + custom layers
  types/       # shared TS interfaces
```

## Routes

| Path           | Auth     | Mô tả                                      |
| -------------- | -------- | ------------------------------------------ |
| `/login`       | public   | Đăng nhập                                  |
| `/register`    | public   | Đăng ký → publish `USER_REGISTERED`        |
| `/movies`      | public   | Feed phim (style story-stream của The Verge) |
| `/book/:id`    | required | Chọn ghế + showtime → tạo booking          |
| `/bookings`    | required | Lịch sử booking + trạng thái thực tế       |

## Chạy

### 1. Cài đặt

```bash
cd frontend
npm install
```

### 2. Chỉnh `.env`

```bash
cp .env.example .env
# Sửa nếu API Gateway không chạy trên localhost:8080
# VITE_API_GATEWAY_URL=http://192.168.1.10:8080
```

### 3. Dev server

```bash
npm run dev
# → http://localhost:8085
```

### 4. Build production

```bash
npm run build
npm run preview   # phục vụ tại port 8085
```

## Luồng demo

1. Mở `/register` → tạo user mới → toast "Registration successful" → tự chuyển `/login`.
2. Login bằng `admin / Admin@123` (account seed sẵn).
3. Vào `/movies` → click **Book seats** trên 1 thẻ.
4. Chọn ghế + showtime → **Submit booking →** → toast "Booking created — waiting payment…"
   - Frontend bắt đầu **polling** `GET /api/bookings/{id}` mỗi 1.5s.
5. Booking status sẽ chuyển sang `CONFIRMED` (payment success) hoặc `FAILED` (payment fail) trong vài giây.
6. Vào `/bookings` để xem toàn bộ lịch sử + trạng thái.

## Lưu ý kiến trúc

- **CORS**: được cấu hình ở API Gateway (`api-gateway/src/main/resources/application.yml`),
  whitelist `http://localhost:8085` và dải LAN `192.168.*.*`, `10.*.*.*`.
- **Auth**: JWT lưu trong Zustand persist (localStorage). Mỗi request được axios
  interceptor gắn `Authorization: Bearer <token>`. Khi nhận 401, store bị clear và
  điều hướng về `/login`.
- **Booking unitPrice**: theo ADR-007, frontend gửi kèm `unitPrice` trong
  `CreateBookingRequest` (vì `booking-service` không gọi sang `movie-service`).
  Backend tính `amount = unitPrice * seats.size` và publish `BOOKING_CREATED`.

## Mở rộng

- Bổ sung trang `/admin/movies` cho user role `ADMIN`.
- WebSocket / SSE để push booking status thay cho polling.
- Skeleton loading + lazy poster image.
