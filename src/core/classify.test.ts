import { describe, it, expect } from 'vitest'
import { classify } from './classify'

describe('classify (mock path, no key)', () => {
  it('classifies a receipt image by name', async () => {
    const r = await classify({ name: 'my-receipt.jpg' })
    expect(r.type).toBe('receipt')
    expect(r.confidence).toBeGreaterThan(0)
    expect((r.data as { total: number }).total).toBeGreaterThan(0)
  })

  it('classifies a code image by name', async () => {
    const r = await classify({ name: 'code-snippet.png' })
    expect(r.type).toBe('code')
  })

  it('falls back to other for unknown names', async () => {
    const r = await classify({ name: 'random-thing.png' })
    expect(r.type).toBe('other')
  })
})
