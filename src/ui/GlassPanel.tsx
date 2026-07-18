import type { ReactNode } from 'react'

export function GlassPanel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-glass backdrop-blur-md border border-white/10 rounded-2xl p-5 ${className}`}
    >
      {children}
    </div>
  )
}
