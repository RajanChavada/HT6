import { useCallback, useRef, useState } from 'react'
import { classify } from './core/classify'
import { route } from './core/router'
import type { ClassifyResult } from './core/types'
import { Materialization } from './three/Materialization'
import { TemplateSwitch } from './TemplateSwitch'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'
import { KeyStatus } from './ui/KeyStatus'

type Phase = 'idle' | 'materializing' | 'done'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<ClassifyResult | null>(null)
  const overlayDone = useRef(false)
  const classified = useRef<ClassifyResult | null>(null)

  // reveal only when BOTH the overlay animation finished AND classify resolved
  const tryReveal = useCallback(() => {
    if (overlayDone.current && classified.current) {
      setResult(classified.current)
      setPhase('done')
    }
  }, [])

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    overlayDone.current = false
    classified.current = null
    setResult(null)
    setPhase('materializing')

    const base64 = await fileToBase64(file).catch(() => undefined)
    classify({ name: file.name, base64 }).then((r) => {
      classified.current = r
      tryReveal()
    })
  }

  function reset() {
    setPhase('idle')
    setResult(null)
    overlayDone.current = false
    classified.current = null
  }

  return (
    <div className="min-h-screen font-body">
      <header className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Icon name="sparkle" size={22} className="text-accent" />
          <span className="font-display font-bold text-lg">
            Snap<span className="text-accent">Forge</span>
          </span>
        </div>
        {phase === 'done' && (
          <Button variant="ghost" onClick={reset} className="flex items-center gap-2">
            <Icon name="camera" size={16} />
            Scan another
          </Button>
        )}
      </header>

      <main className="px-5 py-8">
        {phase === 'idle' && (
          <div className="max-w-md mx-auto text-center space-y-6 pt-16">
            <h1 className="font-display text-3xl font-bold">Snap a photo, forge an app.</h1>
            <p className="text-muted">
              Receipt, code, whiteboard, or error — SnapForge reads it and builds a working app around it.
            </p>
            <label
              htmlFor="capture"
              className="inline-flex items-center gap-2 min-h-[44px] px-6 rounded-xl bg-accent text-bg font-medium cursor-pointer transition-[filter] duration-200 hover:brightness-110 focus-within:ring-2 focus-within:ring-accent"
            >
              <Icon name="camera" size={20} />
              Snap or upload
            </label>
            <input
              id="capture"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFile}
              className="sr-only"
            />
            <p className="text-xs text-muted/70">
              Tip: name a demo file like <code>receipt.jpg</code>, <code>code.png</code>, or{' '}
              <code>error.png</code> to route it without API keys.
            </p>
            <KeyStatus />
          </div>
        )}

        {phase === 'done' && result && (
          <TemplateSwitch templateId={route(result.type)} data={result.data} />
        )}
      </main>

      {phase === 'materializing' && (
        <Materialization
          onComplete={() => {
            overlayDone.current = true
            tryReveal()
          }}
        />
      )}
    </div>
  )
}
