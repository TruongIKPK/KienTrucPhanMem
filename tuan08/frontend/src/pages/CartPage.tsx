import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi } from "../api/cartApi";
import { orderApi } from "../api/orderApi";
import { productApi } from "../api/productApi";
import type { ICart, IProduct } from "../types";
import { userErrorMessage } from "../utils/userErrorMessage";

const stepperBtn =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-canvas)] text-lg leading-none transition-opacity disabled:opacity-40 disabled:pointer-events-none";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<ICart | null>(null);
  const [products, setProducts] = useState<Record<string, IProduct>>({});
  const [error, setError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [busyPid, setBusyPid] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCart = async () => {
    try {
      const c = await cartApi.get();
      setCart(c);
      const ids = Object.keys(c.items ?? {});
      if (ids.length > 0) {
        const list = await productApi.listAll();
        const byId: Record<string, IProduct> = {};
        list.forEach((p) => (byId[p.id] = p));
        setProducts(byId);
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const changeQty = async (productId: string, delta: 1 | -1) => {
    setMutationError(null);
    setCheckoutError(null);
    setBusyPid(productId);
    try {
      const c =
        delta === 1
          ? await cartApi.add(productId, 1)
          : await cartApi.remove(productId, 1);
      setCart(c);
    } catch (e) {
      setMutationError(userErrorMessage(e));
    } finally {
      setBusyPid(null);
    }
  };

  const handleCheckout = async () => {
    setSubmitting(true);
    setCheckoutError(null);
    try {
      const order = await orderApi.checkout();
      navigate(`/order-success`, { state: order });
    } catch (e) {
      setCheckoutError(userErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (error)
    return (
      <section className="product-tile-light text-center">
        <h2 className="text-display-lg font-display mb-4">Lỗi</h2>
        <p className="text-body-apple opacity-70">{error}</p>
        <button
          className="btn-secondary-pill mt-6"
          onClick={() => navigate("/")}
        >
          Về trang chủ
        </button>
      </section>
    );

  if (!cart)
    return (
      <section className="product-tile-light text-center">
        <p className="text-lead opacity-60">Đang tải giỏ hàng...</p>
      </section>
    );

  const items = Object.entries(cart.items ?? {});
  const total = items.reduce((sum, [pid, qty]) => {
    const p = products[pid];
    return sum + (p?.price ?? 0) * Number(qty);
  }, 0);

  return (
    <main className="product-tile-light min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-hero-display font-display text-center mb-12">
          Giỏ hàng
        </h1>
        {mutationError ? (
          <p
            role="alert"
            className="text-caption text-center mb-6 rounded-[var(--radius-lg)] border border-[var(--color-hairline)] bg-[var(--color-canvas-parchment)] px-4 py-3 text-[var(--color-ink)]"
          >
            {mutationError}
          </p>
        ) : null}
        {checkoutError ? (
          <p
            role="alert"
            className="text-caption text-center mb-6 rounded-[var(--radius-lg)] border border-red-200 bg-red-50 px-4 py-3 text-red-800 font-display"
          >
            {checkoutError}
          </p>
        ) : null}
        {items.length === 0 ? (
          <p className="text-lead opacity-60 text-center">Giỏ hàng trống.</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map(([pid, qty]) => {
                const p = products[pid];
                const n = Number(qty);
                const busy = busyPid === pid;
                return (
                  <div
                    key={pid}
                    className="utility-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-body-apple font-display">
                        {p?.name ?? pid}
                      </p>
                      <p className="text-caption opacity-60 mt-1">
                        {(p?.price ?? 0).toLocaleString("vi-VN")} ₫ / sản phẩm
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className={stepperBtn}
                          aria-label="Giảm số lượng"
                          disabled={busy || submitting}
                          onClick={() => changeQty(pid, -1)}
                        >
                          −
                        </button>
                        <span className="min-w-[2.5rem] text-center text-body-apple font-display tabular-nums">
                          {n}
                        </span>
                        <button
                          type="button"
                          className={stepperBtn}
                          aria-label="Tăng số lượng"
                          disabled={busy || submitting}
                          onClick={() => changeQty(pid, 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-tagline font-display tabular-nums sm:min-w-[8rem] sm:text-right">
                        {((p?.price ?? 0) * n).toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-10">
              <span className="text-tagline">Tổng cộng</span>
              <span className="text-display-lg font-display tabular-nums">
                {total.toLocaleString("vi-VN")} ₫
              </span>
            </div>
            <div className="flex justify-center gap-3 mt-10">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={submitting || busyPid !== null}
                className="btn-primary"
              >
                {submitting ? "Đang đặt hàng..." : "Đặt hàng"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn-secondary-pill"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
