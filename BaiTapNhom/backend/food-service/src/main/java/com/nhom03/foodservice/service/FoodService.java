package com.nhom03.foodservice.service;

import com.nhom03.foodservice.dto.FoodRequest;
import com.nhom03.foodservice.dto.FoodResponse;
import com.nhom03.foodservice.exception.ResourceNotFoundException;
import com.nhom03.foodservice.model.Category;
import com.nhom03.foodservice.model.Food;
import com.nhom03.foodservice.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodService {
    
    private final FoodRepository foodRepository;
    
    public List<FoodResponse> getAllFoods() {
        return foodRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public FoodResponse getFoodById(Long id) {
        Food food = foodRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Food", id));
        return toResponse(food);
    }
    
    public FoodResponse createFood(FoodRequest request) {
        Category category = Category.MAIN;
        if (request.getCategory() != null) {
            try {
                category = Category.valueOf(request.getCategory().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }
        
        Food food = Food.builder()
            .name(request.getName())
            .description(request.getDescription())
            .price(request.getPrice())
            .imageUrl(request.getImageUrl())
            .category(category)
            .available(true)
            .build();
        
        food = foodRepository.save(food);
        return toResponse(food);
    }
    
    public FoodResponse updateFood(Long id, FoodRequest request) {
        Food food = foodRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Food", id));
        
        if (request.getName() != null) {
            food.setName(request.getName());
        }
        if (request.getDescription() != null) {
            food.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            food.setPrice(request.getPrice());
        }
        if (request.getImageUrl() != null) {
            food.setImageUrl(request.getImageUrl());
        }
        if (request.getCategory() != null) {
            try {
                food.setCategory(Category.valueOf(request.getCategory().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }
        
        food = foodRepository.save(food);
        return toResponse(food);
    }
    
    public void deleteFood(Long id) {
        if (!foodRepository.existsById(id)) {
            throw new ResourceNotFoundException("Food", id);
        }
        foodRepository.deleteById(id);
    }
    
    private FoodResponse toResponse(Food food) {
        return FoodResponse.builder()
            .id(food.getId())
            .name(food.getName())
            .description(food.getDescription())
            .price(food.getPrice())
            .imageUrl(food.getImageUrl())
            .category(food.getCategory().name())
            .available(food.getAvailable())
            .build();
    }
}
