package org.example.state;

import org.example.domain.Order;

public class DeliveredState implements OrderState{
    @Override
    public void process(Order context) {
        System.out.println("[DELIVERED] Đơn hàng đã giao thành công. Không thể xử lý thêm.");
    }

    @Override
    public void cancel(Order context) {
        System.out.println("[DELIVERED] Lỗi: Đơn hàng đã giao, không thể hủy!");
    }
}
