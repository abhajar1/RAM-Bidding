import { motion } from 'framer-motion'
import { Trophy, TrendingDown, Users, Clock } from 'lucide-react'

export default function KpiGrid({ kpis }) {
  const items = [
    {
      label: 'Meilleure offre marché',
      value: kpis.bestMarketPrice,
      unit: 'MAD',
      sub: 'Hôtel Onomo · maj il y a 4 min',
      icon: <Trophy size={20} />,
      highlight: true,
    },
    {
      label: 'Mon classement actuel',
      value: `#${kpis.myCurrentRank}`,
      unit: `/ ${kpis.totalCompetitors}`,
      sub: `Mon tarif : ${kpis.myCurrentBid} MAD`,
      icon: <Users size={20} />,
    },
    {
      label: 'Écart vs meilleur',
      value: `+${kpis.gapVsBest}`,
      unit: 'MAD',
      sub: `+${kpis.gapPercentage}% au-dessus du best`,
      icon: <TrendingDown size={20} />,
      trend: 'down',
    },
    {
      label: 'Mouvements aujourd\'hui',
      value: kpis.submissionsToday,
      unit: '',
      sub: 'soumissions validées',
      icon: <Clock size={20} />,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((kpi, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * i }}
          className={`rounded-2xl p-5 border ${
            kpi.highlight
              ? 'bg-gradient-dark text-white border-transparent relative overflow-hidden'
              : 'bg-white border-gray-100 shadow-premium'
          }`}
        >
          {kpi.highlight && (
            <div className="absolute inset-0 moroccan-pattern-dark opacity-30" />
          )}

          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div
                className={`text-[10px] uppercase tracking-widest font-semibold ${
                  kpi.highlight ? 'text-ram-gold' : 'text-ink-muted'
                }`}
              >
                {kpi.label}
              </div>
              <div className={kpi.highlight ? 'text-ram-gold' : 'text-ram-primary'}>
                {kpi.icon}
              </div>
            </div>

            <div className="font-display font-bold text-3xl">
              {kpi.value}
              {kpi.unit && (
                <span className={`text-base font-medium ml-1 ${kpi.highlight ? 'text-white/70' : 'text-ink-muted'}`}>
                  {kpi.unit}
                </span>
              )}
            </div>

            <div
              className={`text-xs mt-1.5 ${
                kpi.highlight ? 'text-white/60' : 'text-ink-muted'
              }`}
            >
              {kpi.sub}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
