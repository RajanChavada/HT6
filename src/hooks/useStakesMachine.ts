import { useMemo, useState } from 'react'
import { seedDemoMarket, addStake } from '../core/store'
import { computePools, settle } from '../core/settle'
import { describeReceipt } from '../core/receipts'
import { flags } from '../core/config'
import { makeUnifold } from '../adapters/unifold'
import { makeSolana } from '../adapters/solana'
import { makeVerifier } from '../adapters/verify'
import type { Market, StakeSide } from '../core/types'

export type Phase = 'open' | 'settling' | 'done'

export function useStakesMachine() {
  const [market, setMarket] = useState<Market>(() => seedDemoMarket())
  const [phase, setPhase] = useState<Phase>('open')
  const [success, setSuccess] = useState<boolean | null>(null)
  const [receipts, setReceipts] = useState<string[]>([])

  const unifold = useMemo(() => makeUnifold(flags), [])
  const solana = useMemo(() => makeSolana(flags), [])
  const verifier = useMemo(() => makeVerifier(flags), [])

  const pools = computePools(market)

  async function stake(userId: string, side: StakeSide, amount: number) {
    await unifold.deposit(userId, amount)
    setMarket(m => addStake(m, { userId, side, amount }))
  }

  async function runSettlement(evidence: string) {
    setPhase('settling')
    const verdict = await verifier.verify(market, evidence)
    const payouts = settle(market, verdict.success)
    const txs = await solana.record(payouts)
    setSuccess(verdict.success)
    setReceipts(txs.map(describeReceipt))
    setMarket(m => ({ ...m, status: verdict.success ? 'settled_success' : 'settled_failure' }))
    setPhase('done')
  }

  return {
    market,
    pools,
    phase,
    success,
    receipts,
    back: (userId: string, amount: number) => stake(userId, 'back', amount),
    fade: (userId: string, amount: number) => stake(userId, 'fade', amount),
    runSettlement,
  }
}
