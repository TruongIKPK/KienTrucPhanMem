package org.example.state;

import org.example.domain.PaymentTransaction;

public class ProcessingState implements PaymentState{
    @Override
    public void process(PaymentTransaction context) {
        System.out.println("[PROCESSING] Đang tính toán và thực hiện trừ tiền...");

        try {
            double finalAmount = context.getStrategy().calculateFinalAmount(context.getAmount());
            System.out.println("   => Tổng tiền cuối cùng phải trả: $" + finalAmount);

            context.getStrategy().executePayment(finalAmount);

            System.out.println("[PROCESSING] Giao dịch thành công!");
            context.setState(new CompletedState());
        } catch (Exception e) {
            System.out.println("[PROCESSING] Lỗi trong quá trình thanh toán: " + e.getMessage());
            context.setState(new FailedState());
        }
    }

    @Override
    public void cancel(PaymentTransaction context) {
        System.out.println("[PROCESSING] Không thể hủy khi hệ thống đang gọi API ngân hàng!");
    }
}
