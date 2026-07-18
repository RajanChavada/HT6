import { useState } from 'react'
import type { Whiteboard } from '../core/types'
import { GlassPanel } from '../ui/GlassPanel'
import { Icon } from '../ui/Icon'

type Cols = Whiteboard['columns']

export function KanbanBoard({ data }: { data: Whiteboard }) {
  const [cols, setCols] = useState<Cols>(data.columns)
  const [drag, setDrag] = useState<{ col: number; card: number } | null>(null)

  function onDrop(destCol: number) {
    if (!drag) return
    setCols((prev) => {
      const next = prev.map((c) => ({ ...c, cards: [...c.cards] }))
      const [moved] = next[drag.col].cards.splice(drag.card, 1)
      if (moved !== undefined) next[destCol].cards.push(moved)
      return next
    })
    setDrag(null)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Icon name="board" size={28} className="text-accent" />
        <h1 className="font-display text-2xl font-bold">Kanban Board</h1>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}>
        {cols.map((col, ci) => (
          <div
            key={ci}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(ci)}
            className="space-y-3"
          >
            <h2 className="font-display font-semibold text-muted text-sm uppercase tracking-wide">
              {col.title} <span className="text-muted/60">({col.cards.length})</span>
            </h2>
            <div className="space-y-2 min-h-[60px]">
              {col.cards.map((card, ki) => (
                <div
                  key={ki}
                  draggable
                  onDragStart={() => setDrag({ col: ci, card: ki })}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <GlassPanel className="p-3 text-sm">{card}</GlassPanel>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
