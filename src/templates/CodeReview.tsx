import { useState } from 'react'
import type { Code } from '../core/types'
import { analyze } from '../core/analyze'
import { GlassPanel } from '../ui/GlassPanel'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'
import { Icon } from '../ui/Icon'

const SEVERITY_COLOR: Record<Code['issues'][number]['severity'], string> = {
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-accent',
}

export function CodeReview({ data }: { data: Code }) {
  const [busy, setBusy] = useState(false)
  const [analysis, setAnalysis] = useState<{ text: string; mocked: boolean } | null>(null)

  async function run() {
    setBusy(true)
    try {
      setAnalysis(await analyze({ kind: 'code', content: data.code }))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Icon name="code" size={28} className="text-accent" />
        <div>
          <h1 className="font-display text-2xl font-bold">Code Review</h1>
          <p className="text-muted text-sm">
            {data.language} · {data.summary}
          </p>
        </div>
      </div>

      <GlassPanel className="p-0 overflow-hidden">
        <pre className="p-4 overflow-x-auto text-sm font-mono text-text/90 bg-black/30">
          <code>{data.code}</code>
        </pre>
      </GlassPanel>

      <div className="space-y-2">
        {data.issues.map((issue, i) => (
          <GlassPanel key={i}>
            <div className="flex items-start gap-3">
              <span className={`text-xs font-semibold uppercase ${SEVERITY_COLOR[issue.severity]}`}>
                {issue.severity}
              </span>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="text-muted">line {issue.line}:</span> {issue.message}
                </p>
                <p className="text-sm text-accent/90 mt-1">→ {issue.suggestion}</p>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      <Button onClick={run} disabled={busy} className="flex items-center gap-2">
        {busy ? <Spinner /> : <Icon name="sparkle" size={16} />}
        Explain / Refactor
      </Button>

      {analysis && (
        <GlassPanel>
          <div className="flex items-center gap-2 mb-2 text-sm text-muted">
            <Icon name="sparkle" size={14} className="text-accentViolet" />
            AI analysis{analysis.mocked ? ' (mock)' : ''}
          </div>
          <p className="text-sm whitespace-pre-wrap">{analysis.text}</p>
        </GlassPanel>
      )}
    </div>
  )
}
