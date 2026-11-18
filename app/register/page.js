"use client"

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import AuthShell, { AuthCard, AuthTitle, AuthError, TextField, PasswordField, SubmitButton } from '@/components/AuthShell'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accepted, setAccepted] = useState(false)
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
    if (!accepted) {
      setError('Vous devez accepter les conditions générales de vente et la politique de confidentialité.')
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
    <AuthShell>
      <AuthCard dark>
        {success ? (
          <>
            <AuthTitle dark title="Vérifiez vos e-mails" />
            <p style={{ margin: 0, color: '#C9D2EA', fontSize: 16 }}>
              Un e-mail de confirmation a été envoyé à <strong style={{ color: '#ffffff' }}>{email}</strong>. Cliquez sur le lien pour activer votre compte, puis connectez-vous.
            </p>
            <p style={{ margin: 0, fontSize: 15 }}>
              <Link href="/login" style={{ color: '#78B4FF', fontWeight: 700 }}>Retour à la connexion</Link>
            </p>
          </>
        ) : (
          <>
            <AuthTitle dark title="Créer un compte" sub="5 factures gratuites par mois · Sans carte · Annulation à tout moment" />

            <AuthError>{error}</AuthError>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <TextField
                id="email"
                dark
                label="Adresse e-mail"
                type="email"
                autoComplete="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <PasswordField
                id="password"
                dark
                label="Mot de passe"
                help="12 caractères minimum."
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <PasswordField
                id="confirmPassword"
                dark
                label="Confirmer le mot de passe"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  style={{ width: 22, height: 22, margin: '1px 0 0', accentColor: '#FFCC00', flex: 'none' }}
                />
                <span>J&apos;accepte les <a href="#" style={{ color: '#78B4FF', fontWeight: 600 }}>conditions générales de vente</a> et la <a href="#" style={{ color: '#78B4FF', fontWeight: 600 }}>politique de confidentialité</a>.</span>
              </label>

              <SubmitButton dark loading={loading}>{loading ? 'Création...' : 'Créer mon compte'}</SubmitButton>
            </form>

            <p style={{ margin: 0, fontSize: 14, color: '#C9D2EA' }}>
              Votre nom et le nom de votre entreprise vous seront demandés après, pas avant.
            </p>
            <p style={{ margin: 0, fontSize: 15, color: '#C9D2EA' }}>
              Déjà un compte ? <Link href="/login" style={{ color: '#78B4FF', fontWeight: 700 }}>Se connecter</Link>
            </p>
          </>
        )}
      </AuthCard>
    </AuthShell>
  )
}
