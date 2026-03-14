package org.logistics.manager;

import org.logistics.factory.TransportFactory;
import org.logistics.transport.ITransport;

public class DispatchManager {
    // Biến lưu trữ instance duy nhất
    private static volatile DispatchManager instance;
    private int totalDeliveries = 0;

    // Private constructor
    private DispatchManager() {
    }

    // Hàm lấy instance (Double-Checked Locking)
    public static DispatchManager getInstance() {
        if (instance == null) {
            synchronized (DispatchManager.class) {
                if (instance == null) {
                    instance = new DispatchManager();
                }
            }
        }
        return instance;
    }

    public void scheduleDelivery(String transportType, String destination) {
        ITransport transport = TransportFactory.createTransport(transportType);
        transport.deliver(destination);

        totalDeliveries++;
        System.out.println("-> Tổng số đơn hàng đã điều phối: " + totalDeliveries + "\n");
    }
}
