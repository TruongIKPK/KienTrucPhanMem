package org.example.payment;

public abstract class PaymentDecorator implements IPaymentStrategy{
    protected IPaymentStrategy wrapper;

    public PaymentDecorator(IPaymentStrategy wrapper) {
        this.wrapper = wrapper;
    }

    @Override
    public double calculateFinalAmount(double baseAmount) {
        return wrapper.calculateFinalAmount(baseAmount);
    }

    @Override
    public void executePayment(double finalAmount) {
        wrapper.executePayment(finalAmount);
    }
}
