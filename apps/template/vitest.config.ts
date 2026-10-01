import { fileURLToPath } from 'node:url'
import { createVitestConfig } from '@ld/config-vitest'

const root = fileURLToPath(new URL('.', import.meta.url))

export default createVitestConfig({ root })
