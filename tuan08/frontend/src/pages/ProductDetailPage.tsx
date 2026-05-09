import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productApi } from "../api/productApi";
import { cartApi } from "../api/cartApi";
import { usePollStock } from "../hooks/usePollStock";
import type { IProduct } from "../types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stock = usePollStock(id);

  useEffect(() => {
    if (!id) return;
    productApi
      .getById(id)
      .then(setProduct)
      .catch((e) => setError(e?.message ?? "Lỗi tải sản phẩm"));
  }, [id]);

  const handleAdd = async () => {
    if (!id) return;
    setAdding(true);
    try {
      await cartApi.add(id, 1);
      navigate("/cart");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setAdding(false);
    }
  };

  if (error)
    return (
      <section className="product-tile-light text-center">
        <p className="text-lead opacity-60">{error}</p>
      </section>
    );
  if (!product)
    return (
      <section className="product-tile-light text-center">
        <p className="text-lead opacity-60">Đang tải...</p>
      </section>
    );

  const outOfStock = stock !== null && stock <= 0;

  return (
    <main className="product-tile-parchment min-h-screen">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-hero-display font-display mb-4">{product.name}</h1>
        <p className="text-lead opacity-70 mb-8">{product.description}</p>
        <p className="text-display-lg font-display mb-2">
          {product.price.toLocaleString("vi-VN")} ₫
        </p>
        <p
          className={`text-tagline mb-10 ${outOfStock ? "text-red-600" : ""}`}
        >
          Tồn kho:{" "}
          <span className="font-display">
            {stock === null ? "..." : stock}
          </span>
        </p>
        <img
          src={product.image}
          alt={product.name}
          className="product-shadow w-full max-w-lg mx-auto rounded-md mb-10"
          onError={(e) => {
            (e.target as HTMLImageElement).style.visibility = "hidden";
          }}
        />
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding || outOfStock}
            className="btn-primary"
          >
            {outOfStock
              ? "Hết hàng"
              : adding
              ? "Đang thêm..."
              : "Thêm vào giỏ hàng"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-secondary-pill"
          >
            Quay lại
          </button>
        </div>
      </div>
    </main>
  );
}
