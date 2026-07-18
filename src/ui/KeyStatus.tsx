// Demo-time banner: shows which live keys are wired vs running on mocks.
// Reads Vite env at build/serve time. See SETUP.md / .env.example.
const KEYS: { label: string; on: boolean }[] = [
  { label: 'Gemini', on: !!import.meta.env?.VITE_GEMINI_API_KEY },
  { label: 'Backboard', on: !!import.meta.env?.VITE_BACKBOARD_API_KEY },
  { label: 'Solana', on: !!import.meta.env?.VITE_SOLANA_SECRET_KEY },
]

export function KeyStatus() {
  const allMock = KEYS.every((k) => !k.on)
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
      {KEYS.map((k) => (
        <span
          key={k.label}
          className={`px-2 py-1 rounded-full border ${
            k.on
              ? 'border-success/40 text-success bg-success/10'
              : 'border-white/10 text-muted bg-white/5'
          }`}
        >
          {k.label}: {k.on ? 'live' : 'mock'}
        </span>
      ))}
      {allMock && (
        <span className="text-muted/70">
          — running on mocks. Add keys in <code>.env.local</code> (see SETUP.md).
        </span>
      )}
    </div>
  )
}
