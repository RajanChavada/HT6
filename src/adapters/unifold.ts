import type { IntegrationFlags } from '../core/config'

export interface DepositResult { ok: boolean; ref: string; mocked: boolean }

export function makeUnifold(flags: IntegrationFlags) {
  return {
    async deposit(userId: string, amount: number): Promise<DepositResult> {
      if (amount <= 0) throw new Error('amount must be positive')
      if (!flags.unifold) return { ok: true, ref: `mock:${userId}:${amount}`, mocked: true }
      // LIVE: Unifold sandbox deposit into escrow/pool vault
      throw new Error('live Unifold not wired in this build')
    },
  }
}
