import { describe, it, expect } from 'vitest'
import { MarketSchema } from './types'

describe('MarketSchema', () => {
  it('parses a valid open market', () => {
    const m = MarketSchema.parse({
      id: 'm1', creatorId: 'u1', goal: 'Ship 5 PRs', creatorStake: 50,
      deadlineIso: '2026-07-20T00:00:00Z', causeId: 'c1', stakes: [], status: 'open',
    })
    expect(m.goal).toBe('Ship 5 PRs')
  })
  it('rejects negative stake amounts', () => {
    expect(() => MarketSchema.parse({
      id: 'm1', creatorId: 'u1', goal: 'x', creatorStake: -1,
      deadlineIso: '2026-07-20T00:00:00Z', causeId: 'c1', stakes: [], status: 'open',
    })).toThrow()
  })
})
