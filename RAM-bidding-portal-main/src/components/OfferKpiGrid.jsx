import { motion } from 'framer-motion'
import { ClipboardList, Trophy, TrendingDown, Users } from 'lucide-react'

export default function OfferKpiGrid({
  offers = [],
  activeOffer,
  showDetails = false,
  onToggleDetails,
  ranking = [],
}) {
  const best = ranking.find((row) => row.rank === 1) || null
  const me = ranking.find((row) => row.me) || null
  const total = ranking.length || null
  const gap = best && me ? me.price - best.price : null
  const gapPct = best && me && best.price ? Math.round((gap / best.price) * 100) : null

  const items = [
    {
      label: 'Detail AO',
      value: activeOffer?.reference || '-',
      sub: showDetails ? 'Cliquez pour masquer la fiche' : 'Cliquez pour afficher la fiche',
      icon: <ClipboardList size={18} />,
      clickable: true,
    },
    {
      label: 'Meilleure offre marche',
      value: best ? `${best.price} MAD` : '-',
      sub: best ? `${best.hotel} · maj ${best.lastUpdate}` : 'Aucune donnee',
      icon: <Trophy size={18} />,
      highlight: true,
    },
    {
      label: 'Mon classement actuel',
      value: me && total ? `#${me.rank} / ${total}` : '-',
      sub: me ? `Mon tarif : ${me.price} MAD` : 'Aucune donnee',
      icon: <Users size={18} />,
    },
    {
      label: 'Ecart vs meilleur',
      value: gap == null ? '-' : `+${gap} MAD`,
      sub: gapPct == null ? 'Aucune donnee' : `+${gapPct}% au-dessus du best`,
      icon: <TrendingDown size={18} />,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.06 }}
          onClick={item.clickable ? onToggleDetails : undefined}
          className={`rounded-2xl border p-5 shadow-premium ${
            item.highlight
              ? 'bg-gradient-dark text-white border-transparent relative overflow-hidden'
              : 'bg-white border-gray-100'
          } ${item.clickable ? 'cursor-pointer hover:border-ram-primary/40' : ''}`}
        >
          {item.highlight ? <div className="absolute inset-0 moroccan-pattern-dark opacity-30" /> : null}

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${
                  item.highlight ? 'text-ram-gold' : 'text-ink-muted'
                }`}
              >
                {item.label}
              </div>
              <div className={item.highlight ? 'text-ram-gold' : 'text-ram-primary'}>{item.icon}</div>
            </div>
            <div className={`font-display font-bold text-2xl ${item.highlight ? 'text-white' : 'text-ram-secondary'}`}>
              {item.value}
            </div>
            <div className={`text-xs mt-1.5 ${item.highlight ? 'text-white/75' : 'text-ink-muted'}`}>
              {item.sub}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
