import { flags, getEnv } from './config'

// Supabase Auth adapter (email + password) over the GoTrue REST API.
//
// Fallback-first: with no VITE_SUPABASE_* keys, `authEnabled` is false and the
// app uses the guest name-only flow in auth.ts instead. No new npm dependency —
// this is plain fetch against the /auth/v1 endpoints.
//
// Dashboard requirement: Supabase → Authentication → Providers → Email →
// turn OFF "Confirm email" so signUp returns a session immediately (no email
// round-trip). With confirmation ON, signUp returns no access_token until the
// user clicks a link, and first login will fail.

export const authEnabled = flags.supabase

export interface AuthResult {
  accessToken: string
  userId: string
  email: string
}

function base(): string {
  return getEnv('VITE_SUPABASE_URL').replace(/\/$/, '')
}

function anonKey(): string {
  return getEnv('VITE_SUPABASE_ANON_KEY')
}

interface GoTrueSession {
  access_token?: string
  user?: { id: string; email?: string }
}

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { msg?: string; error_description?: string; error?: string }
    return body.msg || body.error_description || body.error || `Auth failed: ${res.status}`
  } catch {
    return `Auth failed: ${res.status}`
  }
}

function toResult(session: GoTrueSession): AuthResult {
  if (!session.access_token || !session.user) {
    throw new Error('No session returned — is "Confirm email" disabled in Supabase?')
  }
  return {
    accessToken: session.access_token,
    userId: session.user.id,
    email: session.user.email ?? '',
  }
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${base()}/auth/v1/signup`, {
    method: 'POST',
    headers: { apikey: anonKey(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await readError(res))
  return toResult((await res.json()) as GoTrueSession)
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${base()}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: anonKey(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await readError(res))
  return toResult((await res.json()) as GoTrueSession)
}

export async function signOut(accessToken: string): Promise<void> {
  if (!accessToken) return
  await fetch(`${base()}/auth/v1/logout`, {
    method: 'POST',
    headers: { apikey: anonKey(), Authorization: `Bearer ${accessToken}` },
  })
}

// Validate a stored token on app load; returns the user or null if expired.
export async function getUser(accessToken: string): Promise<{ id: string; email: string } | null> {
  if (!accessToken) return null
  const res = await fetch(`${base()}/auth/v1/user`, {
    headers: { apikey: anonKey(), Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) return null
  const body = (await res.json()) as { id: string; email?: string }
  return { id: body.id, email: body.email ?? '' }
}
