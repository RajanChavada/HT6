import { describe, it, expect } from 'vitest'
import { potVisual } from './potVisual'

describe('potVisual', () => {
  it('empty far-from-deadline pot is small, calm, green', () => {
    const v = potVisual(0, 100, 0)
    expect(v.scale).toBeCloseTo(1)
    expect(v.hue).toBeGreaterThan(100)
    expect(v.distortSpeed).toBeCloseTo(0, 1)
  })
  it('full pot near deadline is large, fast, warm', () => {
    const v = potVisual(100, 100, 1)
    expect(v.scale).toBeCloseTo(2)
    expect(v.hue).toBeLessThan(40)
    expect(v.bloom).toBeGreaterThan(0.8)
  })
  it('clamps overfill', () => {
    expect(potVisual(200, 100, 0.5).scale).toBeLessThanOrEqual(2)
  })
})
