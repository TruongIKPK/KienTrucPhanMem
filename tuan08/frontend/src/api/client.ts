import axios, { AxiosInstance } from "axios";

const LS_USER_ID_KEY = "flashsale_user_id";

function createGuestUserId(): string {
  const c =
    typeof globalThis !== "undefined"
      ? (globalThis.crypto as Crypto | undefined)
      : undefined;
  if (c?.randomUUID) return c.randomUUID();
  if (c?.getRandomValues) {
    const b = new Uint8Array(16);
    c.getRandomValues(b);
    b[6] = (b[6]! & 0x0f) | 0x40;
    b[8] = (b[8]! & 0x3f) | 0x80;
    const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }
  return (
    "g-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 12)
  );
}

/**
 * userId gửi lên PU2/PU3.
 * - Nếu set `VITE_USER_ID` (không rỗng): luôn dùng giá trị đó (demo một user / curl parity).
 * - Ngược lại: lần đầu trên trình duyệt tạo id (UUID nếu trình duyệt hỗ trợ, không thì fallback), lưu `localStorage`.
 */
export function getUserId(): string {
  const forced = (import.meta.env.VITE_USER_ID ?? "").trim();
  if (forced) return forced;
  if (typeof window === "undefined") return "u1";
  let id = localStorage.getItem(LS_USER_ID_KEY)?.trim();
  if (!id) {
    id = createGuestUserId();
    localStorage.setItem(LS_USER_ID_KEY, id);
  }
  return id;
}

export function makeClient(baseURL: string): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
  });
}
