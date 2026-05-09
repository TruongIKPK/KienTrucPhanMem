import { makeClient } from "./client";
import type { IStock } from "../types";

const client = makeClient(import.meta.env.VITE_PU4_URL);

export const stockApi = {
  get: (productId: string) =>
    client.get<IStock>(`/stock/${productId}`).then((r) => r.data),
};
