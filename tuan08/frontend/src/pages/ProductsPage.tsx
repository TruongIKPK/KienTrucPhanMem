import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productApi } from "../api/productApi";
import type { IProduct } from "../types";

function ProductsShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="product-tile-light min-h-screen">
      <div className="max-w-3xl mx-auto">{children}</div>
    </main>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi
      .listAll()
      .then(setProducts)
      .catch((e) => setError(e?.message ?? "Lỗi tải sản phẩm"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ProductsShell>
        <p className="text-lead opacity-60 text-center py-24">
          Đang tải sản phẩm...
        </p>
      </ProductsShell>
    );
  }

  if (error) {
    return (
      <ProductsShell>
        <div className="text-center py-16">
          <h2 className="text-display-lg font-display mb-4">
            Không kết nối được PU1 (Product Service)
          </h2>
          <p className="text-body-apple opacity-60">{error}</p>
          <p className="text-caption opacity-50 mt-4">
            Yêu cầu: Huy đã chạy PU1 ở {import.meta.env.VITE_PU1_URL}, Sang đã
            chạy Redis.
          </p>
        </div>
      </ProductsShell>
    );
  }

  if (products.length === 0) {
    return (
      <ProductsShell>
        <div className="text-center py-16">
          <h2 className="text-display-lg font-display">Chưa có sản phẩm</h2>
          <p className="text-body-apple opacity-60 mt-4">
            Hãy seed data Redis: chạy{" "}
            <code>curl -X POST {import.meta.env.VITE_PU1_URL}/admin/seed</code>
          </p>
        </div>
      </ProductsShell>
    );
  }

  return (
    <ProductsShell>
      <h1 className="text-hero-display font-display text-center mb-3">
        Flash Sale
      </h1>
      <p className="text-lead opacity-60 text-center mb-12">
        Đặt hàng ngay. Tồn kho cập nhật real-time.
      </p>

      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="utility-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left"
          >
            <div className="flex gap-4 min-w-0 flex-1 items-center">
              <img
                src={p.image}
                alt=""
                loading="lazy"
                className="product-shadow w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-[var(--radius-md)] object-cover bg-[var(--color-canvas-parchment)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.visibility = "hidden";
                }}
              />
              <div className="min-w-0">
                <p className="text-body-apple font-display">{p.name}</p>
                <p className="text-caption opacity-60 mt-1 line-clamp-2">
                  {p.description}
                </p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 sm:pl-2 border-t sm:border-t-0 border-[var(--color-hairline)] pt-4 sm:pt-0">
              <p className="text-tagline font-display tabular-nums">
                {p.price.toLocaleString("vi-VN")} ₫
              </p>
              <Link
                to={`/products/${p.id}`}
                className="btn-primary text-center whitespace-nowrap"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-[var(--color-hairline)]">
        <p className="text-caption opacity-60 text-center sm:text-left">
          {products.length} sản phẩm đang mở bán
        </p>
        <Link to="/cart" className="btn-secondary-pill">
          Xem giỏ hàng
        </Link>
      </div>
    </ProductsShell>
  );
}
