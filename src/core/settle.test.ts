import { describe, it, expect } from 'vitest'
import { settle } from './settle'

const BASE58 = /^[1-9A-HJ-NP-Za-km-z]+$/

describe('settle (mock path)', () => {
  it('returns a base58 signature-shaped string', async () => {
    const r = await settle({ to: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PB5', amountUsdc: 25.5 })
    expect(r.mocked).toBe(true)
    expect(r.signature.length).toBeGreaterThanOrEqual(64)
    expect(BASE58.test(r.signature)).toBe(true)
    expect(r.explorerUrl).toContain(r.signature)
  })

  it('is deterministic per (to, amount)', async () => {
    const a = await settle({ to: 'abc', amountUsdc: 10 })
    const b = await settle({ to: 'abc', amountUsdc: 10 })
    expect(a.signature).toBe(b.signature)
  })

  it('differs for different amounts', async () => {
    const a = await settle({ to: 'abc', amountUsdc: 10 })
    const b = await settle({ to: 'abc', amountUsdc: 20 })
    expect(a.signature).not.toBe(b.signature)
  })
})
