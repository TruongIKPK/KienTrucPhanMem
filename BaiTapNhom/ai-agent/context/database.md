# Database Models

## Overview

Mỗi service có database riêng (H2 in-memory). Dưới đây là data models cho từng service.

## User Service Database

### Entity: User

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true)
    private String email;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}

public enum Role {
    USER, ADMIN
}
```

### H2 Configuration
```yaml
# application.yml
spring:
  datasource:
    url: jdbc:h2:mem:userdb
    driver-class-name: org.h2.Driver
    username: sa
    password:
  h2:
    console:
      enabled: true
      path: /h2-console
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
```

---

## Food Service Database

### Entity: Food

```java
@Entity
@Table(name = "foods")
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Column(nullable = false)
    private Double price;
    
    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    private Category category = Category.MAIN;
    
    private Boolean available = true;
}

public enum Category {
    MAIN,       // Món chính
    DRINK,      // Đồ uống
    DESSERT,    // Tráng miệng
    SIDE        // Món phụ
}
```

### Seed Data
```java
@Component
public class FoodDataSeeder implements CommandLineRunner {
    
    @Autowired
    private FoodRepository foodRepository;
    
    @Override
    public void run(String... args) {
        if (foodRepository.count() == 0) {
            foodRepository.saveAll(Arrays.asList(
                new Food("Phở bò", "Phở bò tái chín", 45000.0, null, Category.MAIN),
                new Food("Cơm tấm", "Cơm tấm sườn bì chả", 50000.0, null, Category.MAIN),
                new Food("Bún chả", "Bún chả Hà Nội", 45000.0, null, Category.MAIN),
                new Food("Trà đá", "Trà đá", 5000.0, null, Category.DRINK),
                new Food("Nước ngọt", "Coca/Pepsi/7Up", 15000.0, null, Category.DRINK),
                new Food("Chè", "Chè thập cẩm", 20000.0, null, Category.DESSERT)
            ));
        }
    }
}
```

---

## Order Service Database

### Entity: Order

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items = new ArrayList<>();
    
    private Double totalAmount;
    
    private String note;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}

public enum OrderStatus {
    PENDING,    // Chờ xử lý
    CONFIRMED,  // Đã xác nhận
    PREPARING,  // Đang chuẩn bị
    READY,      // Sẵn sàng
    PAID,       // Đã thanh toán
    CANCELLED   // Đã hủy
}
```

### Entity: OrderItem

```java
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long foodId;
    
    private String foodName;
    
    private Integer quantity;
    
    private Double price;
    
    private Double subtotal;
}
```

---

## Payment Service Database

### Entity: Payment

```java
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long orderId;
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod method;
    
    private Double amount;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    private String transactionId;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}

public enum PaymentMethod {
    COD,        // Cash on Delivery
    BANKING     // Bank Transfer
}

public enum PaymentStatus {
    PENDING,
    SUCCESS,
    FAILED
}
```

---

## ER Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER SERVICE                             │
│  ┌─────────┐                                                    │
│  │  User   │                                                    │
│  ├─────────┤                                                    │
│  │ id (PK) │                                                    │
│  │ username│                                                    │
│  │ password│                                                    │
│  │ email   │                                                    │
│  │ role    │                                                    │
│  └─────────┘                                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        FOOD SERVICE                             │
│  ┌─────────┐                                                    │
│  │  Food   │                                                    │
│  ├─────────┤                                                    │
│  │ id (PK) │                                                    │
│  │ name    │                                                    │
│  │ price   │                                                    │
│  │ category│                                                    │
│  └─────────┘                                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       ORDER SERVICE                             │
│  ┌─────────┐         ┌───────────┐                              │
│  │  Order  │ 1     * │ OrderItem │                              │
│  ├─────────┤─────────├───────────┤                              │
│  │ id (PK) │         │ id (PK)   │                              │
│  │ userId  │         │ orderId   │                              │
│  │ status  │         │ foodId    │                              │
│  │ total   │         │ quantity  │                              │
│  └─────────┘         └───────────┘                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT SERVICE                            │
│  ┌─────────┐                                                    │
│  │ Payment │                                                    │
│  ├─────────┤                                                    │
│  │ id (PK) │                                                    │
│  │ orderId │                                                    │
│  │ method  │                                                    │
│  │ status  │                                                    │
│  └─────────┘                                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Notes

- Mỗi service có H2 database riêng, không chia sẻ
- `userId`, `foodId`, `orderId` là references, không phải foreign keys
- Data validation ở application layer
- H2 Console có thể access tại `/h2-console` của mỗi service
