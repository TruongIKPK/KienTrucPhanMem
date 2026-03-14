package org.example.domain;

import org.example.payment.IPaymentStrategy;
import org.example.state.PaymentState;
import org.example.state.PendingState;

public class PaymentTransaction {
    private String transactionId;
    private double amount;
    private IPaymentStrategy strategy;
    private PaymentState state;

    public PaymentTransaction(String transactionId, double amount, IPaymentStrategy strategy) {
        this.transactionId = transactionId;
        this.amount = amount;
        this.strategy = strategy;
        this.state = new PendingState(); // Mặc định là Chờ xử lý
    }

    public void processTransaction() {
        state.process(this);
    }

    public void cancelTransaction() {
        state.cancel(this);
    }

    // Getters & Setters cho State
    public void setState(PaymentState state) { this.state = state; }
    public double getAmount() { return amount; }
    public IPaymentStrategy getStrategy() { return strategy; }
}
