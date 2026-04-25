export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const formatPriceShort = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getOrderStatusText = (status) => {
  const statusMap = {
    PENDING: 'Chờ xử lý',
    CONFIRMED: 'Đã xác nhận',
    PREPARING: 'Đang chuẩn bị',
    READY: 'Sẵn sàng',
    PAID: 'Đã thanh toán',
    CANCELLED: 'Đã hủy',
  };
  return statusMap[status] || status;
};

export const getOrderStatusColor = (status) => {
  const colorMap = {
    PENDING: 'text-yellow-600 bg-yellow-100',
    CONFIRMED: 'text-blue-600 bg-blue-100',
    PREPARING: 'text-orange-600 bg-orange-100',
    READY: 'text-green-600 bg-green-100',
    PAID: 'text-starbucks bg-starbucks-light',
    CANCELLED: 'text-red-600 bg-red-100',
  };
  return colorMap[status] || 'text-gray-600 bg-gray-100';
};

export const getPaymentMethodText = (method) => {
  const methodMap = {
    COD: 'Thanh toán khi nhận hàng',
    BANKING: 'Chuyển khoản ngân hàng',
  };
  return methodMap[method] || method;
};
