import { getUserId, makeClient } from "./client";
import type { ICart, IAddCartReq, IRemoveCartReq } from "../types";

const client = makeClient(import.meta.env.VITE_PU2_URL);

export const cartApi = {
  add: (productId: string, quantity = 1) =>
    client
      .post<ICart>("/cart/add", {
        userId: getUserId(),
        productId,
        quantity,
      } satisfies IAddCartReq)
      .then((r) => r.data),
  remove: (productId: string, quantity = 1) =>
    client
      .post<ICart>("/cart/remove", {
        userId: getUserId(),
        productId,
        quantity,
      } satisfies IRemoveCartReq)
      .then((r) => r.data),
  get: () =>
    client
      .get<ICart>("/cart", { params: { userId: getUserId() } })
      .then((r) => r.data),
  clear: () =>
    client
      .delete<{ deleted: boolean }>(`/cart/${getUserId()}`)
      .then((r) => r.data),
};
