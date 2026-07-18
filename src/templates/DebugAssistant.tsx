import { useState } from 'react'
import type { ErrorData } from '../core/types'
import { analyze } from '../core/analyze'
import { GlassPanel } from '../ui/GlassPanel'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'
import { Icon } from '../ui/Icon'

export function DebugAssistant({ data }: { data: ErrorData }) {
  const [busy, setBusy] = useState(false)
  const [analysis, setAnalysis] = useState<{ text: string; mocked: boolean } | null>(null)

  async function run() {
    setBusy(true)
    try {
      setAnalysis(await analyze({ kind: 'error', content: `${data.error_type}: ${data.message}\n${data.stack_trace}` }))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Icon name="bug" size={28} className="text-danger" />
        <div>
          <h1 className="font-display text-2xl font-bold">{data.error_type}</h1>
          <p className="text-muted text-sm">
            {data.file}:{data.line}
          </p>
        </div>
      </div>

      <GlassPanel>
        <p className="text-danger font-medium">{data.message}</p>
      </GlassPanel>

      <GlassPanel className="p-0 overflow-hidden">
        <pre className="p-4 overflow-x-auto text-xs font-mono text-muted bg-black/30">
          <code>{data.stack_trace}</code>
        </pre>
      </GlassPanel>

      <div className="grid gap-3 sm:grid-cols-2">
        <GlassPanel>
          <p className="text-xs uppercase text-muted mb-1">Probable cause</p>
          <p className="text-sm">{data.probable_cause}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase text-success mb-1">Suggested fix</p>
          <p className="text-sm">{data.suggested_fix}</p>
        </GlassPanel>
      </div>

      <Button onClick={run} disabled={busy} className="flex items-center gap-2">
        {busy ? <Spinner /> : <Icon name="sparkle" size={16} />}
        Diagnose
      </Button>

      {analysis && (
        <GlassPanel>
          <div className="flex items-center gap-2 mb-2 text-sm text-muted">
            <Icon name="sparkle" size={14} className="text-accentViolet" />
            AI diagnosis{analysis.mocked ? ' (mock)' : ''}
          </div>
          <p className="text-sm whitespace-pre-wrap">{analysis.text}</p>
        </GlassPanel>
      )}
    </div>
  )
}
