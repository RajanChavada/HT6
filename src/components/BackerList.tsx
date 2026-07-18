import type { Stake } from '../core/types'

export default function BackerList({ stakes }: { stakes: Stake[] }) {
  return (
    <div className="flex flex-col gap-1" aria-label="Backers">
      {stakes.map((s, i) => (
        <div key={i} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-1.5 text-sm">
          <span className="font-medium">{s.userId}</span>
          <span className={s.side === 'back' ? 'text-emerald-400' : 'text-rose-400'}>
            {s.side === 'back' ? '▲ backs' : '▼ fades'} ${s.amount}
          </span>
        </div>
      ))}
    </div>
  )
}
