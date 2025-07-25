/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add more env vars here as needed
  // readonly VITE_SOME_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
