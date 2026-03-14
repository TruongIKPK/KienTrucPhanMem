package org.example.state;

import org.example.domain.PaymentTransaction;

public interface PaymentState {
    void process(PaymentTransaction context);
    void cancel(PaymentTransaction context);
}