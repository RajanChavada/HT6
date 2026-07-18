import { describe, it, expect } from 'vitest'
import { resolveFlags } from './config'

describe('resolveFlags', () => {
  it('all false with empty env', () => {
    expect(resolveFlags({})).toEqual({ unifold: false, solana: false, elevenlabs: false, gemini: false })
  })
  it('flips a flag when its key is present', () => {
    expect(resolveFlags({ VITE_GEMINI_API_KEY: 'x' }).gemini).toBe(true)
  })
  it('treats empty string as absent', () => {
    expect(resolveFlags({ VITE_GEMINI_API_KEY: '' }).gemini).toBe(false)
  })
})
