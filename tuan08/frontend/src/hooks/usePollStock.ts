import { useEffect, useState } from "react";
import { stockApi } from "../api/stockApi";

export function usePollStock(productId: string | undefined, intervalMs = 2000) {
  const [stock, setStock] = useState<number | null>(null);

  useEffect(() => {
    if (!productId) return;
    let alive = true;

    const fetchStock = async () => {
      try {
        const r = await stockApi.get(productId);
        if (alive) setStock(r.stock);
      } catch {
        if (alive) setStock(null);
      }
    };

    fetchStock();
    const id = setInterval(fetchStock, intervalMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [productId, intervalMs]);

  return stock;
}
