// Base44 backend function (Deno). Porting artifact — mirrors src/core/settle.ts.
// Paste into a Base44 backend function named `settle-payment`.
// POST { to: string, amountUsdc: number } -> { signature, explorerUrl, mocked }
// Real devnet USDC SPL transfer; requires SOLANA_SECRET_KEY (base58 funded devnet keypair).

import { Connection, Keypair, PublicKey, clusterApiUrl } from 'npm:@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, transfer } from 'npm:@solana/spl-token'
import bs58 from 'npm:bs58'

const USDC_DEVNET = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')

export async function handler(req: Request): Promise<Response> {
  const secret = Deno.env.get('SOLANA_SECRET_KEY')
  const { to, amountUsdc } = await req.json()
  if (!secret) return Response.json({ error: 'SOLANA_SECRET_KEY not set' }, { status: 400 })

  const conn = new Connection(clusterApiUrl('devnet'), 'confirmed')
  const payer = Keypair.fromSecretKey(bs58.decode(secret))
  const dest = new PublicKey(to)
  const fromAta = await getOrCreateAssociatedTokenAccount(conn, payer, USDC_DEVNET, payer.publicKey)
  const toAta = await getOrCreateAssociatedTokenAccount(conn, payer, USDC_DEVNET, dest)
  const signature = await transfer(
    conn, payer, fromAta.address, toAta.address, payer.publicKey, Math.round(amountUsdc * 1e6),
  )
  return Response.json({
    signature,
    explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    mocked: false,
  })
}
