import { useMemo, useState } from 'react'
import type { Receipt } from '../core/types'
import { settle } from '../core/settle'
import type { SettleResult } from '../core/settle'
import { GlassPanel } from '../ui/GlassPanel'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'
import { Icon } from '../ui/Icon'

const PERSON_COLORS = ['text-accent', 'text-accentViolet', 'text-success', 'text-warning']

export function BillSplitter({ data }: { data: Receipt }) {
  const [people, setPeople] = useState<string[]>(['You', 'Friend'])
  const [newPerson, setNewPerson] = useState('')
  // itemIndex -> personIndex
  const [assignment, setAssignment] = useState<Record<number, number>>(() =>
    Object.fromEntries(data.items.map((_, i) => [i, 0])),
  )
  const [settling, setSettling] = useState<number | null>(null)
  const [results, setResults] = useState<Record<number, SettleResult>>({})

  const lineTotal = (i: number) => data.items[i].price * data.items[i].quantity
  const itemsSubtotal = useMemo(
    () => data.items.reduce((s, _, i) => s + lineTotal(i), 0),
    [data.items],
  )

  function cycleAssign(itemIndex: number) {
    setAssignment((a) => ({ ...a, [itemIndex]: (a[itemIndex] + 1) % people.length }))
  }

  function addPerson() {
    const name = newPerson.trim()
    if (!name) return
    setPeople((p) => [...p, name])
    setNewPerson('')
  }

  function personShare(personIndex: number) {
    const base = data.items.reduce(
      (s, _, i) => (assignment[i] === personIndex ? s + lineTotal(i) : s),
      0,
    )
    // distribute tax + tip proportionally to each person's item subtotal
    const ratio = itemsSubtotal > 0 ? base / itemsSubtotal : 0
    const extras = (data.tax + data.tip) * ratio
    return base + extras
  }

  async function onSettle(personIndex: number) {
    setSettling(personIndex)
    try {
      const r = await settle({ to: people[personIndex], amountUsdc: personShare(personIndex) })
      setResults((prev) => ({ ...prev, [personIndex]: r }))
    } finally {
      setSettling(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Icon name="split" size={28} className="text-accent" />
        <div>
          <h1 className="font-display text-2xl font-bold">{data.store_name}</h1>
          <p className="text-muted text-sm">{data.date} · Tap an item to reassign it</p>
        </div>
      </div>

      <GlassPanel>
        <ul className="divide-y divide-white/5">
          {data.items.map((item, i) => (
            <li key={i}>
              <button
                onClick={() => cycleAssign(i)}
                className="w-full min-h-[44px] flex items-center justify-between py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/5 ${PERSON_COLORS[assignment[i] % PERSON_COLORS.length]}`}
                  >
                    {people[assignment[i]] ?? '—'}
                  </span>
                  <span>
                    {item.quantity > 1 ? `${item.quantity}× ` : ''}
                    {item.name}
                  </span>
                </span>
                <span className="font-body tabular-nums">${lineTotal(i).toFixed(2)}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-white/10 text-sm text-muted space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums">${data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax + Tip</span>
            <span className="tabular-nums">${(data.tax + data.tip).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-text font-semibold text-base">
            <span>Total</span>
            <span className="tabular-nums">${data.total.toFixed(2)}</span>
          </div>
        </div>
      </GlassPanel>

      <div className="flex gap-2">
        <label className="sr-only" htmlFor="new-person">
          Add a person
        </label>
        <input
          id="new-person"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPerson()}
          placeholder="Add a person…"
          className="flex-1 min-h-[44px] px-3 rounded-xl bg-glass border border-white/10 text-text placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <Button variant="ghost" onClick={addPerson}>
          Add
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {people.map((name, pi) => (
          <GlassPanel key={pi}>
            <div className="flex items-center justify-between mb-3">
              <span className={`font-display font-semibold ${PERSON_COLORS[pi % PERSON_COLORS.length]}`}>
                {name}
              </span>
              <span className="tabular-nums text-lg font-semibold">
                ${personShare(pi).toFixed(2)}
              </span>
            </div>
            {results[pi] ? (
              <div className="text-xs text-muted space-y-1">
                <div className="flex items-center gap-1 text-success">
                  <Icon name="check" size={14} />
                  Settled{results[pi].mocked ? ' (mock)' : ' on devnet'}
                </div>
                <a
                  href={results[pi].explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline break-all hover:text-accent"
                >
                  {results[pi].signature.slice(0, 16)}…
                </a>
              </div>
            ) : (
              <Button
                onClick={() => onSettle(pi)}
                disabled={settling === pi}
                className="w-full flex items-center justify-center gap-2"
              >
                {settling === pi ? <Spinner /> : <Icon name="split" size={16} />}
                Settle ${personShare(pi).toFixed(2)}
              </Button>
            )}
          </GlassPanel>
        ))}
      </div>
    </div>
  )
}
