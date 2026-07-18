import { describe, it, expect } from 'vitest'
import { route, TEMPLATE_MAP } from './router'
import type { ContentType } from './types'

describe('route', () => {
  it('maps receipt to bill-splitter', () => {
    expect(route('receipt')).toBe('bill-splitter')
  })
  it('maps code to code-review', () => {
    expect(route('code')).toBe('code-review')
  })
  it('maps error to debug-assistant', () => {
    expect(route('error')).toBe('debug-assistant')
  })
  it('maps whiteboard to kanban-board', () => {
    expect(route('whiteboard')).toBe('kanban-board')
  })
  it('falls back to generic-view for other', () => {
    expect(route('other')).toBe('generic-view')
  })
  it('covers every content type', () => {
    const types: ContentType[] = ['receipt', 'code', 'error', 'whiteboard', 'other']
    types.forEach((t) => expect(TEMPLATE_MAP[t]).toBeTruthy())
  })
})
