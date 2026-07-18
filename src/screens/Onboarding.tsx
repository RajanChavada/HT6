import { useState } from 'react'
import { signIn, authEnabled, signUpWithEmail, signInWithEmail } from '../core/auth'

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Guest flow: no Supabase configured, name-only identity (per-tab).
  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    signIn(name.trim())
    onComplete()
  }

  // Real auth flow: email + password via Supabase.
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setBusy(true)
    setError(null)
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email.trim(), password, name.trim())
      } else {
        await signInWithEmail(email.trim(), password)
      }
      onComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'w-full rounded-md bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <h2 className="mb-2 text-2xl font-bold">Welcome to Stakes</h2>

        {!authEnabled ? (
          <>
            <p className="mb-6 text-sm text-slate-400">Enter a screen name to join the market.</p>
            <form onSubmit={handleGuestSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm text-slate-400">Screen Name</label>
                <input
                  type="text"
                  autoFocus
                  className={inputClass}
                  placeholder="e.g. Satoshi"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={20}
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim()}
                className="mt-2 w-full rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white disabled:opacity-50"
              >
                Enter App
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-400">
              {mode === 'signup' ? 'Create an account to start staking.' : 'Sign in to your account.'}
            </p>
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              {mode === 'signup' && (
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Screen Name</label>
                  <input
                    type="text"
                    autoFocus
                    className={inputClass}
                    placeholder="e.g. Satoshi"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={20}
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm text-slate-400">Email</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">Password</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={busy || !email.trim() || !password || (mode === 'signup' && !name.trim())}
                className="mt-2 w-full rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white disabled:opacity-50"
              >
                {busy ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <button
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup')
                setError(null)
              }}
              className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-200"
            >
              {mode === 'signup'
                ? 'Already have an account? Sign in'
                : "New here? Create an account"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
