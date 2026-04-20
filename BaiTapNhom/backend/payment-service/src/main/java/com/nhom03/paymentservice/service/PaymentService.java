package com.nhom03.paymentservice.service;

import com.nhom03.paymentservice.dto.OrderResponse;
import com.nhom03.paymentservice.dto.PaymentRequest;
import com.nhom03.paymentservice.dto.PaymentResponse;
import com.nhom03.paymentservice.exception.PaymentException;
import com.nhom03.paymentservice.exception.ResourceNotFoundException;
import com.nhom03.paymentservice.exception.ServiceUnavailableException;
import com.nhom03.paymentservice.model.Payment;
import com.nhom03.paymentservice.model.PaymentMethod;
import com.nhom03.paymentservice.model.PaymentStatus;
import com.nhom03.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final RestTemplate restTemplate;
    private final NotificationService notificationService;
    
    @Value("${services.order.url}")
    private String orderServiceUrl;
    
    public PaymentResponse processPayment(PaymentRequest request) {
        log.info("Processing payment for order: {}", request.getOrderId());
        
        OrderResponse order = getOrder(request.getOrderId());
        
        if (!order.getTotalAmount().equals(request.getAmount())) {
            throw new PaymentException("Amount mismatch. Expected: " + order.getTotalAmount() + ", Got: " + request.getAmount());
        }
        
        PaymentMethod method;
        try {
            method = PaymentMethod.valueOf(request.getMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new PaymentException("Invalid payment method: " + request.getMethod());
        }
        
        Payment payment = Payment.builder()
            .orderId(request.getOrderId())
            .method(method)
            .amount(request.getAmount())
            .status(PaymentStatus.SUCCESS)
            .transactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .build();
        
        payment = paymentRepository.save(payment);
        log.info("Payment saved with id: {}", payment.getId());
        
        updateOrderStatus(request.getOrderId(), "PAID");
        
        OrderResponse updatedOrder = getOrder(request.getOrderId());
        notificationService.sendPaymentNotification(updatedOrder, method.name());
        
        return toResponse(payment, "Thanh toán thành công! User đã đặt đơn #" + request.getOrderId() + " thành công");
    }
    
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));
        return toResponse(payment, null);
    }
    
    private OrderResponse getOrder(Long orderId) {
        try {
            String url = orderServiceUrl + "/orders/" + orderId;
            log.info("Getting order at: {}", url);
            OrderResponse order = restTemplate.getForObject(url, OrderResponse.class);
            if (order == null) {
                throw new ResourceNotFoundException("Order not found: " + orderId);
            }
            return order;
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResourceNotFoundException("Order not found: " + orderId);
        } catch (RestClientException e) {
            log.error("Order service unavailable", e);
            throw new ServiceUnavailableException("Order service unavailable");
        }
    }
    
    private void updateOrderStatus(Long orderId, String status) {
        try {
            String url = orderServiceUrl + "/orders/" + orderId + "/status";
            log.info("Updating order status at: {}", url);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, String> body = Map.of("status", status);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            
            restTemplate.put(url, entity);
            log.info("Order {} status updated to {}", orderId, status);
        } catch (RestClientException e) {
            log.error("Failed to update order status", e);
        }
    }
    
    private PaymentResponse toResponse(Payment payment, String message) {
        return PaymentResponse.builder()
            .id(payment.getId())
            .orderId(payment.getOrderId())
            .method(payment.getMethod().name())
            .amount(payment.getAmount())
            .status(payment.getStatus().name())
            .transactionId(payment.getTransactionId())
            .message(message)
            .createdAt(payment.getCreatedAt())
            .build();
    }
}
