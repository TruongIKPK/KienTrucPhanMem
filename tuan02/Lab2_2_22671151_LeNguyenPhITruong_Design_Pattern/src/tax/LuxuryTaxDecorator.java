package tax;

public class LuxuryTaxDecorator extends TaxDecorator {
    public LuxuryTaxDecorator(ITaxCalculator wrapper) { super(wrapper); }

    @Override
    public double calculateTax(double basePrice) {
        double currentTax = super.calculateTax(basePrice);
        double luxuryTax = basePrice * 0.20;
        System.out.println("+ Thêm Thuế Xa xỉ (20%): " + luxuryTax);
        return currentTax + luxuryTax;
    }
}
