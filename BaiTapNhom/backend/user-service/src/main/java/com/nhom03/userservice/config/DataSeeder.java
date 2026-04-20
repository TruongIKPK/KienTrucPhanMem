package com.nhom03.userservice.config;

import com.nhom03.userservice.model.Role;
import com.nhom03.userservice.model.User;
import com.nhom03.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    
    private final UserRepository userRepository;
    
    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding user data...");
            
            userRepository.saveAll(Arrays.asList(
                User.builder()
                    .username("admin")
                    .password("admin123")
                    .email("admin@nhom03.com")
                    .role(Role.ADMIN)
                    .build(),
                    
                User.builder()
                    .username("user1")
                    .password("123456")
                    .email("user1@nhom03.com")
                    .role(Role.USER)
                    .build(),
                    
                User.builder()
                    .username("user2")
                    .password("123456")
                    .email("user2@nhom03.com")
                    .role(Role.USER)
                    .build(),
                    
                User.builder()
                    .username("nhanvien")
                    .password("123456")
                    .email("nhanvien@company.com")
                    .role(Role.USER)
                    .build()
            ));
            
            log.info("User data seeded successfully!");
            log.info("===========================================");
            log.info("DEFAULT ACCOUNTS:");
            log.info("  Admin: admin / admin123");
            log.info("  User:  user1 / 123456");
            log.info("  User:  user2 / 123456");
            log.info("  User:  nhanvien / 123456");
            log.info("===========================================");
        }
    }
}
