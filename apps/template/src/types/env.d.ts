/// <reference types="vite/client" />

interface AppRuntimeWindowConfig {
  VITE_DATA_MODE?: string
  VITE_DIRECTUS_URL?: string
  VITE_FRONTEND_URL?: string
}

declare global {
  interface Window {
    __APP_CONFIG__?: AppRuntimeWindowConfig
  }

  interface ImportMetaEnv {
    readonly VITE_DATA_MODE?: string
    readonly VITE_DIRECTUS_URL?: string
    readonly VITE_FRONTEND_URL?: string
  }
}

export {}
