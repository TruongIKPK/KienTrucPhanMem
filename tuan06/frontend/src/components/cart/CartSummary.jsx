import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPriceShort } from '../../utils/formatters';
import { Button } from '../common';

const CartSummary = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="card sticky top-24">
      <h2 className="text-lg font-bold text-starbucks mb-4">Tóm tắt đơn hàng</h2>
      
      <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between text-text-secondary">
          <span>Số món</span>
          <span>{itemCount} món</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Tạm tính</span>
          <span>{formatPriceShort(total)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Phí vận chuyển</span>
          <span className="text-starbucks font-medium">Miễn phí</span>
        </div>
      </div>

      <div className="flex justify-between text-lg font-bold text-starbucks mb-6">
        <span>Tổng cộng</span>
        <span className="text-starbucks-accent">{formatPriceShort(total)}</span>
      </div>

      {user ? (
        <Link to="/checkout">
          <Button className="w-full">
            Tiến hành thanh toán
          </Button>
        </Link>
      ) : (
        <div>
          <Link to="/login">
            <Button className="w-full mb-2">
              Đăng nhập để thanh toán
            </Button>
          </Link>
          <p className="text-center text-sm text-text-secondary">
            Hoặc{' '}
            <Link to="/register" className="text-starbucks-accent font-semibold hover:underline">
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>
      )}

      <button
        onClick={clearCart}
        className="w-full mt-4 text-error text-sm font-medium hover:underline"
      >
        Xóa toàn bộ giỏ hàng
      </button>
    </div>
  );
};

export default CartSummary;
