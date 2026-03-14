package tax;

public class VatTaxDecorator extends TaxDecorator{
    public VatTaxDecorator(ITaxCalculator wrapper) { super(wrapper); }

    @Override
    public double calculateTax(double basePrice) {
        double currentTax = super.calculateTax(basePrice);
        double vatTax = basePrice * 0.10;
        System.out.println("+ Thêm Thuế VAT (10%): " + vatTax);
        return currentTax + vatTax;
    }
}
