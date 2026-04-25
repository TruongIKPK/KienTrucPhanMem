import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OrderList } from '../components/order';
import { Loading } from '../components/common';

const OrdersPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Header */}
      <div className="bg-starbucks-dark text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">Đơn hàng của tôi</h1>
          <p className="text-white/70 mt-1">Theo dõi tình trạng đơn hàng</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderList />
      </div>
    </div>
  );
};

export default OrdersPage;
