package org.logistics.transport;

public class Airplane implements ITransport{
    @Override
    public void deliver(String destination) {
        System.out.println("Đang giao hàng bằng MÁY BAY đến: " + destination);
    }
}
