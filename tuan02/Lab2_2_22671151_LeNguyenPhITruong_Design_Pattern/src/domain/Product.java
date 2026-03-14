package domain;

import state.DraftState;
import state.ProductState;
import tax.BasicTaxStrategy;
import tax.ITaxCalculator;

public class Product {
    private final String name;
    private final double basePrice;
    private ITaxCalculator taxCalculator;
    private ProductState state;

    public Product(String name, double basePrice) {
        this.name = name;
        this.basePrice = basePrice;
        this.taxCalculator = new BasicTaxStrategy();
        this.state = new DraftState();
    }

    // Các hàm delegate cho State
    public void setTaxCalculator(ITaxCalculator taxCalculator) {
        state.setTaxCalculator(this, taxCalculator);
    }

    public double getFinalPrice() {
        return state.getFinalPrice(this);
    }

    public void publish() {
        state.publish(this);
    }

    public void discontinue() {
        state.discontinue(this);
    }

    // Dùng nội bộ cho State gọi cập nhật data
    public void setState(ProductState state) { this.state = state; }
    public void setTaxCalculatorInternal(ITaxCalculator tax) { this.taxCalculator = tax; }
    public double getBasePrice() { return basePrice; }
    public ITaxCalculator getTaxCalculator() { return taxCalculator; }
    public String getName() { return name; }
}
