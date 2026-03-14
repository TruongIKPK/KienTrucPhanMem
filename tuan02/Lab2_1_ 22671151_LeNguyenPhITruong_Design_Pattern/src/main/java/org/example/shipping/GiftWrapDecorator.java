package org.example.shipping;

public class GiftWrapDecorator extends ShippingDecorator{

    public GiftWrapDecorator(IShippingStrategy wrapper) {
        super(wrapper);
    }

    @Override
    public void ship() {
        System.out.println("Đang xử lý: Đóng gói hộp quà cao cấp và thiệp chúc mừng.");
        super.ship();
    }

}
