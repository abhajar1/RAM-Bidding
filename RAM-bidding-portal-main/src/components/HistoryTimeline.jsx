import { motion } from 'framer-motion'
import { History } from 'lucide-react'

export default function HistoryTimeline({ history }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card-premium overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-ram-gold/15 text-ram-gold flex items-center justify-center">
          <History size={18} />
        </div>
        <div>
          <h2 className="font-display font-semibold text-base text-ram-secondary">
            Historique de vos soumissions
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Versioning automatique · Horodatage UTC+1
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Version</th>
              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Horodatage</th>
              <th className="text-right px-6 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Tarif</th>
              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Rang</th>
              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold hidden md:table-cell">Note</th>
              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold hidden lg:table-cell">Auteur</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <motion.tr
                key={h.ver}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="border-b border-gray-50 hover:bg-bg transition-colors"
              >
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold ${
                    i === 0 ? 'bg-ram-gold/15 text-ram-secondary border border-ram-gold/30' : 'bg-gray-100 text-ink-muted'
                  }`}>
                    {h.ver}
                    {i === 0 && <span className="ml-1 text-ram-primary">●</span>}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-ink-muted tabular-nums">{h.ts}</td>
                <td className="px-6 py-4 text-right">
                  <span className="font-display font-bold text-ram-secondary">{h.price}</span>
                  <span className="text-[10px] text-ink-muted ml-1">MAD</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-sm text-ink">
                    #{h.rank}<span className="text-ink-muted text-xs">/{h.total}</span>
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-xs text-ink-muted italic">
                    {h.note === '—' ? <span className="opacity-50">—</span> : h.note}
                  </span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-xs text-ink-muted">{h.author}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
