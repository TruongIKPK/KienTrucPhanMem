import { useLocation, useNavigate } from "react-router-dom";
import type { IOrder } from "../types";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const order = useLocation().state as IOrder | null;

  return (
    <main className="product-tile-dark min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-hero-display font-display mb-6">Đặt hàng thành công</h1>
      {order ? (
        <>
          <p className="text-lead opacity-80 mb-2">
            Mã đơn: <span className="font-display">{order.orderId}</span>
          </p>
          <p className="text-display-lg font-display mb-10">
            Tổng: {order.total.toLocaleString("vi-VN")} ₫
          </p>
        </>
      ) : (
        <p className="text-lead opacity-70 mb-10">
          Đơn của bạn đã được ghi nhận.
        </p>
      )}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="btn-primary"
      >
        Về trang chủ
      </button>
    </main>
  );
}
