import type { AuthApi, SessionUser } from './types'
import { DirectusError } from '@ld/directus'

export const demoCredentials = {
  email: 'demo@lewisdigital.co.uk',
  password: 'password',
} as const

const demoUser: SessionUser = {
  id: 'demo-user',
  email: demoCredentials.email,
  firstName: 'Demo',
}

export function createMockAuthApi(): AuthApi {
  let current: SessionUser | null = null

  return {
    async refresh() {
      if (!current)
        throw new DirectusError('No session', 401)
    },
    async readCurrentUser() {
      if (!current)
        throw new DirectusError('No session', 401)

      return current
    },
    async login(input) {
      if (input.email !== demoCredentials.email || input.password !== demoCredentials.password)
        throw new DirectusError('Invalid user credentials.', 401)

      current = demoUser
    },
    async logout() {
      current = null
    },
  }
}
