import { FoodList } from '../components/food';
import { FloatingCartButton } from '../components/common';

const MenuPage = () => {
  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Hero Section */}
      <div className="bg-starbucks-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Menu</h1>
          <p className="text-white/70">
            Khám phá các món ăn ngon tuyệt vời của chúng tôi
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FoodList />
      </div>

      {/* Floating Cart Button */}
      <FloatingCartButton />
    </div>
  );
};

export default MenuPage;
