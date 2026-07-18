export type AnalyzeResult = { text: string; mocked: boolean }

export async function analyze(args: {
  kind: 'code' | 'error'
  content: string
}): Promise<AnalyzeResult> {
  // SETUP REQUIRED (optional): paste VITE_BACKBOARD_API_KEY in .env.local for REAL
  // AI analysis. Without it, we return canned analysis text. See .env.example [2].
  const key = import.meta.env?.VITE_BACKBOARD_API_KEY
  if (!key) {
    const canned =
      args.kind === 'code'
        ? `Reviewed ${args.content.length} chars. Suggest: extract magic numbers into named constants, add a guard clause for the edge input, and cover the happy path with one test.`
        : `Parsed the error. Probable cause: an undefined value reaching a call site. Suggested fix: add a null check before the access and log the offending input so the source is traceable.`
    return { text: canned, mocked: true }
  }
  return await analyzeLive(args, key)
}

// ponytail: live Backboard call; endpoint/model swap-in when key + docs land
async function analyzeLive(
  args: { kind: 'code' | 'error'; content: string },
  key: string,
): Promise<AnalyzeResult> {
  try {
    const res = await fetch('https://api.backboard.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        messages: [{ role: 'user', content: `Analyze this ${args.kind}:\n${args.content}` }],
      }),
    })
    const json = await res.json()
    return {
      text: json.choices?.[0]?.message?.content ?? 'No analysis returned.',
      mocked: false,
    }
  } catch {
    return { text: 'Live analysis failed; using fallback. Check the key and endpoint.', mocked: true }
  }
}
