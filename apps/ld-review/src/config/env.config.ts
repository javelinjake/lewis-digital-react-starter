export type DataMode = 'mock' | 'live'

export interface AppRuntimeConfig {
  VITE_DATA_MODE: DataMode
  VITE_DIRECTUS_URL: string
  VITE_FRONTEND_URL: string
}

function pickValue(runtimeValue: string | undefined, buildValue: string | undefined): string {
  const runtime = runtimeValue?.trim()
  if (runtime)
    return runtime

  return buildValue?.trim() ?? ''
}

export function resolveDataMode(raw: string | undefined, prod: boolean): DataMode {
  const value = raw?.trim() ?? ''

  if (prod) {
    if (value !== 'live')
      throw new Error('Production requires VITE_DATA_MODE=live.')

    return 'live'
  }

  if (!value)
    return 'mock'

  if (value === 'mock' || value === 'live')
    return value

  throw new Error(`Unknown VITE_DATA_MODE "${value}". Use "mock" or "live".`)
}

function readRuntimeConfig(): AppRuntimeConfig {
  const runtime = import.meta.env.DEV ? {} : (window.__APP_CONFIG__ ?? {})

  return {
    VITE_DATA_MODE: resolveDataMode(
      pickValue(runtime.VITE_DATA_MODE, import.meta.env.VITE_DATA_MODE),
      import.meta.env.PROD,
    ),
    VITE_DIRECTUS_URL: pickValue(runtime.VITE_DIRECTUS_URL, import.meta.env.VITE_DIRECTUS_URL),
    VITE_FRONTEND_URL: pickValue(runtime.VITE_FRONTEND_URL, import.meta.env.VITE_FRONTEND_URL),
  }
}

export function validateEnv(): AppRuntimeConfig {
  const config = readRuntimeConfig()
  const missing: string[] = []

  if (config.VITE_DATA_MODE === 'live') {
    if (!config.VITE_DIRECTUS_URL)
      missing.push('VITE_DIRECTUS_URL')
    if (!config.VITE_FRONTEND_URL)
      missing.push('VITE_FRONTEND_URL')
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. `
      + 'Copy .env.example to .env.local and set values before starting live mode.',
    )
  }

  return config
}

let cachedConfig: AppRuntimeConfig | null = null

export function getEnvConfig(): AppRuntimeConfig {
  if (!cachedConfig)
    cachedConfig = validateEnv()

  return cachedConfig
}

export function resetEnvConfig() {
  cachedConfig = null
}

export function isMockMode() {
  return getEnvConfig().VITE_DATA_MODE === 'mock'
}
