import { useState, useEffect } from 'react';
import { foodService } from '../services';
import { FoodForm, FoodTable } from '../components/admin';

const AdminPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await foodService.getAll();
      setFoods(response.data);
    } catch (error) {
      showMessage('Không thể tải danh sách món ăn', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAdd = () => {
    setEditingFood(null);
    setShowForm(true);
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setShowForm(true);
  };

  const handleDelete = (food) => {
    setDeleteConfirm(food);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await foodService.delete(deleteConfirm.id);
      setFoods(foods.filter((f) => f.id !== deleteConfirm.id));
      showMessage(`Đã xóa "${deleteConfirm.name}"`);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Không thể xóa món ăn';
      showMessage(errMsg, 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingFood) {
        const response = await foodService.update(editingFood.id, data);
        setFoods(foods.map((f) => (f.id === editingFood.id ? response.data : f)));
        showMessage(`Đã cập nhật "${data.name}"`);
      } else {
        const response = await foodService.create(data);
        setFoods([...foods, response.data]);
        showMessage(`Đã thêm "${data.name}"`);
      }
      setShowForm(false);
      setEditingFood(null);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Có lỗi xảy ra';
      showMessage(errMsg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFood(null);
  };

  return (
    <div className="min-h-screen bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Quản lý món ăn
            </h1>
            <p className="text-text-secondary mt-1">
              Thêm, sửa, xóa các món trong menu
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm món mới
          </button>
        </div>

        {/* Message Toast */}
        {message && (
          <div
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
              message.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4">
            <div className="text-2xl font-bold text-starbucks">{foods.length}</div>
            <div className="text-sm text-text-secondary">Tổng món</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-starbucks">
              {foods.filter((f) => f.category === 'MAIN').length}
            </div>
            <div className="text-sm text-text-secondary">Món chính</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-starbucks">
              {foods.filter((f) => f.category === 'DRINK').length}
            </div>
            <div className="text-sm text-text-secondary">Đồ uống</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-starbucks">
              {foods.filter((f) => f.category === 'DESSERT' || f.category === 'SIDE').length}
            </div>
            <div className="text-sm text-text-secondary">Khác</div>
          </div>
        </div>

        {/* Food Table */}
        <div className="card overflow-hidden">
          <FoodTable
            foods={foods}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Food Form Modal */}
        {showForm && (
          <FoodForm
            food={editingFood}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-card p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-text-secondary mb-4">
                Bạn có chắc muốn xóa món "{deleteConfirm.name}"?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-pill text-text-primary font-medium hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-pill font-medium hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
