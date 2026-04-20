package com.nhom03.paymentservice.service;

import com.nhom03.paymentservice.dto.OrderResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {
    
    public void sendPaymentNotification(OrderResponse order, String paymentMethod) {
        String message = buildNotificationMessage(order, paymentMethod);
        
        System.out.println();
        System.out.println("===========================================");
        System.out.println("🎉 NOTIFICATION: Đặt hàng thành công!");
        System.out.println("===========================================");
        System.out.println(message);
        System.out.println("===========================================");
        System.out.println();
        
        log.info("Notification sent: {}", message);
    }
    
    private String buildNotificationMessage(OrderResponse order, String paymentMethod) {
        StringBuilder sb = new StringBuilder();
        sb.append("📋 Đơn hàng #").append(order.getId()).append("\n");
        sb.append("👤 User ID: ").append(order.getUserId()).append("\n");
        sb.append("💰 Tổng tiền: ").append(String.format("%,.0f", order.getTotalAmount())).append("đ\n");
        sb.append("💳 Phương thức: ").append(paymentMethod.equals("COD") ? "Tiền mặt" : "Chuyển khoản").append("\n");
        sb.append("📝 Trạng thái: ").append(order.getStatus());
        return sb.toString();
    }
}
