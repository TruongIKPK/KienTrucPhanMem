package org.example.payment;

public class DiscountDecorator extends PaymentDecorator{
    private final double discountAmount;

    public DiscountDecorator(IPaymentStrategy wrapper, double discountAmount) {
        super(wrapper);
        this.discountAmount = discountAmount;
    }

    @Override
    public double calculateFinalAmount(double baseAmount) {
        double currentAmount = super.calculateFinalAmount(baseAmount);
        System.out.println("   [-] Áp dụng mã giảm giá: -$" + discountAmount);
        return Math.max(0, currentAmount - discountAmount); // Đảm bảo không bị âm tiền
    }
}
