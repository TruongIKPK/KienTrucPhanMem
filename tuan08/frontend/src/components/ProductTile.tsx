import { Link } from "react-router-dom";
import type { IProduct } from "../types";

interface ProductTileProps {
  product: IProduct;
  variant: "light" | "parchment" | "dark";
}

const tileClass: Record<ProductTileProps["variant"], string> = {
  light: "product-tile-light",
  parchment: "product-tile-parchment",
  dark: "product-tile-dark",
};

export default function ProductTile({ product, variant }: ProductTileProps) {
  return (
    <article
      className={`${tileClass[variant]} flex flex-col items-center text-center`}
    >
      <h2 className="text-display-lg font-display mb-3">{product.name}</h2>
      <p className="text-lead opacity-80 mb-6 max-w-xl">
        {product.description}
      </p>
      <p className="text-tagline font-display mb-8">
        {product.price.toLocaleString("vi-VN")} ₫
      </p>
      <div className="flex gap-3 mb-10">
        <Link to={`/products/${product.id}`} className="btn-primary">
          Xem chi tiết
        </Link>
      </div>
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="product-shadow max-w-md w-full rounded-md"
        onError={(e) => {
          (e.target as HTMLImageElement).style.visibility = "hidden";
        }}
      />
    </article>
  );
}
