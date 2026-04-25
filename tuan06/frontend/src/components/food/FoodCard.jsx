import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPriceShort } from '../../utils/formatters';
import { Button } from '../common';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(food, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 1500);
  };

  const getCategoryBadge = (category) => {
    const badges = {
      MAIN: { text: 'Món chính', color: 'bg-starbucks-light text-starbucks' },
      DRINK: { text: 'Đồ uống', color: 'bg-blue-100 text-blue-700' },
      DESSERT: { text: 'Tráng miệng', color: 'bg-pink-100 text-pink-700' },
      SIDE: { text: 'Món phụ', color: 'bg-yellow-100 text-yellow-700' },
    };
    return badges[category] || { text: category, color: 'bg-gray-100 text-gray-700' };
  };

  const badge = getCategoryBadge(food.category);

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 -mx-4 -mt-4 mb-4 overflow-hidden rounded-t-card">
        {food.imageUrl ? (
          <img 
            src={food.imageUrl} 
            alt={food.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-starbucks-light to-warm-cream flex items-center justify-center">
            <span className="text-6xl">🍜</span>
          </div>
        )}
        <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
          {badge.text}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-starbucks mb-1">{food.name}</h3>
        <p className="text-text-secondary text-sm mb-3 line-clamp-2 flex-1">
          {food.description || 'Món ăn ngon tuyệt vời'}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-starbucks-accent">
            {formatPriceShort(food.price)}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-text-secondary">Số lượng:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-gray-100 rounded-l-lg transition-colors"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="w-10 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-gray-100 rounded-r-lg transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          variant={added ? 'outline' : 'primary'}
          className="w-full"
          disabled={added}
        >
          {added ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Đã thêm!
            </span>
          ) : (
            'Thêm vào giỏ'
          )}
        </Button>
      </div>
    </div>
  );
};

export default FoodCard;
