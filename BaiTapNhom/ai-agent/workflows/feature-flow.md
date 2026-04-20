# Feature Development Workflow

## Overview

Quy trình phát triển feature mới trong dự án Mini Food Ordering System.

## Feature Flow Diagram

```
┌─────────────┐
│ 1. Analyze  │
│ Requirements│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 2. Identify │
│  Services   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 3. Define   │
│    APIs     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 4. Implement│
│   Backend   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 5. Implement│
│  Frontend   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 6. Test     │
│ Integration │
└─────────────┘
```

---

## Step 1: Analyze Requirements

### Questions to Answer
- Feature này thuộc chức năng nào? (User, Food, Order, Payment)
- Ai sẽ sử dụng? (User, Admin)
- Data cần lưu trữ?
- APIs cần tạo?
- UI pages/components cần?

### Example: Add Food to Cart

```
Feature: Thêm món vào giỏ hàng
- User: Customer
- No backend storage (cart in frontend state)
- No new API needed (use existing GET /foods)
- UI: FoodCard component với Add to Cart button
```

---

## Step 2: Identify Affected Services

### Service Mapping

| Feature | Frontend | User Service | Food Service | Order Service | Payment Service |
|---------|----------|--------------|--------------|---------------|-----------------|
| Login | ✅ | ✅ | | | |
| View Menu | ✅ | | ✅ | | |
| Add to Cart | ✅ | | | | |
| Create Order | ✅ | ✅ | ✅ | ✅ | |
| Pay Order | ✅ | | | ✅ | ✅ |

### Coordination
- Xác định người phụ trách mỗi service
- Agree on API contracts
- Define data formats

---

## Step 3: Define APIs

### API Contract Template

```yaml
Endpoint: POST /orders
Service: Order Service
Owner: Người 4

Request:
  userId: Long (required)
  items: 
    - foodId: Long
      quantity: Integer
  note: String (optional)

Response (201):
  id: Long
  userId: Long
  items: [...]
  totalAmount: Double
  status: String
  createdAt: DateTime

Error (400):
  message: "User not found"
  
Error (404):
  message: "Food not found: {id}"
```

---

## Step 4: Implement Backend

### Checklist for Backend Developer

```markdown
- [ ] Read relevant context files
- [ ] Create/update entity if needed
- [ ] Create/update DTOs
- [ ] Implement repository methods
- [ ] Implement service logic
- [ ] Create controller endpoint
- [ ] Add validation
- [ ] Add error handling
- [ ] Test with Postman
- [ ] Update API documentation
```

### Implementation Order

1. **Entity & Repository** - Data layer
2. **DTOs** - Request/Response objects
3. **Service** - Business logic
4. **Controller** - REST endpoints
5. **Exception Handling** - Error cases
6. **Testing** - Manual test với Postman

---

## Step 5: Implement Frontend

### Checklist for Frontend Developer

```markdown
- [ ] Read API documentation
- [ ] Create/update service file
- [ ] Create/update components
- [ ] Add state management (if needed)
- [ ] Implement UI
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test user flow
```

### Implementation Order

1. **API Service** - Define API calls
2. **Context/State** - If global state needed
3. **Components** - UI elements
4. **Pages** - Page compositions
5. **Routing** - Navigation
6. **Styling** - CSS
7. **Testing** - User flow test

---

## Step 6: Integration Testing

### Test Checklist

```markdown
Frontend → Backend Integration:
- [ ] API responds correctly
- [ ] Data displays properly
- [ ] Error messages show
- [ ] Loading states work

Backend → Backend Integration:
- [ ] Order Service → User Service
- [ ] Order Service → Food Service
- [ ] Payment Service → Order Service
```

### Test Script

```
1. Start all services
2. Open frontend
3. Execute user flow:
   - Register/Login
   - View menu
   - Add to cart
   - Create order
   - Pay
4. Verify notifications
```

---

## Example: Create Order Feature

### Step 1: Requirements
```
Feature: Tạo đơn hàng
- User chọn món từ menu
- Thêm vào giỏ hàng
- Submit order
- Order được tạo với status PENDING
```

### Step 2: Services
```
- Frontend: Cart UI, Order form
- Order Service: POST /orders endpoint
- User Service: Validate user (internal)
- Food Service: Get food details (internal)
```

### Step 3: API
```yaml
POST /orders
Body:
  userId: 1
  items:
    - foodId: 1
      quantity: 2
    - foodId: 3
      quantity: 1
  note: "Ít cay"

Response 201:
  id: 1
  userId: 1
  items: [...]
  totalAmount: 140000
  status: "PENDING"
```

### Step 4: Backend Implementation
```java
// OrderController.java
@PostMapping
public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(orderService.createOrder(request));
}

// OrderService.java
public OrderResponse createOrder(OrderRequest request) {
    // Validate user
    validateUser(request.getUserId());
    
    // Build order items
    List<OrderItem> items = buildOrderItems(request.getItems());
    
    // Create order
    Order order = Order.builder()
        .userId(request.getUserId())
        .items(items)
        .totalAmount(calculateTotal(items))
        .status(OrderStatus.PENDING)
        .build();
    
    return toResponse(orderRepository.save(order));
}
```

### Step 5: Frontend Implementation
```jsx
// CartPage.jsx
const handleCheckout = async () => {
  try {
    const orderData = {
      userId: user.id,
      items: items.map(item => ({
        foodId: item.food.id,
        quantity: item.quantity
      }))
    };
    
    await orderService.create(orderData);
    clearCart();
    navigate('/orders');
  } catch (error) {
    setError(error.message);
  }
};
```

### Step 6: Test
```
1. Login as user
2. Add foods to cart
3. Go to cart page
4. Click checkout
5. Verify order created
6. Check order in Order Service
```

---

## Communication Guidelines

### Before Starting
- Sync với team về API contracts
- Agree on data formats
- Set deadlines

### During Development
- Update team on progress
- Report blockers immediately
- Test incrementally

### After Completion
- Demo to team
- Update documentation
- Code review (if time allows)
