import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem, CartSummary } from '../components/cart';
import { Button } from '../components/common';

const CartPage = () => {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-starbucks-light rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-starbucks" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-starbucks mb-2">Giỏ hàng trống</h2>
            <p className="text-text-secondary mb-6">
              Bạn chưa có món nào trong giỏ hàng
            </p>
            <Link to="/menu">
              <Button>Khám phá menu</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Header */}
      <div className="bg-starbucks-dark text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">Giỏ hàng</h1>
          <p className="text-white/70 mt-1">
            {items.length} sản phẩm
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-starbucks">Sản phẩm đã chọn</h2>
              <Link 
                to="/menu" 
                className="text-starbucks-accent font-medium hover:underline"
              >
                + Thêm món
              </Link>
            </div>
            {items.map(item => (
              <CartItem key={item.food.id} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
