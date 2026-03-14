package tax;

public abstract class TaxDecorator implements ITaxCalculator{
    protected ITaxCalculator wrapper;

    public TaxDecorator(ITaxCalculator wrapper) {
        this.wrapper = wrapper;
    }

    @Override
    public double calculateTax(double basePrice) {
        return wrapper.calculateTax(basePrice);
    }
}
