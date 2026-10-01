import type { LdDirectusClient } from '@ld/directus'
import type { DirectusSchema } from '@/schemas/directus-schema'
import { createDirectusClient } from '@ld/directus'
import { getEnvConfig } from '@/config/env.config'

let client: LdDirectusClient<DirectusSchema> | null = null

export function getDirectusClient() {
  if (!client) {
    client = createDirectusClient<DirectusSchema>({
      url: getEnvConfig().VITE_DIRECTUS_URL,
    })
  }

  return client
}
