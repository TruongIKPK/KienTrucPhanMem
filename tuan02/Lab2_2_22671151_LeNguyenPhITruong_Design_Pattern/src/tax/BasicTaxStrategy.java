package tax;

public class BasicTaxStrategy implements ITaxCalculator{
    @Override
    public double calculateTax(double basePrice) {
        return 0.0;
    }
}
