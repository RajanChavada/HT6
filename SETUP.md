# SnapForge — What YOU need to paste in

**TL;DR:** copy `.env.example` → `.env.local`, paste one key (Gemini), done.
Everything runs on mocks with no keys — you only add a key to make one feature "real".

```bash
cp .env.example .env.local   # then edit .env.local
npm install
npm run dev
```

## The only 3 keys that exist, ranked by whether you should bother

| # | Key (paste in `.env.local`) | Bother? | Turns on | Skip it → |
|---|------------------------------|---------|----------|-----------|
| 1 | `VITE_GEMINI_API_KEY` | **Yes** — free, 2 min | Reads the REAL photo (the whole point) | Picks a fixture by filename |
| 2 | `VITE_BACKBOARD_API_KEY` | Optional | Real AI in CodeReview / DebugAssistant | Canned analysis text |
| 3 | `VITE_SOLANA_SECRET_KEY` | Skip unless chasing the Solana track | Real on-chain "Settle Up" (+ `npm i @solana/web3.js @solana/spl-token bs58`) | Realistic fake tx link |

### Get the Gemini key
https://aistudio.google.com → **Get API key** → paste into `.env.local`:
```
VITE_GEMINI_API_KEY=AIza...your_key...
```
Restart `npm run dev` after editing `.env.local`.

## What you do NOT paste anywhere
- **Base44** — a hosting platform, not an API. Nothing to paste for the local app.
  (`export/base44/*.ts` are paste-into-Base44 artifacts; their env vars go in the
  Base44 dashboard, not here.)
- **Auth0 / MongoDB / Unifold** — not used in the local demo.

## Demo without any keys
Name your uploaded file to route it: `receipt.jpg`, `code.png`, `error.png`,
`whiteboard.png`. Anything else → the Smart Data View fallback.

## Where each key is read (if you want to trace it)
- `src/core/classify.ts` — `VITE_GEMINI_API_KEY`
- `src/core/analyze.ts` — `VITE_BACKBOARD_API_KEY`
- `src/core/settle.ts` — `VITE_SOLANA_SECRET_KEY`

Each read site has a `SETUP REQUIRED` comment pointing back to `.env.example`.
