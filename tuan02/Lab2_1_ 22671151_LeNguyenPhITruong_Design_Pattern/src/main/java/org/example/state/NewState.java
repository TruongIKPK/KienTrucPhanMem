package org.example.state;

import org.example.domain.Order;

public class NewState implements OrderState{
    @Override
    public void process(Order context) {
        System.out.println("[NEW] Đang kiểm tra thông tin đơn hàng... Hợp lệ!");
        context.setState(new ProcessingState());
    }

    @Override
    public void cancel(Order context) {
        System.out.println("[NEW] Đã hủy đơn hàng chưa thanh toán.");
        context.setState(new CanceledState());
    }
}
