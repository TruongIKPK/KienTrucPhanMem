# Naming Conventions

## Java Naming

### Classes
- **PascalCase**
- Nouns
- Suffix theo role

```java
// Controllers
UserController
FoodController
OrderController

// Services
UserService
FoodService
OrderService

// Repositories
UserRepository
FoodRepository

// Entities
User
Food
Order
OrderItem

// DTOs
LoginRequest
LoginResponse
FoodRequest
FoodResponse

// Exceptions
ResourceNotFoundException
InvalidCredentialsException

// Configurations
CorsConfig
SecurityConfig
```

### Methods
- **camelCase**
- Verbs
- Descriptive

```java
// Controllers
getAllFoods()
getFoodById()
createFood()
updateFood()
deleteFood()

// Services
findAllUsers()
findUserById()
validateCredentials()
calculateTotal()

// Repository (Spring Data)
findByUsername()
findByCategory()
findAllByUserId()
```

### Variables
- **camelCase**
- Meaningful names

```java
// Good
String userName;
List<Food> foodList;
Double totalAmount;
Long orderId;

// Bad
String s;
List<Food> list;
Double x;
Long id;
```

### Constants
- **UPPER_SNAKE_CASE**

```java
public static final String API_VERSION = "v1";
public static final int MAX_RETRY_ATTEMPTS = 3;
public static final double TAX_RATE = 0.1;
```

### Packages
- **lowercase**
- Domain-based

```
com.nhom03.userservice
com.nhom03.userservice.controller
com.nhom03.userservice.service
com.nhom03.userservice.repository
com.nhom03.userservice.model
com.nhom03.userservice.dto
com.nhom03.userservice.config
com.nhom03.userservice.exception
```

---

## ReactJS Naming

### Components
- **PascalCase**
- Descriptive

```jsx
// Components
FoodCard.jsx
FoodList.jsx
CartItem.jsx
OrderSummary.jsx
LoginForm.jsx
RegisterForm.jsx

// Pages
HomePage.jsx
MenuPage.jsx
CartPage.jsx
OrderPage.jsx
LoginPage.jsx
```

### Functions/Hooks
- **camelCase**
- Prefix with `use` for hooks
- Prefix with `handle` for event handlers

```jsx
// Hooks
useAuth()
useCart()
useFoods()

// Event handlers
handleSubmit()
handleClick()
handleChange()
handleAddToCart()

// Utility functions
formatPrice()
calculateTotal()
validateEmail()
```

### Variables
- **camelCase**

```jsx
// Good
const [isLoading, setIsLoading] = useState(false);
const [foodList, setFoodList] = useState([]);
const [currentUser, setCurrentUser] = useState(null);

// Bad
const [l, setL] = useState(false);
const [data, setData] = useState([]);
```

### Props
- **camelCase**

```jsx
<FoodCard 
  food={food}
  onAddToCart={handleAddToCart}
  isSelected={selectedId === food.id}
/>
```

### CSS Classes
- **kebab-case** hoặc **BEM**

```css
/* Simple */
.food-card {}
.food-card-title {}
.food-card-price {}

/* BEM */
.food-card {}
.food-card__title {}
.food-card__price {}
.food-card--selected {}
```

### Files/Folders
- Components: **PascalCase** (`FoodCard.jsx`)
- Utils/Services: **camelCase** (`api.js`, `formatters.js`)
- Styles: **kebab-case** (`food-card.css`)

---

## Database Naming

### Tables
- **snake_case**
- Plural

```sql
users
foods
orders
order_items
payments
```

### Columns
- **snake_case**

```sql
id
user_id
food_id
order_id
created_at
updated_at
total_amount
payment_method
```

### Primary Keys
```sql
id  -- Always named 'id'
```

### Foreign Keys
```sql
user_id
food_id
order_id
```

---

## API Naming

### Endpoints
- **kebab-case** (nếu cần)
- Plural nouns
- RESTful

```
GET    /users
GET    /users/{id}
POST   /users
PUT    /users/{id}
DELETE /users/{id}

GET    /foods
POST   /foods
GET    /orders
POST   /orders
POST   /payments
```

### Query Parameters
- **camelCase**

```
GET /orders?userId=1&status=PENDING
GET /foods?category=MAIN&minPrice=20000
```

### Request/Response Fields
- **camelCase**

```json
{
  "userId": 1,
  "foodName": "Phở bò",
  "totalAmount": 45000,
  "createdAt": "2024-01-15T10:30:00"
}
```

---

## Summary Table

| Type | Convention | Example |
|------|------------|---------|
| Java Class | PascalCase | `UserService` |
| Java Method | camelCase | `findUserById()` |
| Java Variable | camelCase | `userName` |
| Java Constant | UPPER_SNAKE | `MAX_RETRIES` |
| Java Package | lowercase | `com.nhom03.userservice` |
| React Component | PascalCase | `FoodCard.jsx` |
| React Function | camelCase | `handleSubmit()` |
| React Hook | use + camelCase | `useAuth()` |
| CSS Class | kebab-case | `food-card` |
| DB Table | snake_case | `order_items` |
| DB Column | snake_case | `created_at` |
| API Endpoint | lowercase | `/api/foods` |
| JSON Field | camelCase | `totalAmount` |
