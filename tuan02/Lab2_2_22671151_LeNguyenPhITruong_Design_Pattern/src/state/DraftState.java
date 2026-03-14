package state;

import domain.Product;
import tax.ITaxCalculator;

public class DraftState implements ProductState{
    @Override
    public void setTaxCalculator(Product product, ITaxCalculator taxCalculator) {
        product.setTaxCalculatorInternal(taxCalculator);
        System.out.println("[DRAFT] Đã cập nhật chính sách thuế thành công.");
    }

    @Override
    public double getFinalPrice(Product product) {
        System.out.println("[DRAFT] Đang tính giá tạm tính (chưa mở bán)...");
        double tax = product.getTaxCalculator().calculateTax(product.getBasePrice());
        return product.getBasePrice() + tax;
    }

    @Override
    public void publish(Product product) {
        System.out.println("[DRAFT] Chuyển sản phẩm sang trạng thái ĐANG BÁN.");
        product.setState(new ActiveState());
    }

    @Override
    public void discontinue(Product product) {
        System.out.println("[DRAFT] Hủy bỏ sản phẩm nháp.");
        product.setState(new DiscontinuedState());
    }
}
