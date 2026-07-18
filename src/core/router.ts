import type { ContentType } from './types'

export const TEMPLATE_MAP: Record<ContentType, string> = {
  receipt: 'bill-splitter',
  code: 'code-review',
  error: 'debug-assistant',
  whiteboard: 'kanban-board',
  other: 'generic-view',
}

export function route(type: ContentType): string {
  return TEMPLATE_MAP[type] ?? 'generic-view'
}
