package org.logistics.transport;

public class Truck implements ITransport{
    @Override
    public void deliver(String destination) {
        System.out.println("Đang giao hàng bằng XE TẢI đến: " + destination);
    }
}
