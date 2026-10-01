import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { type UserConfig } from 'vite'

export interface CreateViteConfigOptions {
  root: string
  port?: number
}

export function createViteConfig(options: CreateViteConfigOptions): UserConfig {
  const { root, port = 5173 } = options

  return {
    root,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', `file://${root}/`)),
      },
    },
    server: {
      port,
      host: true,
    },
  }
}
