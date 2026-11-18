"use client"

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import PhoneMockup from '@/components/PhoneMockup'
import AuthSlideshow from '@/components/AuthSlideshow'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères.')
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    })
    setLoading(false)

    if (error) {
      if (error.message === 'User already registered') {
        setError('Un compte existe déjà avec cet email.')
      } else if (error.message === 'email rate limit exceeded') {
        setError("Trop de tentatives d'inscription en peu de temps. Merci de patienter quelques minutes avant de réessayer.")
      } else if (error.message?.toLowerCase().includes('invalid') && error.message?.toLowerCase().includes('email')) {
        setError("Cette adresse email n'est pas acceptée. Vérifiez qu'elle est correctement écrite.")
      } else {
        setError("Une erreur est survenue. Réessayez.")
      }
      return
    }

    setSuccess(true)
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <AuthSlideshow />

        <svg className="pat-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{ opacity: '.5' }}>
          <defs><pattern id="auth-pat-register" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <polygon points="20,1 39,20 20,39 1,20" fill="none" stroke="#fff" strokeWidth=".7" opacity=".2" />
            <polygon points="20,9 31,20 20,31 9,20" fill="none" stroke="#E8A020" strokeWidth=".5" opacity=".25" />
            <circle cx="20" cy="20" r="1.5" fill="#E8A020" opacity=".3" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#auth-pat-register)" />
        </svg>

        <Link href="/" className="auth-logo">
          <span className="nf">F</span>actura
        </Link>

        <div className="auth-visual-mid">
          <div className="auth-visual-text">
            <div className="auth-quote">
              Arrêtez de courir<br />après vos <em>paiements.</em>
            </div>
            <p className="auth-subtext">
              Créez votre compte pour essayer Factura pendant la bêta.
            </p>
            <div className="auth-trust">
              <div className="stars">★★★★★</div>
              <span>Version bêta</span>
            </div>
          </div>
          <PhoneMockup />
        </div>

        <Link href="/" className="auth-back">← Retour à l&apos;accueil</Link>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          {success ? (
            <>
              <div className="auth-card-title">Vérifiez vos emails</div>
              <div className="auth-success">
                Un email de confirmation a été envoyé à <strong>{email}</strong>. Cliquez sur le lien pour activer votre compte, puis connectez-vous.
              </div>
              <div className="auth-switch">
                <Link href="/login">Retour à la connexion</Link>
              </div>
            </>
          ) : (
            <>
              <div className="auth-card-title">Créer un compte</div>
              <div className="auth-card-sub">Version bêta — conditions et tarifs à venir.</div>

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
                    placeholder="12 caractères minimum"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="auth-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? 'Création...' : 'Créer mon compte'}
                </button>
              </form>

              <div className="auth-switch">
                Déjà un compte ? <Link href="/login">Se connecter</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
