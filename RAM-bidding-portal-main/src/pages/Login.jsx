import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { isSalesforceConfigured, startSalesforceLogin } from '../services/salesforceAuth'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ssoLoading, setSsoLoading] = useState(false)
  const [ssoError, setSsoError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // En attendant la Connected App Salesforce, on redirige directement
    navigate('/portal')
  }

  const handleSalesforceSso = async () => {
    try {
      setSsoError('')
      setSsoLoading(true)
      await startSalesforceLogin()
    } catch (error) {
      setSsoLoading(false)
      setSsoError(error.message || 'Impossible de lancer la connexion Salesforce.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ============ COL GAUCHE — Visual ============ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-dark">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1200&q=80"
            alt="Casablanca"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ram-secondary/80 via-ram-secondary/60 to-ram-primary/40" />
          <div className="absolute inset-0 moroccan-pattern-dark opacity-50" />
        </div>

        {/* Contenu visuel */}
        <div className="relative h-full flex flex-col justify-between p-16 text-white">
          {/* Top — Logo */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 bg-ram-primary rounded-lg flex items-center justify-center font-display font-bold shadow-ram">
              RAM
            </div>
            <div>
              <div className="font-display font-semibold">Royal Air Maroc</div>
              <div className="text-[10px] uppercase tracking-widest text-ram-gold">
                Partenaires Hôteliers
              </div>
            </div>
          </Link>

          {/* Citation premium */}
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-ram-gold" />
              <span className="text-ram-gold text-xs uppercase tracking-[0.3em] font-medium">
                Bienvenue
              </span>
            </div>
            <h2 className="heading-display text-4xl xl:text-5xl mb-6 leading-tight">
              Le Royaume,
              <br />
              <span className="text-ram-gold">à portée d'aile.</span>
            </h2>
            <p className="text-white/70 leading-relaxed">
              Accédez à votre espace partenaire et participez aux consultations
              tarifaires en temps réel sur l'ensemble des escales RAM.
            </p>
          </div>

          {/* Footer card */}
          <div className="text-xs text-white/50 flex items-center gap-4">
            <span>© 2026 RAM</span>
            <div className="w-1 h-1 rounded-full bg-ram-gold" />
            <span>Casablanca · Maroc</span>
          </div>
        </div>
      </div>

      {/* ============ COL DROITE — Form ============ */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-white relative">
        <div className="absolute inset-0 moroccan-pattern" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md mx-auto"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-11 h-11 bg-ram-primary rounded-lg flex items-center justify-center font-display font-bold text-white">
              RAM
            </div>
            <div>
              <div className="font-display font-semibold text-ram-secondary">Royal Air Maroc</div>
              <div className="text-[10px] uppercase tracking-widest text-ram-gold">
                Partenaires Hôteliers
              </div>
            </div>
          </Link>

          {/* Heading */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-10 h-px bg-ram-gold" />
              <span className="text-ram-gold text-[10px] uppercase tracking-[0.3em] font-medium">
                Connexion
              </span>
            </div>
            <h1 className="heading-display text-3xl text-ram-secondary mb-3">
              Espace Partenaire
            </h1>
            <p className="text-ink-muted text-sm">
              Identifiez-vous avec vos accès hôtel pour accéder au portail.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-ink-muted font-medium mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@votre-hotel.ma"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-ram-primary focus:ring-2 focus:ring-ram-primary/10 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-ink-muted font-medium">
                  Mot de passe
                </label>
                <a href="#" className="text-xs text-ram-primary hover:underline">
                  Oublié ?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-ram-primary focus:ring-2 focus:ring-ram-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-ram-primary focus:ring-ram-primary" />
              <span>Rester connecté sur cet appareil</span>
            </label>

            <button
              type="submit"
              className="w-full btn-premium-primary justify-center text-base mt-2"
            >
              Se connecter
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-ink-subtle uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* SSO Salesforce */}
          <button
            type="button"
            onClick={handleSalesforceSso}
            disabled={!isSalesforceConfigured() || ssoLoading}
            className="w-full py-3.5 border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-bg transition-colors text-sm font-medium text-ram-secondary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="w-5 h-5 rounded bg-[#00A1E0] flex items-center justify-center text-white text-[10px] font-bold">
              SF
            </div>
            {ssoLoading ? 'Redirection vers Salesforce...' : 'Continuer avec Salesforce SSO'}
          </button>
          {ssoError ? (
            <p className="mt-3 text-xs text-red-600">{ssoError}</p>
          ) : null}
          {!isSalesforceConfigured() ? (
            <p className="mt-3 text-xs text-ink-muted">
              Configuration manquante: ajoute `VITE_SF_CLIENT_ID` et `VITE_SF_LOGIN_URL`.
            </p>
          ) : null}

          {/* Bottom link */}
          <div className="mt-10 text-center text-sm text-ink-muted">
            Pas encore partenaire ?{' '}
            <a href="#" className="text-ram-primary font-medium hover:underline">
              Demander l'accès
            </a>
          </div>

          {/* Note POC */}
          <div className="mt-8 p-4 bg-ram-gold/10 border border-ram-gold/30 rounded-lg text-xs text-ram-secondary">
            <strong>Mode démo POC</strong> — Cliquez sur "Se connecter" pour
            accéder au portail. L'authentification réelle sera branchée sur la
            Connected App Salesforce.
          </div>
        </motion.div>
      </div>
    </div>
  )
}
