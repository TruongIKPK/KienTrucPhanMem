package org.example.shipping;

public class ExpressShipping implements IShippingStrategy{
    @Override
    public void ship() {
        System.out.println("Thực hiện giao hàng HỎA TỐC (trong 24h).");
    }
}
