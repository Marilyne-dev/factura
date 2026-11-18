"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PhoneMockup from '@/components/PhoneMockup'
import AuthSlideshow from '@/components/AuthSlideshow'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      if (error.message === 'Email not confirmed') {
        setError("Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception (et vos spams).")
      } else if (error.message === 'Invalid login credentials') {
        setError("Email ou mot de passe incorrect.")
      } else {
        setError("Une erreur est survenue. Réessayez.")
      }
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <AuthSlideshow />

        <svg className="pat-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{ opacity: '.5' }}>
          <defs><pattern id="auth-pat-login" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <polygon points="20,1 39,20 20,39 1,20" fill="none" stroke="#fff" strokeWidth=".7" opacity=".2" />
            <polygon points="20,9 31,20 20,31 9,20" fill="none" stroke="#FFCC00" strokeWidth=".5" opacity=".25" />
            <circle cx="20" cy="20" r="1.5" fill="#FFCC00" opacity=".3" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#auth-pat-login)" />
        </svg>

        <Link href="/" className="auth-logo">
          <span className="nf">F</span>actura
        </Link>

        <div className="auth-visual-mid">
          <div className="auth-visual-text">
            <div className="auth-quote">
              Envoyez la facture.<br />On s&apos;occupe <em>du reste.</em>
            </div>
            <p className="auth-subtext">
              Reconnectez-vous pour retrouver vos factures, vos clients et le suivi de vos relances.
            </p>
            <div className="auth-trust">
              <div className="stars">★★★★★</div>
              <span>Factura est actuellement en bêta.</span>
            </div>
          </div>
          <PhoneMockup />
        </div>

        <Link href="/" className="auth-back">← Retour à l&apos;accueil</Link>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card-title">Connexion</div>
          <div className="auth-card-sub">Accédez à votre tableau de bord Factura.</div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="vous@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-switch" style={{ marginTop: -8, marginBottom: 18, textAlign: 'right' }}>
              <Link href="/forgot-password">Mot de passe oublié ?</Link>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="auth-switch">
            Pas encore de compte ? <Link href="/register">Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
