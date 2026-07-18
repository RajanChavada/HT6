import { useState } from 'react'

interface Props {
  onBack: (user: string, amount: number) => void
  onFade: (user: string, amount: number) => void
  disabled?: boolean
}

const USERS = ['sam', 'dev', 'lee', 'jordan']

export default function StakePanel({ onBack, onFade, disabled }: Props) {
  const [user, setUser] = useState(USERS[0])
  const [amount, setAmount] = useState(10)

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-slate-400">Stake as a friend</div>
      <div className="flex gap-2">
        <select
          className="rounded-md bg-slate-800 px-2 py-1 text-sm"
          value={user}
          onChange={e => setUser(e.target.value)}
          aria-label="Backer"
        >
          {USERS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <input
          type="number"
          min={1}
          className="w-24 rounded-md bg-slate-800 px-2 py-1 text-sm"
          value={amount}
          onChange={e => setAmount(Math.max(1, Number(e.target.value)))}
          aria-label="Amount"
        />
      </div>
      <div className="flex gap-2">
        <button
          className="flex-1 rounded-md bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 disabled:opacity-40"
          disabled={disabled}
          onClick={() => onBack(user, amount)}
        >
          Back them ▲
        </button>
        <button
          className="flex-1 rounded-md bg-rose-500/90 px-3 py-2 text-sm font-medium text-rose-950 disabled:opacity-40"
          disabled={disabled}
          onClick={() => onFade(user, amount)}
        >
          Fade them ▼
        </button>
      </div>
    </div>
  )
}
