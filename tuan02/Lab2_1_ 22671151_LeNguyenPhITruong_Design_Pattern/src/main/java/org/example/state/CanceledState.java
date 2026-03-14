package org.example.state;

import org.example.domain.Order;

public class CanceledState implements OrderState{
    @Override
    public void process(Order context) {
        System.out.println("[CANCELED] Lỗi: Đơn hàng đã bị hủy, không thể tiếp tục xử lý.");
    }

    @Override
    public void cancel(Order context) {
        System.out.println("[CANCELED] Đơn hàng đã ở trạng thái hủy từ trước.");
    }
}
