import type { ClassifyResult, ContentType } from './types'
import { schemaFor } from './types'
import receipt from '../fixtures/receipt.json'
import code from '../fixtures/code.json'
import errorFx from '../fixtures/error.json'
import whiteboard from '../fixtures/whiteboard.json'

const FIXTURES: Record<Exclude<ContentType, 'other'>, unknown> = {
  receipt,
  code,
  error: errorFx,
  whiteboard,
}

const KEYWORDS: [Exclude<ContentType, 'other'>, string[]][] = [
  ['receipt', ['receipt', 'bill', 'invoice']],
  ['code', ['code', 'snippet', 'source']],
  ['error', ['error', 'stack', 'crash', 'trace']],
  ['whiteboard', ['whiteboard', 'board', 'sticky', 'notes']],
]

function classifyMock(name: string): ClassifyResult {
  const lower = name.toLowerCase()
  for (const [type, kws] of KEYWORDS) {
    if (kws.some((k) => lower.includes(k))) {
      return { type, confidence: 0.95, data: FIXTURES[type] }
    }
  }
  return {
    type: 'other',
    confidence: 0.4,
    data: { description: 'Unrecognized artifact', fields: {} },
  }
}

export async function classify(input: {
  name: string
  base64?: string
}): Promise<ClassifyResult> {
  // SETUP REQUIRED (optional): paste VITE_GEMINI_API_KEY in .env.local to read the
  // REAL photo. Without it, we pick a fixture by filename. See .env.example [1].
  const key = import.meta.env?.VITE_GEMINI_API_KEY
  let result: ClassifyResult
  if (key && input.base64) {
    result = await classifyLive(input.base64, key)
  } else {
    result = classifyMock(input.name)
  }
  if (result.type !== 'other') schemaFor(result.type).parse(result.data)
  return result
}

// ponytail: live path is best-effort; any failure falls back to "other" so the demo never dies
async function classifyLive(base64: string, key: string): Promise<ClassifyResult> {
  try {
    const body = {
      contents: [
        {
          parts: [
            {
              text: 'Classify this image as one of: receipt, code, error, whiteboard, other. Then extract structured data matching the category. Return ONLY JSON: {"type": "...", "confidence": 0.0-1.0, "data": {...}}.',
            },
            { inline_data: { mime_type: 'image/jpeg', data: base64 } },
          ],
        },
      ],
    }
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    )
    const json = await res.json()
    const text: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    return {
      type: parsed.type as ContentType,
      confidence: parsed.confidence ?? 0.8,
      data: parsed.data,
    }
  } catch {
    return {
      type: 'other',
      confidence: 0.3,
      data: { description: 'Live classify failed; mock fallback', fields: {} },
    }
  }
}
