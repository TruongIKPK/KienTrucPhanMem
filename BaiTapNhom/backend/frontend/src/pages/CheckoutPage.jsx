import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, paymentService } from '../services';
import { formatPriceShort } from '../utils/formatters';
import { PaymentForm } from '../components/order';
import { Button, Loading } from '../components/common';

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (items.length === 0 && !orderSuccess) {
    return <Navigate to="/cart" replace />;
  }

  const handlePayment = async (paymentMethod) => {
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          foodId: item.food.id,
          quantity: item.quantity,
          price: item.food.price,
          foodName: item.food.name,
        })),
        totalPrice: total,
        paymentMethod,
      };

      const orderResponse = await orderService.create(orderData);
      const orderId = orderResponse.data.id;

      await paymentService.processPayment({
        orderId,
        amount: total,
        method: paymentMethod,
      });

      setOrderSuccess({
        orderId,
        paymentMethod,
        total,
      });
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="card text-center">
            <div className="w-20 h-20 bg-starbucks-light rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-starbucks" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-starbucks mb-2">Đặt hàng thành công!</h1>
            <p className="text-text-secondary mb-6">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
            </p>

            <div className="bg-warm-cream rounded-card p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-text-secondary">Mã đơn hàng</span>
                <span className="font-bold text-starbucks">#{orderSuccess.orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-text-secondary">Phương thức thanh toán</span>
                <span>{orderSuccess.paymentMethod === 'COD' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Tổng tiền</span>
                <span className="font-bold text-starbucks-accent">{formatPriceShort(orderSuccess.total)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/orders" className="flex-1">
                <Button variant="outline" className="w-full">
                  Xem đơn hàng
                </Button>
              </Link>
              <Link to="/menu" className="flex-1">
                <Button className="w-full">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
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
          <h1 className="text-2xl md:text-3xl font-bold">Thanh toán</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            {error && (
              <div className="card bg-red-50 border border-error mb-6">
                <p className="text-error">{error}</p>
              </div>
            )}
            <PaymentForm onSubmit={handlePayment} loading={loading} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-lg font-bold text-starbucks mb-4">Chi tiết đơn hàng</h2>
              
              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={item.food.id} className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.food.name}</p>
                      <p className="text-sm text-text-secondary">
                        {formatPriceShort(item.food.price)} x {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium ml-4">
                      {formatPriceShort(item.food.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-text-secondary">
                  <span>Tạm tính</span>
                  <span>{formatPriceShort(total)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Phí vận chuyển</span>
                  <span className="text-starbucks font-medium">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-starbucks mt-4 pt-4 border-t border-gray-200">
                <span>Tổng cộng</span>
                <span className="text-starbucks-accent">{formatPriceShort(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
