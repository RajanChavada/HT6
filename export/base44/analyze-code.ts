// Base44 backend function (Deno). Porting artifact — mirrors src/core/analyze.ts.
// Paste into a Base44 backend function named `analyze-code`.
// POST { kind: "code"|"error", content: string } -> { text, mocked }

export async function handler(req: Request): Promise<Response> {
  const key = Deno.env.get('BACKBOARD_API_KEY')
  const { kind, content } = await req.json()

  if (!key) {
    const canned =
      kind === 'code'
        ? `Reviewed ${content.length} chars. Suggest: extract magic numbers, add a guard clause, cover the happy path with a test.`
        : `Parsed the error. Probable cause: an undefined value reaching a call site. Fix: add a null check before the access.`
    return Response.json({ text: canned, mocked: true })
  }

  const res = await fetch('https://api.backboard.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ messages: [{ role: 'user', content: `Analyze this ${kind}:\n${content}` }] }),
  })
  const json = await res.json()
  return Response.json({ text: json.choices?.[0]?.message?.content ?? 'No analysis.', mocked: false })
}
