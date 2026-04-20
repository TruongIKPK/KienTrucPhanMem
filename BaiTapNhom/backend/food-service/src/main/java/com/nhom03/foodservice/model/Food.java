package com.nhom03.foodservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "foods")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    @Builder.Default
    private Category category = Category.MAIN;
    
    @Builder.Default
    private Boolean available = true;
}
