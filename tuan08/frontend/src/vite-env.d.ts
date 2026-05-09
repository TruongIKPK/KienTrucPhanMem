/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PU1_URL: string;
  readonly VITE_PU2_URL: string;
  readonly VITE_PU3_URL: string;
  readonly VITE_PU4_URL: string;
  /** Khi set (không rỗng): bỏ qua localStorage, dùng userId cố định (demo một user). */
  readonly VITE_USER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
