import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { submitBid } from '../services/salesforceApi'

export default function BidForm({ consultationId, currentBid, bestPrice }) {
  const [price, setPrice] = useState(currentBid - 30)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  // Validation live
  const validation = validatePrice(price)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)
    try {
      const res = await submitBid({ consultationId, price, note })
      setResult({ ok: true, ...res })
    } catch (err) {
      setResult({ ok: false, message: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card-premium overflow-hidden sticky top-28"
    >
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 moroccan-pattern-dark opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-ram-gold" />
            <span className="text-ram-gold text-[10px] uppercase tracking-[0.3em] font-medium">
              Soumission
            </span>
          </div>
          <h2 className="font-display font-semibold text-lg">
            Nouvelle proposition tarifaire
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Chambre double · Bed & Breakfast
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Prix */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-ink-muted font-semibold mb-2">
            Tarif proposé
          </label>
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
              min="0"
              max="9999"
              className="w-full px-4 py-4 pr-16 border-2 border-gray-200 rounded-lg font-display font-bold text-2xl text-ram-secondary focus:outline-none focus:border-ram-primary focus:ring-2 focus:ring-ram-primary/10 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted font-medium text-sm">
              MAD
            </span>
          </div>
          <p className="text-[11px] text-ink-muted mt-2">
            Plage autorisée : 450 — 1 200 MAD · Best marché actuel : <strong>{bestPrice} MAD</strong>
          </p>
        </div>

        {/* Validation live */}
        {validation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg flex gap-2.5 text-sm ${validation.cls}`}
          >
            <validation.Icon size={16} className="shrink-0 mt-0.5" />
            <div>
              <strong>{validation.title}</strong>
              <div className="text-xs mt-0.5 opacity-90">{validation.message}</div>
            </div>
          </motion.div>
        )}

        {/* Note interne */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-ink-muted font-semibold mb-2">
            Note interne (optionnel)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Justification ou contexte de cette soumission…"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ram-primary focus:ring-2 focus:ring-ram-primary/10 transition-all resize-none"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting || !validation?.canSubmit}
          className="w-full btn-premium-primary justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Soumission en cours…
            </>
          ) : (
            <>
              <Send size={16} />
              Soumettre le tarif
            </>
          )}
        </button>

        {/* Résultat */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg flex gap-3 text-sm ${
              result.ok
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {result.ok ? (
              <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-green-600" />
            ) : (
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            )}
            <div>
              {result.ok ? (
                <>
                  <strong>Soumission acceptée — {result.version}</strong>
                  <div className="text-xs mt-1 opacity-80">
                    Horodatée le {result.timestamp} · Nouveau rang projeté : #{result.newRank}
                  </div>
                </>
              ) : (
                <>
                  <strong>Soumission refusée</strong>
                  <div className="text-xs mt-1">{result.message}</div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Footer info */}
        <div className="pt-4 border-t border-gray-100 text-[11px] text-ink-muted leading-relaxed">
          Toute soumission est <strong>horodatée et notifiée</strong> à la
          Direction Achats RAM. Vous gardez la main pour soumettre une nouvelle
          version à tout moment.
        </div>
      </form>
    </motion.div>
  )
}

function validatePrice(price) {
  if (!price || isNaN(price)) return null
  if (price < 450) {
    return {
      cls: 'bg-orange-50 border border-orange-200 text-orange-900',
      Icon: AlertTriangle,
      title: 'Plancher tarifaire dépassé',
      message: 'Le tarif minimum autorisé est de 450 MAD.',
      canSubmit: false,
    }
  }
  if (price > 1200) {
    return {
      cls: 'bg-orange-50 border border-orange-200 text-orange-900',
      Icon: AlertTriangle,
      title: 'Plafond tarifaire dépassé',
      message: 'Le tarif maximum autorisé est de 1 200 MAD.',
      canSubmit: false,
    }
  }
  if (price <= 614) {
    return {
      cls: 'bg-green-50 border border-green-200 text-green-900',
      Icon: CheckCircle2,
      title: 'Excellente position projetée',
      message: `Avec ${price} MAD, vous prendriez la 1ère position (vs Onomo à 615 MAD).`,
      canSubmit: true,
    }
  }
  if (price <= 659) {
    return {
      cls: 'bg-blue-50 border border-blue-200 text-blue-900',
      Icon: Info,
      title: 'Position projetée : #2',
      message: 'Vous passez devant Relax Airport (660 MAD).',
      canSubmit: true,
    }
  }
  if (price <= 694) {
    return {
      cls: 'bg-blue-50 border border-blue-200 text-blue-900',
      Icon: Info,
      title: 'Position projetée : #3',
      message: 'Vous gardez votre place actuelle.',
      canSubmit: true,
    }
  }
  return {
    cls: 'bg-orange-50 border border-orange-200 text-orange-900',
    Icon: AlertTriangle,
    title: 'Recul dans le classement',
    message: `Avec ${price} MAD, vous reculeriez (rang ≥ 4).`,
    canSubmit: true,
  }
}
