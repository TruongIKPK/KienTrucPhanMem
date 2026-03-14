import domain.Product;
import tax.*;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {
        System.out.println("=== KHỞI TẠO SẢN PHẨM: ĐỒNG HỒ ROLEX ===");
        Product rolex = new Product("Đồng hồ Rolex", 10000.0);

        // 1. Dùng Strategy cơ bản + Decorator để bọc các loại thuế
        System.out.println("\n--- Cấu hình thuế (Đang ở trạng thái DRAFT) ---");
        ITaxCalculator rolexTax = new BasicTaxStrategy();
        rolexTax = new ConsumptionTaxDecorator(rolexTax); // Thêm thuế tiêu thụ
        rolexTax = new VatTaxDecorator(rolexTax);         // Thêm VAT
        rolexTax = new LuxuryTaxDecorator(rolexTax);      // Thêm Thuế xa xỉ

        rolex.setTaxCalculator(rolexTax);

        // 2. Chuyển trạng thái để bán
        System.out.println("\n--- Duyệt sản phẩm ---");
        rolex.publish();

        // 3. Khách hàng xem giá (Đang ở Active State)
        System.out.println("\n--- Khách hàng xem giá ---");
        double finalPrice = rolex.getFinalPrice();
        System.out.println("Giá gốc: 10000.0");
        System.out.println("=> TỔNG GIÁ PHẢI THANH TOÁN: " + finalPrice);

        // 4. Thử thay đổi thuế khi đang bán (Sẽ bị State chặn lại)
        System.out.println("\n--- Thử gian lận/thay đổi thuế ---");
        rolex.setTaxCalculator(new TaxFreeStrategy());
    }
}