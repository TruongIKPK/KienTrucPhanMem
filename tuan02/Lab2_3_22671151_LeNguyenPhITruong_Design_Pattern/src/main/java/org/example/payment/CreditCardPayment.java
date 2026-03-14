package org.example.payment;

public class CreditCardPayment implements IPaymentStrategy{
    @Override
    public double calculateFinalAmount(double baseAmount) {
        return baseAmount;
    }

    @Override
    public void executePayment(double finalAmount) {
        System.out.println("Đang kết nối với cổng Thẻ Tín Dụng... Đã thanh toán: $" + finalAmount);
    }
}
