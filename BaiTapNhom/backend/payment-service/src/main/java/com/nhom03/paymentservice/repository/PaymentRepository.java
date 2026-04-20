package com.nhom03.paymentservice.repository;

import com.nhom03.paymentservice.model.Payment;
import com.nhom03.paymentservice.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByOrderId(Long orderId);
    
    List<Payment> findByStatus(PaymentStatus status);
}
