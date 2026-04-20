package com.nhom03.userservice.service;

import com.nhom03.userservice.dto.LoginRequest;
import com.nhom03.userservice.dto.RegisterRequest;
import com.nhom03.userservice.dto.UserResponse;
import com.nhom03.userservice.exception.BadRequestException;
import com.nhom03.userservice.exception.ResourceNotFoundException;
import com.nhom03.userservice.model.Role;
import com.nhom03.userservice.model.User;
import com.nhom03.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        Role role = Role.USER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            role = Role.ADMIN;
        }
        
        User user = User.builder()
            .username(request.getUsername())
            .password(request.getPassword())
            .email(request.getEmail())
            .role(role)
            .build();
        
        user = userRepository.save(user);
        
        return toResponse(user);
    }
    
    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BadRequestException("Invalid username or password"));
        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }
        
        UserResponse response = toResponse(user);
        response.setToken("jwt-token-" + UUID.randomUUID().toString().substring(0, 8));
        
        return response;
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
        
        return toResponse(user);
    }
    
    private UserResponse toResponse(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .role(user.getRole().name())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
