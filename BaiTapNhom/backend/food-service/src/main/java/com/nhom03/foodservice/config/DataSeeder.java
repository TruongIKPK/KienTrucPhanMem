package com.nhom03.foodservice.config;

import com.nhom03.foodservice.model.Category;
import com.nhom03.foodservice.model.Food;
import com.nhom03.foodservice.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    
    private final FoodRepository foodRepository;
    
    @Override
    public void run(String... args) {
        if (foodRepository.count() == 0) {
            log.info("Seeding food data...");
            
            foodRepository.saveAll(Arrays.asList(
                // MAIN DISHES
                Food.builder()
                    .name("Phở bò")
                    .description("Phở bò tái chín thơm ngon, nước dùng đậm đà")
                    .price(45000.0)
                    .imageUrl("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400")
                    .category(Category.MAIN)
                    .available(true)
                    .build(),
                    
                Food.builder()
                    .name("Cơm tấm sườn")
                    .description("Cơm tấm sườn bì chả, đồ chua, nước mắm")
                    .price(50000.0)
                    .imageUrl("https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400")
                    .category(Category.MAIN)
                    .available(true)
                    .build(),
                    
                Food.builder()
                    .name("Bún chả Hà Nội")
                    .description("Bún chả thịt nướng than hoa, rau sống tươi")
                    .price(45000.0)
                    .imageUrl("https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400")
                    .category(Category.MAIN)
                    .available(true)
                    .build(),
                    
                Food.builder()
                    .name("Cơm gà xối mỡ")
                    .description("Cơm gà giòn rụm, da vàng ươm")
                    .price(55000.0)
                    .imageUrl("https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400")
                    .category(Category.MAIN)
                    .available(true)
                    .build(),
                    
                Food.builder()
                    .name("Mì xào hải sản")
                    .description("Mì xào tôm, mực, nghêu tươi ngon")
                    .price(60000.0)
                    .imageUrl("https://images.unsplash.com/photo-1634864572865-1cf8ff8bd23d?w=400")
                    .category(Category.MAIN)
                    .available(true)
                    .build(),
                    
                Food.builder()
                    .name("Bánh mì thịt")
                    .description("Bánh mì pate, thịt nguội, rau thơm")
                    .price(25000.0)
                    .imageUrl("https://images.unsplash.com/photo-1600688640154-9619e002df30?w=400")
                    .category(Category.MAIN)
                    .available(true)
                    .build(),
                    
                // DRINKS
                Food.builder()
                    .name("Trà đá")
                    .description("Trà đá mát lạnh giải khát")
                    .price(5000.0)
                    .imageUrl("https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400")
                    .category(Category.DRINK)
                    .available(true)
                    .build(),
                    
                Food.builder()
                    .name("Coca-Cola")
                    .description("Nước ngọt có ga Coca-Cola 330ml")
                    .price(15000.0)
                    .imageUrl("https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400")
                    .category(Category.DRINK)
                    .available(true)
                    .build(),
                    
                Food.builder()
                    .name("Cà phê sữa đá")
                    .description("Cà phê phin pha sữa đặc, đá viên")
                    .price(25000.0)
                    .imageUrl("https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400")
                    .category(Category.DRINK)
                    .available(true)
                    .build(),
                    
                Food.builder()
                    .name("Nước ép cam")
                    .description("Nước cam tươi vắt, vitamin C dồi dào")
                    .price(30000.0)
                    .imageUrl("https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400")
                    .category(Category.DRINK)
                    .available(true)
                    .build(),
                    
                // DESSERTS
                Food.builder()
                    .name("Chè thập cẩm")
                    .description("Chè đậu xanh, đậu đỏ, thạch, trân châu")
                    .price(20000.0)
                    .imageUrl("https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400")
                    .category(Category.DESSERT)
                    .available(true)
                    .build(),
                    
                Food.builder()
                    .name("Bánh flan")
                    .description("Bánh flan caramen mềm mịn")
                    .price(15000.0)
                    .imageUrl("https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400")
                    .category(Category.DESSERT)
                    .available(true)
                    .build(),
                    
                // SIDES
                Food.builder()
                    .name("Gỏi cuốn")
                    .description("Gỏi cuốn tôm thịt, rau sống (2 cuốn)")
                    .price(20000.0)
                    .imageUrl("https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400")
                    .category(Category.SIDE)
                    .available(true)
                    .build(),
                    
                Food.builder()
                    .name("Chả giò")
                    .description("Chả giò giòn rụm (4 cuốn)")
                    .price(25000.0)
                    .imageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?w=400")
                    .category(Category.SIDE)
                    .available(true)
                    .build()
            ));
            
            log.info("Food data seeded successfully! Total: {} items", foodRepository.count());
        }
    }
}
