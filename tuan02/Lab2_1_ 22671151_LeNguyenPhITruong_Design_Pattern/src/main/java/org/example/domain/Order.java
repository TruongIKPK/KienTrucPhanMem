package org.example.domain;

import org.example.shipping.IShippingStrategy;
import org.example.state.NewState;
import org.example.state.OrderState;

public class Order {
    private OrderState state;
    private final IShippingStrategy shippingStrategy;

    public Order(IShippingStrategy shippingStrategy) {
        this.state = new NewState();
        this.shippingStrategy = shippingStrategy;
    }

    public void setState(OrderState state) {
        this.state = state;
    }

    public IShippingStrategy getShippingStrategy() {
        return shippingStrategy;
    }

    public void processOrder() {
        state.process(this);
    }

    public void cancelOrder() {
        state.cancel(this);
    }
}
