package org.example.state;

import org.example.domain.PaymentTransaction;

public class PendingState implements PaymentState{
    @Override
    public void process(PaymentTransaction context) {
        System.out.println("[PENDING] Bắt đầu khởi tạo giao dịch... Chuyển sang đang xử lý.");
        context.setState(new ProcessingState());
        context.processTransaction();
    }

    @Override
    public void cancel(PaymentTransaction context) {
        System.out.println("[PENDING] Giao dịch đã bị hủy bởi người dùng.");
        context.setState(new FailedState());
    }
}
