import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleSalesforceCallback } from '../services/salesforceAuth'

function OAuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    async function processCallback() {
      try {
        await handleSalesforceCallback()
        navigate('/portal', { replace: true })
      } catch (callbackError) {
        setError(callbackError.message || 'Erreur de connexion Salesforce.')
      }
    }

    processCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ram-bg text-ram-ink px-6">
        <div className="max-w-xl w-full bg-white border border-red-200 rounded-xl p-6">
          <h1 className="text-lg font-semibold text-red-700 mb-3">Connexion Salesforce échouée</h1>
          <p className="text-sm text-ink-muted mb-5">{error}</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-ram-primary text-white text-sm font-medium"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ram-bg text-ram-ink">
      <p className="text-sm md:text-base">Connexion Salesforce en cours...</p>
    </div>
  )
}

export default OAuthCallback
