import { useState } from 'react';
import { Button } from '../common';

const PaymentForm = ({ onSubmit, loading }) => {
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const methods = [
    {
      id: 'COD',
      name: 'Thanh toán khi nhận hàng',
      description: 'Thanh toán bằng tiền mặt khi nhận đơn',
      icon: '💵',
    },
    {
      id: 'BANKING',
      name: 'Chuyển khoản ngân hàng',
      description: 'Thanh toán qua Internet Banking',
      icon: '🏦',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(paymentMethod);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold text-starbucks mb-4">Phương thức thanh toán</h2>
      
      <div className="space-y-3 mb-6">
        {methods.map(method => (
          <label
            key={method.id}
            className={`card flex items-center gap-4 cursor-pointer transition-all ${
              paymentMethod === method.id
                ? 'ring-2 ring-starbucks-accent border-starbucks-accent'
                : 'hover:shadow-md'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-starbucks-accent focus:ring-starbucks-accent"
            />
            <span className="text-2xl">{method.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-starbucks">{method.name}</p>
              <p className="text-sm text-text-secondary">{method.description}</p>
            </div>
            {paymentMethod === method.id && (
              <svg className="w-6 h-6 text-starbucks-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
          </label>
        ))}
      </div>

      {paymentMethod === 'BANKING' && (
        <div className="card bg-starbucks-light mb-6">
          <h3 className="font-semibold text-starbucks mb-2">Thông tin chuyển khoản</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-text-secondary">Ngân hàng:</span> Vietcombank</p>
            <p><span className="text-text-secondary">Số tài khoản:</span> 1234567890</p>
            <p><span className="text-text-secondary">Chủ TK:</span> FOOD ORDERING COMPANY</p>
            <p><span className="text-text-secondary">Nội dung:</span> [Mã đơn hàng]</p>
          </div>
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Xác nhận đặt hàng
      </Button>
    </form>
  );
};

export default PaymentForm;
