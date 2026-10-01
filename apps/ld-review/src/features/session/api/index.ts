import type { SessionApi } from './types'
import { getEnvConfig } from '@/config/env.config'
import { createDirectusSessionApi } from './directus'
import { createMockSessionApi } from './mock'

let api: SessionApi | null = null

export function getSessionApi(): SessionApi {
  if (!api) {
    api = getEnvConfig().VITE_DATA_MODE === 'live'
      ? createDirectusSessionApi()
      : createMockSessionApi()
  }

  return api
}

export function resetSessionApi() {
  api = null
}
