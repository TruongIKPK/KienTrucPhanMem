import { useCart } from '../../context/CartContext';
import { formatPriceShort } from '../../utils/formatters';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { food, quantity } = item;

  return (
    <div className="card flex gap-4 mb-4">
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 rounded-card overflow-hidden">
        {food.imageUrl ? (
          <img 
            src={food.imageUrl} 
            alt={food.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-starbucks-light to-warm-cream flex items-center justify-center">
            <span className="text-3xl">🍜</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="min-w-0 pr-2">
            <h3 className="font-bold text-starbucks truncate">{food.name}</h3>
            <p className="text-sm text-text-secondary">{formatPriceShort(food.price)}</p>
          </div>
          <button
            onClick={() => removeFromCart(food.id)}
            className="text-text-secondary hover:text-error transition-colors p-1"
            title="Xóa khỏi giỏ"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => updateQuantity(food.id, quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-gray-100 rounded-l-lg transition-colors"
            >
              −
            </button>
            <span className="w-10 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => updateQuantity(food.id, quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-gray-100 rounded-r-lg transition-colors"
            >
              +
            </button>
          </div>
          <span className="font-bold text-starbucks-accent">
            {formatPriceShort(food.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
