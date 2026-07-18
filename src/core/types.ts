import { z } from 'zod'

export type ContentType = 'receipt' | 'code' | 'error' | 'whiteboard' | 'other'

export const ReceiptSchema = z.object({
  store_name: z.string(),
  date: z.string(),
  items: z.array(
    z.object({ name: z.string(), quantity: z.number(), price: z.number() }),
  ),
  subtotal: z.number(),
  tax: z.number(),
  tip: z.number(),
  total: z.number(),
})

export const CodeSchema = z.object({
  language: z.string(),
  code: z.string(),
  issues: z.array(
    z.object({
      severity: z.enum(['error', 'warning', 'info']),
      line: z.number(),
      message: z.string(),
      suggestion: z.string(),
    }),
  ),
  summary: z.string(),
})

export const ErrorSchema = z.object({
  error_type: z.string(),
  message: z.string(),
  file: z.string(),
  line: z.number(),
  stack_trace: z.string(),
  probable_cause: z.string(),
  suggested_fix: z.string(),
})

export const WhiteboardSchema = z.object({
  columns: z.array(
    z.object({ title: z.string(), cards: z.array(z.string()) }),
  ),
})

export const GenericSchema = z.object({
  description: z.string(),
  fields: z.record(z.string(), z.any()),
})

export type Receipt = z.infer<typeof ReceiptSchema>
export type Code = z.infer<typeof CodeSchema>
export type ErrorData = z.infer<typeof ErrorSchema>
export type Whiteboard = z.infer<typeof WhiteboardSchema>
export type Generic = z.infer<typeof GenericSchema>

export type ClassifyResult = { type: ContentType; confidence: number; data: unknown }

export function schemaFor(type: ContentType) {
  switch (type) {
    case 'receipt':
      return ReceiptSchema
    case 'code':
      return CodeSchema
    case 'error':
      return ErrorSchema
    case 'whiteboard':
      return WhiteboardSchema
    default:
      return GenericSchema
  }
}
