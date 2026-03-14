package org.example.payment;

public class ProcessingFeeDecorator extends PaymentDecorator{
    public ProcessingFeeDecorator(IPaymentStrategy wrapper) {
        super(wrapper);
    }
    @Override
    public double calculateFinalAmount(double baseAmount) {
        double currentAmount = super.calculateFinalAmount(baseAmount);
        double fee = currentAmount * 0.02;
        System.out.println("   [+] Tính thêm phí xử lý giao dịch (2%): $" + fee);
        return currentAmount + fee;
    }
}
