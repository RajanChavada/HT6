# SnapForge — Snap a Photo, Forge an App

Photograph a real-world artifact — a receipt, code, a whiteboard, an error — and
SnapForge classifies it, extracts structured data, plays a 3D "materialization"
transition, and renders a **functional app** tailored to what it saw.

Not a screenshot-to-clone tool. It reads a *real object* and builds a *working app*
around the content. Primary demo: **receipt → bill splitter → settle on Solana devnet**.

## Run it (zero keys needed)

```bash
npm install
npm run dev        # open the printed localhost URL
npm test           # unit tests
npm run build      # production build
```

Everything runs on **deterministic mocks** with no API keys. Live services layer on
top via env vars — see `.env.example` (copy to `.env.local`).

## The flow

```
Snap/upload → classify() → route(type) → Materialization (2.5s R3F) → template UI
```

- `src/core/classify.ts` — Gemini Vision classify + extract (mock: fixture by filename)
- `src/core/router.ts` — content type → template id (pure, table-driven)
- `src/core/registry.ts` — Mongo-shaped template registry (`src/fixtures/templates.json`)
- `src/core/settle.ts` — Solana devnet USDC transfer (mock: deterministic base58 sig)
- `src/core/analyze.ts` — Backboard code/error analysis (mock: canned)
- `src/templates/*` — BillSplitter, CodeReview, DebugAssistant, KanbanBoard, GenericView
- `src/three/Materialization.tsx` — 800-particle scatter→reassemble overlay with bloom

## Demo without keys

Name the file to route it: `receipt.jpg`, `code.png`, `error.png`, `whiteboard.png`.
Anything else → the Smart Data View fallback.

## 60-second demo script

1. Open the app, click **Snap or upload**, pick `receipt.jpg`.
2. Watch the 2.5s materialization (particles reassemble into the UI).
3. BillSplitter appears, pre-filled with items + tax + tip.
4. Tap items to reassign them between **You** / **Friend** (add more people).
5. Hit **Settle $X** → a Solana devnet explorer link appears (mock sig without a key).
6. Click **Scan another**, try `code.png` → instant code review; `error.png` → debug assistant.

## Arming the live paths

| Service | Env var | Note |
|---|---|---|
| Gemini Vision | `VITE_GEMINI_API_KEY` | Real classify + extract from the photo |
| Solana devnet | `VITE_SOLANA_SECRET_KEY` | Base58 funded keypair. **Also** `npm i @solana/web3.js @solana/spl-token bs58` — blocked on some corp npm registries (a transitive `ws` tarball is 403). Install on an open network; the live path is already wired via a computed dynamic import so the build stays green without it. |
| Backboard | `VITE_BACKBOARD_API_KEY` | Real code/error analysis |

## Base44 port

`export/base44/*.ts` are Deno backend functions mirroring the core, ready to paste into
Base44 (`classify-image`, `settle-payment`, `analyze-code`, `templates`). They read
server-side env vars (no `VITE_` prefix). The React templates port to Base44 pages;
the local engine is the source of truth.

## Tracks

Gemini (classify/extract) · Solana + Unifold (settle) · Backboard (analysis) ·
Base44 (export target) · MongoDB (registry shape). Auth0 / hosted Mongo / Unifold
deposit are intentionally out of scope for the demo.
