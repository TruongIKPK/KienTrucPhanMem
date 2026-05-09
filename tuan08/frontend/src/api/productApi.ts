import { makeClient } from "./client";
import type { IProduct } from "../types";

const client = makeClient(import.meta.env.VITE_PU1_URL);

export const productApi = {
  listAll: () => client.get<IProduct[]>("/products").then((r) => r.data),
  getById: (id: string) =>
    client.get<IProduct>(`/products/${id}`).then((r) => r.data),
  seed: () => client.post<{ seeded: number }>("/admin/seed").then((r) => r.data),
};
