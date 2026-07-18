import { describe, it, expect } from 'vitest'
import { listTemplates, getTemplate } from './registry'
import { TEMPLATE_MAP } from './router'

describe('registry', () => {
  it('has a built-in template for every routed id', () => {
    const ids = new Set(listTemplates().map((t) => t.id))
    Object.values(TEMPLATE_MAP).forEach((id) => expect(ids.has(id)).toBe(true))
  })
  it('every template has classifier + schema + page path', () => {
    listTemplates().forEach((t) => {
      expect(t.classifierPrompt).toBeTruthy()
      expect(t.extractionSchema).toBeTruthy()
      expect(t.templatePagePath).toBeTruthy()
    })
  })
  it('getTemplate finds bill-splitter', () => {
    expect(getTemplate('bill-splitter')?.name).toBeTruthy()
  })
})
