import { useState, useEffect } from 'react'
import { getProfile, saveProfile, generateFriendCode } from './users'
import * as supabaseAuth from './supabaseAuth'

export interface UserSession {
  id: string
  name: string
  avatarBase64?: string
  accessToken?: string
}

// Per-session identity. We key off sessionStorage (NOT localStorage) so each
// browser tab carries its own identity — one person can open several tabs and
// join the same market as different backers, which is exactly what we need to
// demo multiplayer on a single machine. Real friends on real devices each get
// their own sessionStorage automatically.
const AUTH_KEY = 'stakes_auth_session'

export function getSession(): UserSession | null {
  const data = sessionStorage.getItem(AUTH_KEY)
  return data ? JSON.parse(data) : null
}

export function saveSession(session: UserSession) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event('stakes_auth_changed'))
}

export function clearSession() {
  sessionStorage.removeItem(AUTH_KEY)
  window.dispatchEvent(new Event('stakes_auth_changed'))
}

export function useSession() {
  const [session, setSession] = useState<UserSession | null>(getSession())

  useEffect(() => {
    function handleUpdate() {
      setSession(getSession())
    }

    // sessionStorage is per-tab, so no cross-tab `storage` event — the custom
    // event is enough to react to sign-in/out within this tab.
    window.addEventListener('stakes_auth_changed', handleUpdate)

    return () => {
      window.removeEventListener('stakes_auth_changed', handleUpdate)
    }
  }, [])

  return session
}

export function signIn(name: string, avatarBase64?: string): UserSession {
  const id = 'user_' + Math.random().toString(36).substring(2, 9)
  const session: UserSession = { id, name, avatarBase64 }
  saveSession(session)
  saveProfile({ id, name, avatarBase64, friendCode: generateFriendCode(), friends: [] })
  return session
}

export function updateProfile(id: string, patch: { name?: string; avatarBase64?: string }): void {
  const existing = getProfile(id)
  if (existing) saveProfile({ ...existing, ...patch })
  const session = getSession()
  if (session && session.id === id) saveSession({ ...session, ...patch })
}

// True when real Supabase Auth is configured; false → use the guest signIn flow.
export const authEnabled = supabaseAuth.authEnabled

// Turn a Supabase auth result into a session keyed on the auth uid, provisioning
// (or recovering) the matching profile. A returning user keeps their existing
// name/friends because the profile is keyed to the stable uid.
function establishSession(
  result: supabaseAuth.AuthResult,
  fallbackName: string,
): UserSession {
  const existing = getProfile(result.userId)
  const name = existing?.name ?? fallbackName
  const session: UserSession = { id: result.userId, name, accessToken: result.accessToken }
  saveSession(session)
  if (existing) {
    saveProfile({ ...existing, id: result.userId, name })
  } else {
    saveProfile({ id: result.userId, name, friendCode: generateFriendCode(), friends: [] })
  }
  return session
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
): Promise<UserSession> {
  const result = await supabaseAuth.signUp(email, password)
  return establishSession(result, name || email)
}

export async function signInWithEmail(email: string, password: string): Promise<UserSession> {
  const result = await supabaseAuth.signInWithPassword(email, password)
  return establishSession(result, email)
}

export async function signOut(): Promise<void> {
  const session = getSession()
  if (session?.accessToken) {
    try {
      await supabaseAuth.signOut(session.accessToken)
    } catch {
      // network hiccup on logout — clear locally regardless
    }
  }
  clearSession()
}
