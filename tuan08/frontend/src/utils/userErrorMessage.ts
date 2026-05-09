/**
 * Maps PU/axios error payloads to Vietnamese copy for UI.
 */
export function userErrorMessage(e: unknown): string {
  const data = (
    e as { response?: { data?: { error?: string; code?: string } } }
  )?.response?.data;
  const code = data?.code ?? "";
  const err = data?.error ?? "";
  if (code === "OUT_OF_STOCK" || err.startsWith("OUT_OF_STOCK"))
    return "Hết hàng.";
  if (code === "EMPTY_CART" || err === "EMPTY_CART") return "Giỏ hàng trống.";
  return data?.error ?? (e as Error).message;
}
