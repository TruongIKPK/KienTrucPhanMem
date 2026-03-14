package org.example.state;

import org.example.domain.Order;

public interface OrderState {
    void process(Order context);
    void cancel(Order context);
}
