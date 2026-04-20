# Frontend UI Rules - ReactJS

## Project Setup

### Vite + React
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
```

### Folder Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Loading.jsx
│   │   └── Navbar.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── food/
│   │   ├── FoodCard.jsx
│   │   └── FoodList.jsx
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   └── CartSummary.jsx
│   └── order/
│       └── OrderList.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── MenuPage.jsx
│   ├── CartPage.jsx
│   └── OrderPage.jsx
├── services/
│   ├── api.js
│   ├── userService.js
│   ├── foodService.js
│   ├── orderService.js
│   └── paymentService.js
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useCart.js
├── utils/
│   └── formatters.js
├── App.jsx
└── main.jsx
```

---

## Component Patterns

### Functional Component
```jsx
import { useState, useEffect } from 'react';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await foodService.getAll();
        setFoods(response.data);
      } catch (err) {
        setError('Không thể tải danh sách món');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoods();
  }, []);
  
  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="food-list">
      {foods.map(food => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
};

export default FoodList;
```

### Props Pattern
```jsx
const FoodCard = ({ food, onAddToCart }) => {
  const { name, price, description, imageUrl } = food;
  
  return (
    <div className="food-card">
      {imageUrl && <img src={imageUrl} alt={name} />}
      <h3>{name}</h3>
      <p>{description}</p>
      <span className="price">{formatPrice(price)}</span>
      <button onClick={() => onAddToCart(food)}>
        Thêm vào giỏ
      </button>
    </div>
  );
};
```

---

## Context Pattern

### AuthContext
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (credentials) => {
    const response = await userService.login(credentials);
    const { token, ...userData } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return response;
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  const register = async (data) => {
    return await userService.register(data);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### CartContext
```jsx
import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  
  const addToCart = (food, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.food.id === food.id);
      if (existing) {
        return prev.map(item =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { food, quantity }];
    });
  };
  
  const removeFromCart = (foodId) => {
    setItems(prev => prev.filter(item => item.food.id !== foodId));
  };
  
  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.food.id === foodId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => setItems([]);
  
  const total = items.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );
  
  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
```

---

## API Service Pattern

### Base API Config
```jsx
// services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Files
```jsx
// services/foodService.js
import api from './api';

export const foodService = {
  getAll: () => api.get('/foods'),
  getById: (id) => api.get(`/foods/${id}`),
  create: (data) => api.post('/foods', data),
  update: (id, data) => api.put(`/foods/${id}`, data),
  delete: (id) => api.delete(`/foods/${id}`),
};
```

---

## Routing

### App.jsx
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={
              <PrivateRoute><CartPage /></PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute><OrderPage /></PrivateRoute>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## Form Handling

### Login Form
```jsx
const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(formData);
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <Input
        name="username"
        placeholder="Tên đăng nhập"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <Input
        name="password"
        type="password"
        placeholder="Mật khẩu"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <Button type="submit" loading={loading}>
        Đăng nhập
      </Button>
    </form>
  );
};
```

---

## Styling Guidelines

### CSS Classes
```css
/* Consistent naming */
.food-card { }
.food-card__title { }
.food-card__price { }
.food-card--selected { }

/* Responsive */
@media (max-width: 768px) {
  .food-list {
    grid-template-columns: 1fr;
  }
}
```

### Tailwind (if using)
```jsx
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
  <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
  <p className="text-red-500 font-bold">{formatPrice(food.price)}</p>
  <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
    Thêm vào giỏ
  </button>
</div>
```

---

## Error Handling

```jsx
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className="error-page">
        <h1>Oops! Có lỗi xảy ra</h1>
        <button onClick={() => window.location.reload()}>
          Tải lại trang
        </button>
      </div>
    );
  }
  
  return children;
};
```

---

## Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:8080/api

# .env.production
VITE_API_URL=http://192.168.1.104:8080/api
```
