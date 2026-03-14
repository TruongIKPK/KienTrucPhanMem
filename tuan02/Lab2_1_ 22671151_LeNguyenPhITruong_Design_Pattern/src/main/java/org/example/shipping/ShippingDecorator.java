package org.example.shipping;

public abstract class ShippingDecorator implements IShippingStrategy{
    protected IShippingStrategy wrapper;

    public ShippingDecorator(IShippingStrategy wrapper) {
        this.wrapper = wrapper;
    }

    @Override
    public void ship() {
        wrapper.ship();
    }
}
