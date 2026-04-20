package com.nhom03.foodservice.controller;

import com.nhom03.foodservice.dto.FoodRequest;
import com.nhom03.foodservice.dto.FoodResponse;
import com.nhom03.foodservice.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/foods")
@RequiredArgsConstructor
@Slf4j
public class FoodController {
    
    private final FoodService foodService;
    
    @GetMapping
    public ResponseEntity<List<FoodResponse>> getAllFoods() {
        List<FoodResponse> foods = foodService.getAllFoods();
        return ResponseEntity.ok(foods);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FoodResponse> getFoodById(@PathVariable Long id) {
        FoodResponse food = foodService.getFoodById(id);
        return ResponseEntity.ok(food);
    }
    
    @PostMapping
    public ResponseEntity<?> createFood(
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @Valid @RequestBody FoodRequest request) {
        log.info("Create food request - Role: {}", role);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Forbidden", "message", "Only ADMIN can create food"));
        }
        FoodResponse food = foodService.createFood(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(food);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFood(
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @PathVariable Long id,
            @RequestBody FoodRequest request) {
        log.info("Update food {} - Role: {}", id, role);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Forbidden", "message", "Only ADMIN can update food"));
        }
        FoodResponse food = foodService.updateFood(id, request);
        return ResponseEntity.ok(food);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFood(
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @PathVariable Long id) {
        log.info("Delete food {} - Role: {}", id, role);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Forbidden", "message", "Only ADMIN can delete food"));
        }
        foodService.deleteFood(id);
        return ResponseEntity.noContent().build();
    }
}
