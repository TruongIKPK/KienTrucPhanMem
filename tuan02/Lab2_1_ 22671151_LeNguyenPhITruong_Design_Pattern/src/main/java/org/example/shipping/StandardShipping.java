package org.example.shipping;

public class StandardShipping implements IShippingStrategy{
    @Override
    public void ship() {
        System.out.println("Thực hiện giao hàng TIÊU CHUẨN (3-5 ngày).");
    }
}
