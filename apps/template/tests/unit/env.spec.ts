import { describe, expect, it } from 'vitest'
import { resolveDataMode } from '@/config/env.config'

describe('resolveDataMode', () => {
  it('defaults development to mock', () => {
    expect(resolveDataMode(undefined, false)).toBe('mock')
    expect(resolveDataMode('', false)).toBe('mock')
  })

  it('accepts an explicit development mode', () => {
    expect(resolveDataMode('mock', false)).toBe('mock')
    expect(resolveDataMode('live', false)).toBe('live')
  })

  it('rejects an unknown mode', () => {
    expect(() => resolveDataMode('staging', false)).toThrow(/Unknown VITE_DATA_MODE/)
  })

  it('requires live in production', () => {
    expect(resolveDataMode('live', true)).toBe('live')
    expect(() => resolveDataMode(undefined, true)).toThrow(/VITE_DATA_MODE=live/)
    expect(() => resolveDataMode('mock', true)).toThrow(/VITE_DATA_MODE=live/)
  })
})
