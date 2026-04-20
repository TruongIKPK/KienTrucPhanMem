# React Component Templates

## Basic Component

```jsx
import { useState, useEffect } from 'react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2, onAction }) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  const handleAction = () => {
    // Handler logic
    onAction?.(data);
  };
  
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

---

## Page Component Template

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import api from '../services/api';
import './PageName.css';

const PageName = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/endpoint');
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="page-name">
      <h1>Page Title</h1>
      {/* Page content */}
    </div>
  );
};

export default PageName;
```

---

## Form Component Template

```jsx
import { useState } from 'react';
import Input from './common/Input';
import Button from './common/Button';

const FormComponent = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    field1: initialData.field1 || '',
    field2: initialData.field2 || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.field1.trim()) {
      newErrors.field1 = 'Field 1 is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="form-component">
      {errors.submit && <div className="error-message">{errors.submit}</div>}
      
      <Input
        name="field1"
        label="Field 1"
        value={formData.field1}
        onChange={handleChange}
        error={errors.field1}
        required
      />
      
      <Input
        name="field2"
        label="Field 2"
        value={formData.field2}
        onChange={handleChange}
        error={errors.field2}
      />
      
      <Button type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  );
};

export default FormComponent;
```

---

## Food Ordering Specific Templates

### FoodCard Component

```jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './FoodCard.css';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    addToCart(food, quantity);
    setQuantity(1);
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };
  
  return (
    <div className="food-card">
      {food.imageUrl && (
        <img src={food.imageUrl} alt={food.name} className="food-image" />
      )}
      <div className="food-info">
        <h3 className="food-name">{food.name}</h3>
        <p className="food-description">{food.description}</p>
        <span className="food-price">{formatPrice(food.price)}</span>
      </div>
      <div className="food-actions">
        <input
          type="number"
          min="1"
          max="99"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="quantity-input"
        />
        <button onClick={handleAddToCart} className="add-to-cart-btn">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
```

### CartItem Component

```jsx
import { useCart } from '../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { food, quantity } = item;
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };
  
  return (
    <div className="cart-item">
      <div className="item-info">
        <h4>{food.name}</h4>
        <span className="item-price">{formatPrice(food.price)}</span>
      </div>
      
      <div className="item-quantity">
        <button 
          onClick={() => updateQuantity(food.id, quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span>{quantity}</span>
        <button onClick={() => updateQuantity(food.id, quantity + 1)}>
          +
        </button>
      </div>
      
      <div className="item-subtotal">
        {formatPrice(food.price * quantity)}
      </div>
      
      <button 
        onClick={() => removeFromCart(food.id)}
        className="remove-btn"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;
```

### LoginForm Component

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Đăng nhập</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="username">Tên đăng nhập</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  );
};

export default LoginForm;
```

---

## Common Components

### Loading Component

```jsx
import './Loading.css';

const Loading = ({ message = 'Đang tải...' }) => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loading;
```

### Button Component

```jsx
import './Button.css';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? 'Đang xử lý...' : children}
    </button>
  );
};

export default Button;
```

### Input Component

```jsx
import './Input.css';

const Input = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  ...props
}) => {
  return (
    <div className={`input-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="input"
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Input;
```

---

## Navbar Component

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🍜 Food Ordering
      </Link>
      
      <div className="nav-links">
        <Link to="/menu">Menu</Link>
        
        {user ? (
          <>
            <Link to="/cart" className="cart-link">
              🛒 Giỏ hàng {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
            <Link to="/orders">Đơn hàng</Link>
            <span className="user-info">Xin chào, {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```
