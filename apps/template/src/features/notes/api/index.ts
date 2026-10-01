import type { NotesApi } from './types'
import { getEnvConfig } from '@/config/env.config'
import { createDirectusNotesApi } from './directus'
import { createMockNotesApi } from './mock'

let api: NotesApi | null = null

export function getNotesApi(): NotesApi {
  if (!api) {
    api = getEnvConfig().VITE_DATA_MODE === 'live'
      ? createDirectusNotesApi()
      : createMockNotesApi()
  }

  return api
}

export function resetNotesApi() {
  api = null
}
