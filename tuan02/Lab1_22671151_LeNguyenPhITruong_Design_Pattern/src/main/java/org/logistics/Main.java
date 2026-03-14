package org.logistics;

import org.logistics.manager.DispatchManager;

public class Main {
    public static void main(String[] args) {
        System.out.println("--- BẮT ĐẦU ĐIỀU PHỐI ---\n");

        // Lấy instance duy nhất của DispatchManager
        DispatchManager manager1 = DispatchManager.getInstance();

        // Lên lịch giao hàng
        manager1.scheduleDelivery("TRUCK", "Hà Nội");
        manager1.scheduleDelivery("SHIP", "Hải Phòng");
        manager1.scheduleDelivery("AIRPLANE", "Đà Nẵng");

        System.out.println("--- KIỂM TRA TÍNH SINGLETON ---");

        // Thử lấy lại instance một lần nữa
        DispatchManager manager2 = DispatchManager.getInstance();
        manager2.scheduleDelivery("TRUCK", "Hồ Chí Minh");

        // Kiểm tra xem hai biến có cùng trỏ về một vùng nhớ không
        System.out.println("manager1 và manager2 có trỏ về cùng 1 object không? : " + (manager1 == manager2));
    }
}