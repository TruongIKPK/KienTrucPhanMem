import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const FloatingCartButton = () => {
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCount === 0) return null;

  return (
    <Link
      to="/cart"
      className="fixed bottom-6 right-6 w-14 h-14 bg-starbucks-accent text-white 
                 rounded-full shadow-frap flex items-center justify-center
                 transition-all duration-200 ease-out hover:bg-starbucks active:scale-95 z-50"
    >
      <div className="relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-starbucks-dark text-xs font-bold rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      </div>
    </Link>
  );
};

export default FloatingCartButton;
