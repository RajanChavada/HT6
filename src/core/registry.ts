import templates from '../fixtures/templates.json'

export type TemplateDef = {
  id: string
  name: string
  classifierPrompt: string
  extractionSchema: { $schema: string }
  templatePagePath: string
  author: string
  isBuiltIn: boolean
  usageCount: number
}

const REGISTRY = templates as TemplateDef[]

export function listTemplates(): TemplateDef[] {
  return REGISTRY
}

export function getTemplate(id: string): TemplateDef | undefined {
  return REGISTRY.find((t) => t.id === id)
}
