import type { AuthApi } from './types'
import { getEnvConfig } from '@/config/env.config'
import { createDirectusAuthApi } from './directus'
import { createMockAuthApi } from './mock'

let api: AuthApi | null = null

export function getAuthApi(): AuthApi {
  if (!api) {
    api = getEnvConfig().VITE_DATA_MODE === 'live'
      ? createDirectusAuthApi()
      : createMockAuthApi()
  }

  return api
}

export function resetAuthApi() {
  api = null
}
