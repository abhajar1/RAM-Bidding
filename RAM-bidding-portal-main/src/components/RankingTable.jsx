import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, Minus, Download } from 'lucide-react'

export default function RankingTable({ ranking }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-premium overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="font-display font-semibold text-base text-ram-secondary">
            Tableau consolidé des offres
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Classement temps réel · Logique paramétrée par RAM
          </p>
        </div>
        <button className="text-xs text-ram-primary hover:underline flex items-center gap-1.5 font-medium">
          <Download size={12} />
          Exporter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg border-b border-gray-100">
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Rang</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Hôtel partenaire</th>
              <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Tarif</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Δ vs best</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold hidden md:table-cell">Tendance 24h</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-semibold hidden lg:table-cell">Maj</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((row, i) => (
              <motion.tr
                key={row.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className={`border-b border-gray-50 transition-colors ${
                  row.me ? 'bg-ram-gold/5' : 'hover:bg-bg'
                }`}
              >
                <td className="px-4 py-4">
                  <RankBadge rank={row.rank} />
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-ink">
                    {row.hotel}
                    {row.me && (
                      <span className="ml-2 px-2 py-0.5 bg-ram-primary text-white text-[9px] uppercase tracking-wider rounded-full font-semibold">
                        Vous
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-display font-bold text-base text-ram-secondary tabular-nums">
                    {row.price}
                  </span>
                  <span className="text-[10px] text-ink-muted ml-1">MAD</span>
                </td>
                <td className="px-4 py-4">
                  {row.rank === 1 ? (
                    <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded-full border border-green-200">
                      Best
                    </span>
                  ) : (
                    <span className="text-xs text-ink-muted">
                      +{row.price - ranking[0].price} MAD
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <TrendIndicator delta={row.delta} />
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="text-xs text-ink-muted">{row.lastUpdate}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

function RankBadge({ rank }) {
  const styles = {
    1: 'bg-gradient-gold text-white shadow-gold',
    2: 'bg-gradient-to-br from-gray-300 to-gray-400 text-white',
    3: 'bg-gradient-to-br from-orange-300 to-orange-500 text-white',
  }
  const cls = styles[rank] || 'bg-gray-100 text-ink'

  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-display font-bold text-xs ${cls}`}
    >
      {rank}
    </span>
  )
}

function TrendIndicator({ delta }) {
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
        <ArrowDown size={12} />
        {Math.abs(delta)} MAD
      </span>
    )
  }
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-ram-primary text-xs font-medium">
        <ArrowUp size={12} />
        {delta} MAD
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-ink-muted text-xs">
      <Minus size={12} />
      stable
    </span>
  )
}
