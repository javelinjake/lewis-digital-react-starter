import type { SessionUser } from '@/lib/auth/types'
import { create } from 'zustand'
import { getAuthApi } from '@/lib/auth'

interface AuthState {
  status: 'bootstrapping' | 'authenticated' | 'anonymous'
  user: SessionUser | null
  bootstrap: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

let bootstrapPromise: Promise<void> | null = null

export const useAuthStore = create<AuthState>(set => ({
  status: 'bootstrapping',
  user: null,
  bootstrap: () => {
    if (!bootstrapPromise) {
      bootstrapPromise = (async () => {
        try {
          const auth = getAuthApi()
          await auth.refresh()
          const user = await auth.readCurrentUser()
          set({ status: 'authenticated', user })
        }
        catch {
          set({ status: 'anonymous', user: null })
        }
      })()
    }

    return bootstrapPromise
  },
  login: async (email, password) => {
    const auth = getAuthApi()
    await auth.login({ email, password })
    const user = await auth.readCurrentUser()
    bootstrapPromise = Promise.resolve()
    set({ status: 'authenticated', user })
  },
  logout: async () => {
    try {
      await getAuthApi().logout()
    }
    catch {
      // The local session still ends.
    }

    bootstrapPromise = Promise.resolve()
    set({ status: 'anonymous', user: null })
  },
}))
