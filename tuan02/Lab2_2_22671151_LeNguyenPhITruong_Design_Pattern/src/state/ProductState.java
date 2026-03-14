package state;

import domain.Product;
import tax.ITaxCalculator;

public interface ProductState {
    void setTaxCalculator(Product product, ITaxCalculator taxCalculator);
    double getFinalPrice(Product product);
    void publish(Product product);
    void discontinue(Product product);
}
