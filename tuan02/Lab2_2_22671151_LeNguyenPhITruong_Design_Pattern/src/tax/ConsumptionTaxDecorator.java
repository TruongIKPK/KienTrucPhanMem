package tax;

public class ConsumptionTaxDecorator extends TaxDecorator{
    public ConsumptionTaxDecorator(ITaxCalculator wrapper) {
        super(wrapper);
    }

    @Override
    public double calculateTax(double basePrice) {
        double currentTax = super.calculateTax(basePrice);
        double consumptionTax = basePrice * 0.05;
        System.out.println("+ Thêm Thuế Tiêu thụ (5%): " + consumptionTax);
        return currentTax + consumptionTax;
    }
}
