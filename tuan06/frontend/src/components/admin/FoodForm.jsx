import { useState, useEffect } from 'react';

const CATEGORIES = [
  { value: 'MAIN', label: 'Món chính' },
  { value: 'DRINK', label: 'Đồ uống' },
  { value: 'DESSERT', label: 'Tráng miệng' },
  { value: 'SIDE', label: 'Món phụ' },
];

const FoodForm = ({ food, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'MAIN',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || '',
        description: food.description || '',
        price: food.price?.toString() || '',
        imageUrl: food.imageUrl || '',
        category: food.category || 'MAIN',
      });
    }
  }, [food]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Tên món là bắt buộc';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-text-primary">
            {food ? 'Sửa món ăn' : 'Thêm món ăn mới'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Tên món *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="VD: Phở bò"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input w-full h-20 resize-none"
              placeholder="Mô tả ngắn về món ăn..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Giá (VNĐ) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`input w-full ${errors.price ? 'border-red-500' : ''}`}
              placeholder="VD: 45000"
              min="0"
              step="1000"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              URL Hình ảnh
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="input w-full"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Danh mục
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input w-full"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-pill text-text-primary font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : food ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodForm;
