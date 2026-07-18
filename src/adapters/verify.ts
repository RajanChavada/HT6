import type { IntegrationFlags } from '../core/config'
import type { Market } from '../core/types'

export interface Verdict { success: boolean; reason: string; mocked: boolean }

export function makeVerifier(flags: IntegrationFlags) {
  return {
    async verify(_market: Market, evidence: string): Promise<Verdict> {
      if (!flags.gemini) {
        const success = /\b5\b|\bfive\b/i.test(evidence) && /pr/i.test(evidence)
        return { success, reason: success ? 'Goal met per evidence' : 'Goal not met', mocked: true }
      }
      // LIVE: Gemini verification
      throw new Error('live Gemini not wired in this build')
    },
  }
}
