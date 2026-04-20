package com.nhom03.foodservice.repository;

import com.nhom03.foodservice.model.Category;
import com.nhom03.foodservice.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    
    List<Food> findByCategory(Category category);
    
    List<Food> findByAvailableTrue();
    
    List<Food> findByCategoryAndAvailableTrue(Category category);
}
