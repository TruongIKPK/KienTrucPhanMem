package org.example.state;

import org.example.domain.PaymentTransaction;

public class FailedState implements PaymentState{
    @Override
    public void process(PaymentTransaction context) {
        System.out.println("[FAILED] Giao dịch đã thất bại/hủy. Vui lòng tạo giao dịch mới.");
    }

    @Override
    public void cancel(PaymentTransaction context) {
        System.out.println("[FAILED] Giao dịch vốn đã ở trạng thái hủy.");
    }
}
