import type { MockSessionOptions, SessionApi } from './types'
import { sleep } from '@ld/utils/async/sleep'
import { battingPractice } from './fixture'

export function createMockSessionApi(options: MockSessionOptions = {}): SessionApi {
  const delayMs = options.delayMs ?? 0

  return {
    async read() {
      if (delayMs > 0)
        await sleep(delayMs)

      if (options.failWith)
        throw options.failWith

      if (options.empty) {
        return {
          ...battingPractice,
          moments: [],
        }
      }

      return structuredClone(battingPractice)
    },
  }
}
