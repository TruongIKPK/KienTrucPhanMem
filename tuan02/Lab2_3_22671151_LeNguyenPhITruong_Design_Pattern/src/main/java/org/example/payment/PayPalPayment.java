package org.example.payment;

public class PayPalPayment implements IPaymentStrategy{
    @Override
    public double calculateFinalAmount(double baseAmount) {
        return baseAmount;
    }

    @Override
    public void executePayment(double finalAmount) {
        System.out.println("Đang kết nối với API PayPal... Đã thanh toán: $" + finalAmount);
    }
}
