// Base44 backend function (Deno). Porting artifact — mirrors src/core/classify.ts.
// Paste into a Base44 backend function named `classify-image`.
// POST { base64: string } -> { type, confidence, data }

export async function handler(req: Request): Promise<Response> {
  const key = Deno.env.get('GEMINI_API_KEY')
  const { base64 } = await req.json()

  if (!key || !base64) {
    return Response.json({ type: 'other', confidence: 0.3, data: { description: 'No key/image', fields: {} } })
  }

  const body = {
    contents: [
      {
        parts: [
          {
            text: 'Classify this image as one of: receipt, code, error, whiteboard, other. Then extract structured data. Return ONLY JSON: {"type":"...","confidence":0-1,"data":{...}}.',
          },
          { inline_data: { mime_type: 'image/jpeg', data: base64 } },
        ],
      },
    ],
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  )
  const json = await res.json()
  const text: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
  const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
  return Response.json(parsed)
}
