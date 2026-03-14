package org.example;

import org.example.domain.Order;
import org.example.shipping.ExpressShipping;
import org.example.shipping.GiftWrapDecorator;
import org.example.shipping.IShippingStrategy;
import org.example.shipping.StandardShipping;

public class Main {
    public static void main(String[] args) {
        System.out.println("--- ĐƠN HÀNG 1: GIAO TIÊU CHUẨN THÔNG THƯỜNG ---");
        IShippingStrategy standard = new StandardShipping();
        Order order1 = new Order(standard);

        order1.processOrder(); // Chuyển từ New -> Processing
        order1.processOrder(); // Chuyển từ Processing -> Delivered
        order1.processOrder(); // Báo lỗi không thể xử lý thêm
        order1.cancelOrder();  // Báo lỗi không thể hủy

        System.out.println("\n--- ĐƠN HÀNG 2: GIAO HỎA TỐC + BỌC QUÀ ---");
        // Áp dụng Decorator bọc ngoài Strategy
        IShippingStrategy expressWithGift = new GiftWrapDecorator(new ExpressShipping());
        Order order2 = new Order(expressWithGift);

        order2.processOrder(); // New -> Processing
        order2.cancelOrder();  // Khách đổi ý hủy lúc đang xử lý (Processing -> Canceled)
        order2.processOrder(); // Thử xử lý đơn đã hủy -> Không thành công
    }
}