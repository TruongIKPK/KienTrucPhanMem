package org.example;

import org.example.domain.PaymentTransaction;
import org.example.payment.*;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {
        System.out.println("=== GIAO DỊCH 1: Thẻ tín dụng + Phí xử lý ===");
        // Bọc: Credit Card -> Phí xử lý 2%
        IPaymentStrategy ccStrategy = new ProcessingFeeDecorator(new CreditCardPayment());
        PaymentTransaction tx1 = new PaymentTransaction("TXN001", 1000.0, ccStrategy);

        tx1.processTransaction(); // Khởi chạy luồng thanh toán
        tx1.processTransaction(); // Thử thanh toán lại xem có bị trừ tiền lấn 2 không?
        tx1.cancelTransaction();  // Thử hủy khi đã hoàn tất

        System.out.println("\n=== GIAO DỊCH 2: PayPal + Mã giảm giá + Phí xử lý ===");
        // Bọc nhiều lớp: PayPal -> Mã giảm giá $50 -> Phí xử lý 2% (Tính trên giá đã giảm)
        IPaymentStrategy paypalStrategy = new PayPalPayment();
        paypalStrategy = new DiscountDecorator(paypalStrategy, 50.0);
        paypalStrategy = new ProcessingFeeDecorator(paypalStrategy);

        PaymentTransaction tx2 = new PaymentTransaction("TXN002", 500.0, paypalStrategy);

        tx2.processTransaction();
    }
}