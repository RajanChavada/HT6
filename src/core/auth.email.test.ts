import { it, expect, beforeEach, vi } from 'vitest'

// Mock the Supabase auth adapter so no real network happens.
const signUpMock = vi.fn<(e: string, p: string) => Promise<unknown>>()
const signInMock = vi.fn<(e: string, p: string) => Promise<unknown>>()
const signOutMock = vi.fn<(t: string) => Promise<void>>(() => Promise.resolve())
vi.mock('./supabaseAuth', () => ({
  authEnabled: true,
  signUp: (e: string, p: string) => signUpMock(e, p),
  signInWithPassword: (e: string, p: string) => signInMock(e, p),
  signOut: (t: string) => signOutMock(t),
}))

import { signUpWithEmail, signInWithEmail, signOut, getSession } from './auth'
import { getProfile } from './users'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  signUpMock.mockReset()
  signInMock.mockReset()
  signOutMock.mockClear()
})

it('signUpWithEmail stores a session with token + uid and provisions a profile', async () => {
  signUpMock.mockResolvedValue({ accessToken: 'tok1', userId: 'uid_1', email: 'a@b.co' })

  const s = await signUpWithEmail('a@b.co', 'pw123456', 'Ada')

  expect(s.id).toBe('uid_1')
  expect(s.name).toBe('Ada')
  expect(s.accessToken).toBe('tok1')
  expect(getSession()?.id).toBe('uid_1')
  const profile = getProfile('uid_1')
  expect(profile?.name).toBe('Ada')
  expect(profile?.friendCode).toHaveLength(6)
})

it('signInWithEmail recovers the existing profile name for a returning user', async () => {
  // Simulate a returning user whose profile already exists under their uid.
  signUpMock.mockResolvedValue({ accessToken: 'tok1', userId: 'uid_2', email: 'c@d.co' })
  await signUpWithEmail('c@d.co', 'pw', 'Bo')
  sessionStorage.clear() // token gone (closed tab), profile persists in localStorage

  signInMock.mockResolvedValue({ accessToken: 'tok2', userId: 'uid_2', email: 'c@d.co' })
  const s = await signInWithEmail('c@d.co', 'pw')

  expect(s.id).toBe('uid_2')
  expect(s.name).toBe('Bo') // recovered, not regenerated
  expect(getProfile('uid_2')?.friends).toEqual([])
})

it('signOut clears the session and calls the adapter with the token', async () => {
  signUpMock.mockResolvedValue({ accessToken: 'tok9', userId: 'uid_9', email: 'e@f.co' })
  await signUpWithEmail('e@f.co', 'pw', 'Cy')
  expect(getSession()).not.toBeNull()

  await signOut()

  expect(getSession()).toBeNull()
  expect(signOutMock).toHaveBeenCalledWith('tok9')
})
