import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CodeReview } from './CodeReview'
import { DebugAssistant } from './DebugAssistant'

const code = {
  language: 'ts',
  code: 'const x = 1',
  issues: [{ severity: 'warning' as const, line: 1, message: 'unused', suggestion: 'remove' }],
  summary: 'ok',
}
const err = {
  error_type: 'TypeError',
  message: 'x is undefined',
  file: 'a.ts',
  line: 3,
  stack_trace: 'at f (a.ts:3)',
  probable_cause: 'null value',
  suggested_fix: 'add guard',
}

describe('dev tool templates', () => {
  it('CodeReview shows the code and an issue', () => {
    render(<CodeReview data={code} />)
    expect(screen.getByText(/const x = 1/)).toBeTruthy()
    expect(screen.getByText(/unused/)).toBeTruthy()
  })

  it('DebugAssistant shows error type and cause', () => {
    render(<DebugAssistant data={err} />)
    expect(screen.getByText(/TypeError/)).toBeTruthy()
    expect(screen.getByText(/null value/)).toBeTruthy()
  })
})
