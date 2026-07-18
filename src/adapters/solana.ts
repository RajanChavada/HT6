import type { IntegrationFlags } from '../core/config'
import type { Payout } from '../core/settle'

export interface TxReceipt {
  sig: string
  toUserId: string | null
  amount: number
  kind: string
  mocked: boolean
}

export function makeSolana(flags: IntegrationFlags) {
  return {
    async record(payouts: Payout[]): Promise<TxReceipt[]> {
      if (!flags.solana) {
        return payouts.map((p, i) => ({
          sig: `mocksig-${i}`,
          toUserId: p.toUserId,
          amount: p.amount,
          kind: p.kind,
          mocked: true,
        }))
      }
      // LIVE: Solana devnet settlement tx
      throw new Error('live Solana not wired in this build')
    },
  }
}
