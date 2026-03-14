package org.example.state;

import org.example.domain.Order;

public class ProcessingState implements OrderState{
    @Override
    public void process(Order context) {
        System.out.println("[PROCESSING] Bắt đầu đóng gói và vận chuyển...");
        if (context.getShippingStrategy() != null) {
            context.getShippingStrategy().ship();
        } else {
            System.out.println("Chưa có phương thức vận chuyển!");
        }
        context.setState(new DeliveredState());
    }

    @Override
    public void cancel(Order context) {
        System.out.println("[PROCESSING] Đang giao cho đơn vị vận chuyển, thu hồi hàng và hoàn tiền...");
        context.setState(new CanceledState());
    }
}
