import { useState, useEffect } from 'react';
import { foodService } from '../../services';
import { Loading } from '../common';
import FoodCard from './FoodCard';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await foodService.getAll();
        setFoods(response.data);
      } catch (err) {
        setError('Không thể tải danh sách món. Vui lòng thử lại sau.');
        console.error('Error fetching foods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const categories = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'MAIN', label: 'Món chính' },
    { value: 'DRINK', label: 'Đồ uống' },
    { value: 'DESSERT', label: 'Tráng miệng' },
    { value: 'SIDE', label: 'Món phụ' },
  ];

  const filteredFoods = selectedCategory === 'ALL'
    ? foods
    : foods.filter(food => food.category === selectedCategory);

  if (loading) {
    return <Loading message="Đang tải menu..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <p className="text-error font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-starbucks-accent font-semibold hover:underline"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-pill font-medium transition-all duration-200 ${
              selectedCategory === category.value
                ? 'bg-starbucks-accent text-white'
                : 'bg-white text-text-primary border border-gray-300 hover:border-starbucks-accent'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      {filteredFoods.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🍽️</span>
          <p className="text-text-secondary">Không có món ăn nào trong danh mục này</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map(food => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodList;
