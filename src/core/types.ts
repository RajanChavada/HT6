import { z } from 'zod'

export type StakeSide = 'back' | 'fade'
export type MarketStatus = 'open' | 'settled_success' | 'settled_failure'

export const StakeSchema = z.object({
  userId: z.string(),
  side: z.enum(['back', 'fade']),
  amount: z.number().nonnegative(),
})
export const MarketSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  goal: z.string().min(1),
  creatorStake: z.number().nonnegative(),
  deadlineIso: z.string(),
  causeId: z.string(),
  stakes: z.array(StakeSchema),
  status: z.enum(['open', 'settled_success', 'settled_failure']),
})
export type Stake = z.infer<typeof StakeSchema>
export type Market = z.infer<typeof MarketSchema>
export interface Cause {
  id: string
  name: string
}
