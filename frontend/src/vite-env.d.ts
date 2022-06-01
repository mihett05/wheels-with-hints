/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_WS_URL: string;
  readonly VITE_MAPGL_API_KEY: string;
  readonly VITE_DIRECTIONS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
