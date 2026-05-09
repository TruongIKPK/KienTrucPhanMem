import { getUserId, makeClient } from "./client";
import type { IOrder } from "../types";

const client = makeClient(import.meta.env.VITE_PU3_URL);

export const orderApi = {
  checkout: () =>
    client
      .post<IOrder>("/checkout", { userId: getUserId() })
      .then((r) => r.data),
  listMine: () =>
    client.get<IOrder[]>(`/orders/${getUserId()}`).then((r) => r.data),
};
