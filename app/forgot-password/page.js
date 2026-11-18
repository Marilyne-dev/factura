"use client"

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)
    if (resetError) {
      setError('Impossible d’envoyer le lien pour le moment. Réessayez plus tard.')
      return
    }
    setMessage('Si cette adresse correspond à un compte, un lien de réinitialisation lui sera envoyé.')
  }

  return (
    <main className="auth-form-side">
      <div className="auth-card">
        <h1 className="auth-card-title">Mot de passe oublié</h1>
        <p className="auth-card-sub">Recevez un lien pour choisir un nouveau mot de passe.</p>
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Adresse e-mail</label>
            <input id="email" type="email" className="auth-input" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>
        <div className="auth-switch"><Link href="/login">Retour à la connexion</Link></div>
      </div>
    </main>
  )
}
