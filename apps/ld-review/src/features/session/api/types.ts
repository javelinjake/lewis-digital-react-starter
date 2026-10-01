import type { ReviewSession } from '@/types/session'

export interface SessionApi {
  read: () => Promise<ReviewSession>
}

export interface MockSessionOptions {
  delayMs?: number
  empty?: boolean
  failWith?: Error
}
