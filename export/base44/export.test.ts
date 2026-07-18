import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const read = (f: string) => readFileSync(join(here, f), 'utf8')

describe('base44 export artifacts', () => {
  it('classify-image exports a handler and uses GEMINI_API_KEY', () => {
    const s = read('classify-image.ts')
    expect(s).toMatch(/export .*handler/)
    expect(s).toMatch(/GEMINI_API_KEY/)
  })

  it('settle-payment references devnet and a handler', () => {
    const s = read('settle-payment.ts')
    expect(s).toMatch(/devnet/)
    expect(s).toMatch(/export .*handler/)
  })

  it('analyze-code exports a handler', () => {
    expect(read('analyze-code.ts')).toMatch(/export .*handler/)
  })

  it('templates exposes GET/POST via a handler', () => {
    const s = read('templates.ts')
    expect(s).toMatch(/export .*handler/)
    expect(s).toMatch(/POST/)
  })
})
