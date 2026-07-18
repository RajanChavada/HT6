export interface IntegrationFlags {
  unifold: boolean
  solana: boolean
  elevenlabs: boolean
  gemini: boolean
}

const has = (v: string | undefined) => typeof v === 'string' && v.length > 0

export function resolveFlags(env: Record<string, string | undefined>): IntegrationFlags {
  return {
    unifold: has(env.VITE_UNIFOLD_API_KEY),
    solana: has(env.VITE_SOLANA_RPC),
    elevenlabs: has(env.VITE_ELEVENLABS_API_KEY),
    gemini: has(env.VITE_GEMINI_API_KEY),
  }
}

export const flags: IntegrationFlags = resolveFlags(
  import.meta.env as Record<string, string | undefined>,
)
