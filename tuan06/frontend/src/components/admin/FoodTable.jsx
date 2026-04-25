import { formatPrice } from '../../utils/formatters';

const CATEGORY_LABELS = {
  MAIN: 'Món chính',
  DRINK: 'Đồ uống',
  DESSERT: 'Tráng miệng',
  SIDE: 'Món phụ',
};

const FoodTable = ({ foods, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-starbucks"></div>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p>Chưa có món ăn nào. Hãy thêm món mới!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
              ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
              Hình ảnh
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
              Tên món
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
              Danh mục
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
              Giá
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {foods.map((food) => (
            <tr key={food.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-text-secondary">
                #{food.id}
              </td>
              <td className="px-4 py-3">
                {food.imageUrl ? (
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">N/A</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-text-primary">{food.name}</div>
                {food.description && (
                  <div className="text-sm text-text-secondary truncate max-w-xs">
                    {food.description}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-starbucks-accent/10 text-starbucks">
                  {CATEGORY_LABELS[food.category] || food.category}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-starbucks">
                {formatPrice(food.price)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(food)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Sửa"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(food)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodTable;
