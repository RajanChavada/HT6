import { it, expect, beforeEach, afterEach, vi } from 'vitest'

// The adapter reads flags.supabase at call time via getAuthEnabled(); we mock
// config so tests exercise the enabled path deterministically.
vi.mock('./config', () => ({
  flags: { supabase: true },
  getEnv: (k: string) =>
    k === 'VITE_SUPABASE_URL' ? 'https://proj.supabase.co' : 'anon-key-123',
}))

import { signUp, signInWithPassword, signOut, getUser } from './supabaseAuth'

const okJson = (body: unknown) =>
  Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) } as Response)
const errJson = (status: number, body: unknown) =>
  Promise.resolve({ ok: false, status, json: () => Promise.resolve(body) } as Response)

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>

beforeEach(() => {
  vi.restoreAllMocks()
})
afterEach(() => {
  vi.restoreAllMocks()
})

it('signUp posts to /auth/v1/signup and returns token + user', async () => {
  const fetchMock = vi.fn<FetchFn>(() =>
    okJson({ access_token: 'tok_abc', user: { id: 'uid_1', email: 'a@b.co' } }),
  )
  vi.stubGlobal('fetch', fetchMock)

  const res = await signUp('a@b.co', 'pw123456')

  expect(res.accessToken).toBe('tok_abc')
  expect(res.userId).toBe('uid_1')
  expect(res.email).toBe('a@b.co')
  const [url, init] = fetchMock.mock.calls[0]
  expect(url).toBe('https://proj.supabase.co/auth/v1/signup')
  expect((init as RequestInit).method).toBe('POST')
})

it('signInWithPassword posts to token endpoint with grant_type=password', async () => {
  const fetchMock = vi.fn<FetchFn>(() =>
    okJson({ access_token: 'tok_login', user: { id: 'uid_2', email: 'c@d.co' } }),
  )
  vi.stubGlobal('fetch', fetchMock)

  const res = await signInWithPassword('c@d.co', 'pw')

  expect(res.userId).toBe('uid_2')
  const [url] = fetchMock.mock.calls[0]
  expect(url).toBe('https://proj.supabase.co/auth/v1/token?grant_type=password')
})

it('surfaces the Supabase error message on failure', async () => {
  vi.stubGlobal('fetch', vi.fn<FetchFn>(() => errJson(400, { msg: 'Invalid login credentials' })))
  await expect(signInWithPassword('x@y.co', 'bad')).rejects.toThrow('Invalid login credentials')
})

it('getUser returns null when no token given', async () => {
  vi.stubGlobal('fetch', vi.fn())
  expect(await getUser('')).toBeNull()
})

it('signOut posts to logout with the bearer token', async () => {
  const fetchMock = vi.fn<FetchFn>(() => okJson({}))
  vi.stubGlobal('fetch', fetchMock)
  await signOut('tok_abc')
  const [url, init] = fetchMock.mock.calls[0]
  expect(url).toBe('https://proj.supabase.co/auth/v1/logout')
  expect((init as RequestInit).headers).toMatchObject({ Authorization: 'Bearer tok_abc' })
})
