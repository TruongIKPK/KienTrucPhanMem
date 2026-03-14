package org.example.state;

import org.example.domain.PaymentTransaction;

public class CompletedState implements PaymentState{
    @Override
    public void process(PaymentTransaction context) {
        System.out.println("[COMPLETED] Giao dịch đã hoàn tất từ trước, không thể xử lý lại (Tránh trừ tiền 2 lần).");
    }

    @Override
    public void cancel(PaymentTransaction context) {
        System.out.println("[COMPLETED] Không thể hủy giao dịch đã thành công. Vui lòng tạo yêu cầu Hoàn tiền (Refund).");
    }
}
