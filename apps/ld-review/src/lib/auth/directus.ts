import type { AuthApi, SessionUser } from './types'
import { readMe } from '@directus/sdk'
import { directusRequest, sessionAuthOptions } from '@ld/directus'
import { getDirectusClient } from '@/lib/directus/client'

interface MeRecord {
  id: string
  email: string | null
  first_name: string | null
}

function toSessionUser(record: MeRecord): SessionUser {
  return {
    id: record.id,
    email: record.email ?? '',
    firstName: record.first_name ?? '',
  }
}

export function createDirectusAuthApi(): AuthApi {
  const directus = getDirectusClient()

  return {
    refresh() {
      return directusRequest(directus.refresh(sessionAuthOptions)).then(() => undefined)
    },
    async readCurrentUser() {
      const record = await directusRequest(directus.request(readMe({
        fields: ['id', 'email', 'first_name'],
      })))

      return toSessionUser(record as MeRecord)
    },
    login(input) {
      return directusRequest(directus.login(input, sessionAuthOptions)).then(() => undefined)
    },
    logout() {
      return directusRequest(directus.logout(sessionAuthOptions)).then(() => undefined)
    },
  }
}
