import { formatPriceShort, formatDate, getOrderStatusText, getOrderStatusColor, getPaymentMethodText } from '../../utils/formatters';

const OrderCard = ({ order }) => {
  const statusClasses = getOrderStatusColor(order.status);

  return (
    <div className="card mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div>
          <p className="text-sm text-text-secondary">Mã đơn hàng</p>
          <p className="font-bold text-starbucks">#{order.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-pill text-sm font-semibold ${statusClasses}`}>
          {getOrderStatusText(order.status)}
        </span>
      </div>

      {/* Items */}
      <div className="mb-4">
        {order.items && order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">{item.foodName || `Món #${item.foodId}`}</span>
              <span className="text-text-secondary text-sm">x{item.quantity}</span>
            </div>
            <span className="text-sm font-medium">
              {formatPriceShort(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary text-sm">Thanh toán</span>
          <span className="text-sm">{getPaymentMethodText(order.paymentMethod || 'COD')}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary text-sm">Ngày đặt</span>
          <span className="text-sm">{formatDate(order.createdAt || new Date())}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-starbucks">Tổng tiền</span>
          <span className="font-bold text-starbucks-accent text-lg">
            {formatPriceShort(order.totalPrice || order.total || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
