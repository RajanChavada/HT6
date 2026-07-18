import { describe, it, expect } from 'vitest'
import { analyze } from './analyze'

describe('analyze (mock path)', () => {
  it('returns canned analysis for code', async () => {
    const r = await analyze({ kind: 'code', content: 'function f(){return 1}' })
    expect(r.mocked).toBe(true)
    expect(r.text.length).toBeGreaterThan(0)
  })

  it('returns canned analysis for error', async () => {
    const r = await analyze({ kind: 'error', content: 'TypeError: x is undefined' })
    expect(r.mocked).toBe(true)
    expect(r.text.length).toBeGreaterThan(0)
  })
})
