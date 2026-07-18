const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

// deterministic base58 string, length 88 — no Math.random so it's stable in tests + demo
function fakeSig(seed: string): string {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  let out = ''
  for (let i = 0; i < 88; i++) {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    out += B58[h % 58]
  }
  return out
}

export type SettleResult = { signature: string; explorerUrl: string; mocked: boolean }

export async function settle(args: {
  to: string
  amountUsdc: number
}): Promise<SettleResult> {
  // SETUP REQUIRED (optional): paste VITE_SOLANA_SECRET_KEY in .env.local AND
  // `npm i @solana/web3.js @solana/spl-token bs58` for a REAL on-chain settle.
  // Without it, we return a realistic fake signature. See .env.example [3].
  const key = import.meta.env?.VITE_SOLANA_SECRET_KEY
  if (!key) {
    const signature = fakeSig(`${args.to}:${args.amountUsdc}`)
    return {
      signature,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      mocked: true,
    }
  }
  return await settleLive(args, key)
}

// ponytail: live devnet USDC transfer. @vite-ignore keeps build green when @solana/* isn't
// installed (corp registry blocks a transitive `ws` tarball). Install on an open network to arm it.
async function settleLive(
  args: { to: string; amountUsdc: number },
  secret: string,
): Promise<SettleResult> {
  try {
    // computed specifiers so Vite's static import-analysis leaves these as runtime imports
    // (the @solana/* packages aren't installed here — corp registry blocks a transitive `ws` tarball)
    const web3 = await import(/* @vite-ignore */ ['@solana', 'web3.js'].join('/'))
    const splToken = await import(/* @vite-ignore */ ['@solana', 'spl-token'].join('/'))
    const bs58 = (await import(/* @vite-ignore */ ['bs', '58'].join(''))).default
    const conn = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed')
    const payer = web3.Keypair.fromSecretKey(bs58.decode(secret))
    const USDC_DEVNET = new web3.PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')
    const dest = new web3.PublicKey(args.to)
    const fromAta = await splToken.getOrCreateAssociatedTokenAccount(
      conn, payer, USDC_DEVNET, payer.publicKey,
    )
    const toAta = await splToken.getOrCreateAssociatedTokenAccount(
      conn, payer, USDC_DEVNET, dest,
    )
    const sig = await splToken.transfer(
      conn, payer, fromAta.address, toAta.address, payer.publicKey,
      Math.round(args.amountUsdc * 1e6),
    )
    return {
      signature: sig,
      explorerUrl: `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
      mocked: false,
    }
  } catch {
    const signature = fakeSig(`${args.to}:${args.amountUsdc}`)
    return {
      signature,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      mocked: true,
    }
  }
}
