import type { Generic } from '../core/types'
import { GlassPanel } from '../ui/GlassPanel'
import { Icon } from '../ui/Icon'

export function GenericView({ data }: { data: Generic }) {
  const entries = Object.entries(data.fields ?? {})
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Icon name="sparkle" size={28} className="text-accentViolet" />
        <div>
          <h1 className="font-display text-2xl font-bold">Smart Data View</h1>
          <p className="text-muted text-sm">{data.description}</p>
        </div>
      </div>

      <GlassPanel>
        {entries.length === 0 ? (
          <p className="text-muted text-sm">No structured fields detected.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              {entries.map(([key, value]) => (
                <tr key={key}>
                  <td className="py-2 pr-4 text-muted align-top capitalize">{key.replace(/_/g, ' ')}</td>
                  <td className="py-2 break-all">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassPanel>
    </div>
  )
}
