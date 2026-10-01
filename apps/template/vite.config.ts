import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createViteConfig } from '@ld/config-vite'
import { defineConfig } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ command }) => {
  if (command === 'build' && process.env.VITE_DATA_MODE !== 'live')
    throw new Error('Production builds require VITE_DATA_MODE=live.')

  return createViteConfig({ root })
})
