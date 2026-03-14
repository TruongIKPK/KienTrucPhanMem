package org.example.payment;

public interface IPaymentStrategy {
    double calculateFinalAmount(double baseAmount);
    void executePayment(double finalAmount);
}