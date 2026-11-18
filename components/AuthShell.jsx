'use client'

import { useState } from 'react'
import Link from 'next/link'
import '../app/auth.css'

const outfit = "'Outfit',sans-serif"

/* En-tête bleu nuit + zone centrale, communs à /login et /register */
export default function AuthShell({ children }) {
  return (
    <div className="au">
      <header style={{ background: '#0D1B3E' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/" aria-label="Factura, accueil" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#ffffff' }}>
            <span style={{ width: 36, height: 36, borderRadius: 8, background: '#FFCC00', color: '#0D1B3E', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"></path><path d="M10 14l2 2 3.5-4"></path></svg>
            </span>
            <span style={{ fontFamily: outfit, fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>Factura</span>
          </Link>
          <span style={{ color: '#C9D2EA', fontSize: 14 }}>Envoyez la facture. On s&apos;occupe du reste.</span>
        </div>
      </header>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 72px', boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }}>
        {children}
      </main>
    </div>
  )
}

export function AuthCard({ dark, children }) {
  return (
    <section style={{
      flex: '1 1 440px', maxWidth: 520, minWidth: 0, boxSizing: 'border-box',
      background: dark ? '#0D1B3E' : '#ffffff', color: dark ? '#ffffff' : '#0D1B3E',
      border: dark ? 'none' : '1px solid #E3E0D5', borderRadius: 16, padding: 40,
      display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      {children}
    </section>
  )
}

export function AuthTitle({ dark, title, sub }) {
  return (
    <div>
      <h1 style={{ margin: 0, fontFamily: outfit, fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{title}</h1>
      {sub && <p style={{ margin: '6px 0 0', color: dark ? '#C9D2EA' : '#4A5575' }}>{sub}</p>}
    </div>
  )
}

export function AuthError({ children }) {
  if (!children) return null
  return (
    <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, fontWeight: 600, padding: '12px 14px', borderRadius: 8, background: '#F9E0E0', color: '#A52A2A' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none', marginTop: 2 }}><path d="M12 4l9 16H3z"></path><path d="M12 10v4"></path><path d="M12 17h.01"></path></svg>
      <span>{children}</span>
    </div>
  )
}

const inputBase = (dark) => ({
  height: 48, padding: '0 14px', border: `1.5px solid ${dark ? '#C9D2EA' : '#6B7490'}`, borderRadius: 8,
  fontFamily: "'Inter',sans-serif", fontSize: 16, color: '#0D1B3E', background: '#ffffff',
  boxSizing: 'border-box', width: '100%',
})

export function TextField({ id, label, dark, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 14, fontWeight: 600 }}>{label}</label>
      <input id={id} style={inputBase(dark)} {...props} />
    </div>
  )
}

export function PasswordField({ id, label, dark, help, labelRight, ...props }) {
  const [shown, setShown] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <label htmlFor={id} style={{ fontSize: 14, fontWeight: 600 }}>{label}</label>
        {labelRight}
      </div>
      <div style={{ position: 'relative' }}>
        <input id={id} type={shown ? 'text' : 'password'} aria-describedby={help ? id + '-aide' : undefined} style={{ ...inputBase(dark), padding: '0 96px 0 14px' }} {...props} />
        <button type="button" onClick={() => setShown(!shown)} aria-label={shown ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          style={{ position: 'absolute', right: 6, top: 6, height: 36, padding: '0 12px', border: 0, borderRadius: 6, background: 'transparent', color: '#0D1B3E', fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          {shown ? 'Masquer' : 'Afficher'}
        </button>
      </div>
      {help && <div id={id + '-aide'} style={{ fontSize: 14, color: dark ? '#C9D2EA' : '#4A5575' }}>{help}</div>}
    </div>
  )
}

export function SubmitButton({ dark, loading, children }) {
  return (
    <button type="submit" disabled={loading}
      style={{ height: 48, border: dark ? 0 : '2px solid #0D1B3E', borderRadius: 8, background: '#FFCC00', color: '#0D1B3E', fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>
      {children}
    </button>
  )
}
