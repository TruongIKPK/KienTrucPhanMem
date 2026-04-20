# Tech Stack Details

## Overview

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | ReactJS | 18.x |
| Backend | Spring Boot | 3.x |
| API Gateway | Spring Cloud Gateway | 2023.x |
| Database | H2 | 2.x |
| Build Tool | Maven | 3.9+ |

---

## Monorepo Structure

Tất cả services nằm trong **cùng 1 repository**:

```
BaiTapNhom/
├── frontend/                 # ReactJS (port 3000)
├── backend/
│   ├── user-service/         # Spring Boot (port 8081)
│   ├── food-service/         # Spring Boot (port 8082)
│   ├── order-service/        # Spring Boot (port 8083)
│   ├── payment-service/      # Spring Boot (port 8084)
│   └── api-gateway/          # Spring Cloud Gateway (port 8080)
├── ai-agent/                 # Documentation
└── README.md
```

> **Lưu ý**: Mỗi service là 1 Spring Boot project độc lập với `pom.xml` riêng, nhưng tất cả nằm chung repository để dễ quản lý và demo.

---

## Frontend Stack

### Core
- **ReactJS 18.x** - UI library
- **Vite** - Build tool (hoặc Create React App)
- **React Router v6** - Client-side routing

### HTTP Client
- **Axios** - HTTP client cho API calls

### State Management
- **React Context** - Global state (đơn giản)
- **useState/useReducer** - Local state

### Styling
- **CSS Modules** hoặc **Tailwind CSS**
- **Responsive design**

### Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── auth/
│   │   ├── food/
│   │   ├── cart/
│   │   └── order/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── MenuPage.jsx
│   │   ├── CartPage.jsx
│   │   └── OrderPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

### Axios Configuration
```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  login: (data) => api.post('/users/login', data),
  register: (data) => api.post('/users/register', data),
};

export const foodService = {
  getAll: () => api.get('/foods'),
  getById: (id) => api.get(`/foods/${id}`),
};

export const orderService = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
};

export const paymentService = {
  pay: (data) => api.post('/payments', data),
};
```

---

## Backend Stack (Per Service)

### Core Dependencies
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
</parent>

<dependencies>
    <!-- Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- H2 Database -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

### Project Structure (Per Service)

Mỗi service nằm trong `backend/{service-name}/`:

```
backend/user-service/
├── src/main/java/com/nhom03/userservice/
│   ├── controller/
│   │   └── UserController.java
│   ├── service/
│   │   └── UserService.java
│   ├── repository/
│   │   └── UserRepository.java
│   ├── model/
│   │   ├── User.java
│   │   └── Role.java
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── UserResponse.java
│   ├── config/
│   │   └── CorsConfig.java
│   └── UserServiceApplication.java
├── src/main/resources/
│   └── application.yml
└── pom.xml
```

> Tương tự cho `food-service/`, `order-service/`, `payment-service/`, `api-gateway/`

### CORS Configuration
```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000", "http://192.168.1.100:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## API Gateway Stack

### Dependencies
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2023.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

---

## Development Tools

### IDE
- **IntelliJ IDEA** (recommended) hoặc **VS Code**

### API Testing
- **Postman** hoặc **Insomnia**

### Version Control
- **Git**

### Build & Run
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend service
cd user-service
mvn spring-boot:run
```

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api
```

### Backend (application.yml)
```yaml
server:
  port: 8081

spring:
  application:
    name: user-service
```

### LAN Deployment
```
USER_SERVICE_HOST=192.168.1.101
FOOD_SERVICE_HOST=192.168.1.102
ORDER_SERVICE_HOST=192.168.1.103
PAYMENT_SERVICE_HOST=192.168.1.104
GATEWAY_HOST=192.168.1.105
FRONTEND_HOST=192.168.1.100
```
