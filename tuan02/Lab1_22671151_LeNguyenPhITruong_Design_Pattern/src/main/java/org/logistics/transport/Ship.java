package org.logistics.transport;

public class Ship implements ITransport{
    @Override
    public void deliver(String destination) {
        System.out.println("Đang giao hàng bằng TÀU THỦY đến: " + destination);
    }
}
