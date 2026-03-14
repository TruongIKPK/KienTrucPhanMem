package state;

import domain.Product;
import tax.ITaxCalculator;

public class ActiveState implements ProductState{
    @Override
    public void setTaxCalculator(Product product, ITaxCalculator taxCalculator) {
        System.out.println("[ACTIVE] Lỗi: Không thể thay đổi thuế khi sản phẩm đang được bán!");
    }

    @Override
    public double getFinalPrice(Product product) {
        double tax = product.getTaxCalculator().calculateTax(product.getBasePrice());
        return product.getBasePrice() + tax;
    }

    @Override
    public void publish(Product product) {
        System.out.println("[ACTIVE] Sản phẩm vốn đã đang bán.");
    }

    @Override
    public void discontinue(Product product) {
        System.out.println("[ACTIVE] Ngừng kinh doanh sản phẩm này.");
        product.setState(new DiscontinuedState());
    }
}
