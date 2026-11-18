"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AuthShell, { AuthCard, AuthTitle, AuthError, TextField, PasswordField, SubmitButton } from '@/components/AuthShell'

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
    <AuthShell>
      <AuthCard>
        <AuthTitle title="Se connecter" sub="Retrouvez vos factures et vos relances." />

        <AuthError>{error}</AuthError>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <TextField
            id="email"
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
            label="Mot de passe"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            labelRight={<Link href="/forgot-password" style={{ fontSize: 14, fontWeight: 700 }}>Mot de passe oublié ?</Link>}
          />

          <SubmitButton loading={loading}>{loading ? 'Connexion...' : 'Se connecter'}</SubmitButton>
        </form>

        <p style={{ margin: 0, fontSize: 15, color: '#4A5575' }}>
          Pas encore de compte ? <Link href="/register" style={{ fontWeight: 700 }}>Créer ma première facture</Link>
        </p>
      </AuthCard>
    </AuthShell>
  )
}
