"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && (event === 'PASSWORD_RECOVERY' || session)) setReady(true)
    })
    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setReady(true)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (password.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères.')
      return
    }
    if (password !== confirmation) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (updateError) {
      setError('Le lien est invalide ou a expiré. Demandez-en un nouveau.')
      return
    }
    await supabase.auth.signOut()
    router.replace('/login?password-reset=success')
  }

  return (
    <main className="auth-form-side">
      <div className="auth-card">
        <h1 className="auth-card-title">Nouveau mot de passe</h1>
        <p className="auth-card-sub">Choisissez un mot de passe d’au moins 12 caractères.</p>
        {!ready ? (
          <div className="auth-error">Ouvrez le lien reçu par e-mail ou <Link href="/forgot-password">demandez-en un nouveau</Link>.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Nouveau mot de passe</label>
              <input id="password" type="password" className="auth-input" autoComplete="new-password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="confirmation">Confirmer le mot de passe</label>
              <input id="confirmation" type="password" className="auth-input" autoComplete="new-password" minLength={12} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Mise à jour...' : 'Enregistrer le mot de passe'}
            </button>
          </form>
        )}
        <div className="auth-switch"><Link href="/login">Retour à la connexion</Link></div>
      </div>
    </main>
  )
}
