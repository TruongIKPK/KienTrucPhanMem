package state;

import domain.Product;
import tax.ITaxCalculator;

public class DiscontinuedState implements ProductState{
    @Override
    public void setTaxCalculator(Product product, ITaxCalculator taxCalculator) {
        System.out.println("[DISCONTINUED] Lỗi: Sản phẩm đã ngừng kinh doanh.");
    }

    @Override
    public double getFinalPrice(Product product) {
        System.out.println("[DISCONTINUED] Lỗi: Sản phẩm không còn bán, không thể tính giá.");
        return 0;
    }

    @Override
    public void publish(Product product) {
        System.out.println("[DISCONTINUED] Lỗi: Không thể mở bán lại sản phẩm đã ngừng kinh doanh.");
    }

    @Override
    public void discontinue(Product product) {
        System.out.println("[DISCONTINUED] Sản phẩm vốn đã ngừng kinh doanh.");
    }
}
