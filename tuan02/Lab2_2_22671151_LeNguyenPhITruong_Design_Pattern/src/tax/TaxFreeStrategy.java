package tax;

public class TaxFreeStrategy implements ITaxCalculator{
    @Override
    public double calculateTax(double basePrice) {
        System.out.println("Sản phẩm được miễn trừ mọi loại thuế.");
        return 0.0;
    }
}
