"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const emptyForm = {
  payment_provider: 'factura_default',
  fedapay_public_key: '',
  fedapay_secret_key_encrypted: '',
  cinetpay_site_id: '',
  cinetpay_api_key_encrypted: '',
  messaging_provider: 'factura_default',
  twilio_account_sid: '',
  twilio_auth_token_encrypted: '',
  twilio_whatsapp_number: '',
  termii_api_key_encrypted: '',
}

export default function IntegrationsPage() {
  const [form, setForm] = useState(emptyForm)
  const [secretState, setSecretState] = useState({})
  const [hasLegacySecrets, setHasLegacySecrets] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('Votre session a expiré. Reconnectez-vous.')
      setLoading(false)
      return
    }
    const response = await fetch('/api/integrations', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) setError(result.error || 'Impossible de charger les intégrations.')
    else {
      setForm({ ...emptyForm, ...result.settings })
      setSecretState(result.secrets || {})
      setHasLegacySecrets(Object.values(result.secrets || {}).some((secret) => secret.legacy))
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setSaving(false)
      setError('Votre session a expiré. Reconnectez-vous.')
      return
    }
    const response = await fetch('/api/integrations', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(form),
    })
    const result = await response.json().catch(() => ({}))

    setSaving(false)

    if (!response.ok) {
      setError(result.error || 'Impossible d’enregistrer les intégrations.')
      return
    }

    setForm((current) => ({
      ...current,
      ...Object.fromEntries(Object.keys(emptyForm).filter((key) => key.endsWith('_encrypted')).map((key) => [key, ''])),
    }))
    await loadSettings()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  if (loading) return <div className="ig-loading">Chargement...</div>

  return (
    <div className="ig">
      <style>{INTEGRATIONS_CSS}</style>

      <div className="ig-header">
        <h1 className="ig-title">Intégrations</h1>
        <p className="ig-subtitle">
          Connectez vos propres clés API, ou utilisez celles de Factura (commission de 1,5% par paiement encaissé).
        </p>
      </div>

      <div className="ig-warning">
        Les clés secrètes sont chiffrées côté serveur avant stockage et ne sont jamais renvoyées à cette page.
        {hasLegacySecrets && ' Certaines anciennes clés ne sont pas chiffrées : configurez le chiffrement serveur et remplacez-les.'}
      </div>
      {error && <div className="ig-error">{error}</div>}
      {success && <div className="ig-success">✓ Intégrations enregistrées avec succès.</div>}

      <form onSubmit={handleSubmit} className="ig-form">
        {/* Passerelle de paiement */}
        <div className="ig-panel">
          <div className="ig-panel-title">Passerelle de paiement</div>

          <div className="ig-choice-row">
            {[
              { value: 'factura_default', label: 'Utiliser les clés Factura', hint: 'Commission 1,5%' },
              { value: 'fedapay', label: 'FedaPay', hint: 'Mes propres clés' },
              { value: 'cinetpay', label: 'CinetPay', hint: 'Mes propres clés' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`ig-choice ${form.payment_provider === opt.value ? 'active' : ''}`}
                onClick={() => setForm({ ...form, payment_provider: opt.value })}
              >
                <div className="ig-choice-label">{opt.label}</div>
                <div className="ig-choice-hint">{opt.hint}</div>
              </button>
            ))}
          </div>

          {form.payment_provider === 'fedapay' && (
            <div className="ig-subfields">
              <div className="ig-field">
                <label className="ig-label">Clé API publique</label>
                <input className="ig-input" value={form.fedapay_public_key || ''} onChange={update('fedapay_public_key')} placeholder="pk_live_..." />
              </div>
              <div className="ig-field">
                <label className="ig-label">Clé API secrète</label>
                <input type="password" className="ig-input" autoComplete="new-password" value={form.fedapay_secret_key_encrypted || ''} onChange={update('fedapay_secret_key_encrypted')} placeholder={secretState.fedapay_secret_key_encrypted?.saved ? 'Clé enregistrée, saisissez pour la remplacer' : 'sk_live_...'} />
              </div>
            </div>
          )}

          {form.payment_provider === 'cinetpay' && (
            <div className="ig-subfields">
              <div className="ig-field">
                <label className="ig-label">Site ID</label>
                <input className="ig-input" value={form.cinetpay_site_id || ''} onChange={update('cinetpay_site_id')} placeholder="123456" />
              </div>
              <div className="ig-field">
                <label className="ig-label">Clé API</label>
                <input type="password" className="ig-input" autoComplete="new-password" value={form.cinetpay_api_key_encrypted || ''} onChange={update('cinetpay_api_key_encrypted')} placeholder={secretState.cinetpay_api_key_encrypted?.saved ? 'Clé enregistrée, saisissez pour la remplacer' : '...'} />
              </div>
            </div>
          )}

          <div className="ig-test-row">
            <button type="button" className="ig-btn-ghost" disabled={form.payment_provider === 'factura_default'}>
              Tester la connexion
            </button>
          </div>
        </div>

        {/* Messagerie */}
        <div className="ig-panel">
          <div className="ig-panel-title">Messagerie (WhatsApp)</div>

          <div className="ig-choice-row">
            {[
              { value: 'factura_default', label: 'Utiliser les clés Factura', hint: 'Simple, sans config' },
              { value: 'twilio', label: 'Twilio', hint: 'Mes propres clés' },
              { value: 'termii', label: 'Termii', hint: 'Mes propres clés' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`ig-choice ${form.messaging_provider === opt.value ? 'active' : ''}`}
                onClick={() => setForm({ ...form, messaging_provider: opt.value })}
              >
                <div className="ig-choice-label">{opt.label}</div>
                <div className="ig-choice-hint">{opt.hint}</div>
              </button>
            ))}
          </div>

          {form.messaging_provider === 'twilio' && (
            <div className="ig-subfields">
              <div className="ig-field">
                <label className="ig-label">Account SID</label>
                <input className="ig-input" value={form.twilio_account_sid || ''} onChange={update('twilio_account_sid')} placeholder="AC..." />
              </div>
              <div className="ig-field">
                <label className="ig-label">Auth Token</label>
                <input type="password" className="ig-input" autoComplete="new-password" value={form.twilio_auth_token_encrypted || ''} onChange={update('twilio_auth_token_encrypted')} placeholder={secretState.twilio_auth_token_encrypted?.saved ? 'Clé enregistrée, saisissez pour la remplacer' : '...'} />
              </div>
              <div className="ig-field">
                <label className="ig-label">Numéro WhatsApp Business</label>
                <input className="ig-input" value={form.twilio_whatsapp_number || ''} onChange={update('twilio_whatsapp_number')} placeholder="+14155238886" />
              </div>
            </div>
          )}

          {form.messaging_provider === 'termii' && (
            <div className="ig-subfields">
              <div className="ig-field">
                <label className="ig-label">API Key</label>
                <input type="password" className="ig-input" autoComplete="new-password" value={form.termii_api_key_encrypted || ''} onChange={update('termii_api_key_encrypted')} placeholder={secretState.termii_api_key_encrypted?.saved ? 'Clé enregistrée, saisissez pour la remplacer' : '...'} />
              </div>
            </div>
          )}

          <div className="ig-test-row">
            <button type="button" className="ig-btn-ghost" disabled={form.messaging_provider === 'factura_default'}>
              Tester la connexion
            </button>
          </div>
        </div>

        <button type="submit" className="ig-btn-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer les intégrations'}
        </button>
      </form>
    </div>
  )
}

const INTEGRATIONS_CSS = `
.ig-loading { color: var(--pierre); font-size: 14px; padding: 40px 0; }
.ig-header { margin-bottom: 20px; }
.ig-title { font-family: var(--fd); font-size: 26px; font-weight: 800; color: var(--nuit); margin-bottom: 6px; }
.ig-subtitle { font-size: 14px; color: var(--pierre); max-width: 560px; }

.ig-warning {
  background: var(--gold-lt); color: #8a5c10; border: 1px solid rgba(232,160,32,.3);
  border-radius: 10px; padding: 12px 16px; font-size: 12.5px; line-height: 1.5;
  margin-bottom: 20px; max-width: 640px;
}
.ig-error { background: var(--terra-lt); color: var(--terra); border-radius: 9px; padding: 12px 16px; font-size: 13.5px; margin-bottom: 20px; }
.ig-success { background: var(--savane); color: var(--forest); border-radius: 9px; padding: 12px 16px; font-size: 13.5px; margin-bottom: 20px; }

.ig-form { display: flex; flex-direction: column; gap: 20px; max-width: 640px; }
.ig-panel { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
.ig-panel-title { font-family: var(--fd); font-size: 14px; font-weight: 700; color: var(--nuit); margin-bottom: 16px; }

.ig-choice-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.ig-choice {
  background: var(--brume); border: 1.5px solid transparent; border-radius: 12px;
  padding: 12px 14px; text-align: left; cursor: pointer; font-family: var(--fb);
  transition: all .15s;
}
.ig-choice:hover { border-color: var(--border); }
.ig-choice.active { background: var(--savane); border-color: var(--forest); }
.ig-choice-label { font-size: 12.5px; font-weight: 700; color: var(--nuit); margin-bottom: 2px; }
.ig-choice-hint { font-size: 11px; color: var(--pierre); }

.ig-subfields { margin-top: 18px; display: flex; flex-direction: column; gap: 14px; }
.ig-field { display: flex; flex-direction: column; gap: 6px; }
.ig-label { font-size: 12.5px; font-weight: 600; color: var(--nuit); }
.ig-input {
  border: 1px solid var(--border); border-radius: 9px; padding: 10px 13px;
  font-size: 13.5px; font-family: var(--fm); outline: none; transition: border-color .15s;
}
.ig-input:focus { border-color: var(--forest); }

.ig-test-row { margin-top: 16px; }
.ig-btn-ghost {
  background: var(--brume); color: var(--nuit); border: none;
  border-radius: 9px; padding: 9px 16px; font-size: 12.5px; font-weight: 600;
  cursor: pointer; font-family: var(--fb);
}
.ig-btn-ghost:disabled { opacity: .5; cursor: not-allowed; }

.ig-btn-primary {
  background: var(--forest); color: #fff; border: none;
  border-radius: 10px; padding: 13px 24px; font-size: 14px; font-weight: 700;
  cursor: pointer; font-family: var(--fb); align-self: flex-start; transition: filter .15s;
}
.ig-btn-primary:hover { filter: brightness(1.1); }
.ig-btn-primary:disabled { opacity: .6; cursor: not-allowed; }

@media (max-width: 560px) {
  .ig-choice-row { grid-template-columns: 1fr; }
}
`
