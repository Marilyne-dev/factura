"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const COUNTRIES = [
  'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso',
  'Niger', 'Bénin', 'Togo', 'Guinée-Bissau',
]

const emptyForm = {
  name: '', address: '', phone: '', country: '',
  bank_details: '', mobile_money_number: '', logo_url: '',
}

export default function ProfileSettingsPage() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState('')
  const fileInputRef = useRef(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const { data } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (data) {
      setForm({
        name: data.name || '',
        address: data.address || '',
        phone: data.phone || '',
        country: data.country || '',
        bank_details: data.bank_details || '',
        mobile_money_number: data.mobile_money_number || '',
        logo_url: data.logo_url || '',
      })
      setLogoPreview(data.logo_url || '')
    }
    setLoading(false)
  }

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    // Validation : max 2MB, JPG/PNG (règle métier US-003)
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Le logo doit être au format JPG ou PNG.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Le logo ne doit pas dépasser 2MB.')
      return
    }

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/logo.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setUploading(false)
      setError("Échec de l'upload du logo. Vérifiez que le bucket 'company-logos' existe dans Supabase Storage.")
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(path)

    setForm((f) => ({ ...f, logo_url: publicUrlData.publicUrl }))
    setLogoPreview(publicUrlData.publicUrl)
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!form.name.trim()) {
      setError("Le nom de l'entreprise est obligatoire.")
      return
    }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      address: form.address.trim() || null,
      phone: form.phone.trim() || null,
      country: form.country || null,
      bank_details: form.bank_details.trim() || null,
      mobile_money_number: form.mobile_money_number.trim() || null,
      logo_url: form.logo_url || null,
      currency: 'XOF',
    }

    // upsert car un seul profil par utilisateur (unique(user_id) en base)
    const { error: upsertError } = await supabase
      .from('companies')
      .upsert(payload, { onConflict: 'user_id' })

    setSaving(false)

    if (upsertError) {
      setError("Une erreur est survenue lors de l'enregistrement. Réessayez.")
      return
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (loading) {
    return <div className="pf-loading">Chargement du profil...</div>
  }

  return (
    <div className="pf">
      <style>{PROFILE_CSS}</style>

      <div className="pf-header">
        <h1 className="pf-title">Profil entreprise</h1>
        <p className="pf-subtitle">
          Ces informations apparaîtront sur vos factures envoyées aux clients.
        </p>
      </div>

      {error && <div className="pf-error">{error}</div>}
      {success && <div className="pf-success">✓ Profil enregistré avec succès.</div>}

      <form onSubmit={handleSubmit} className="pf-form">
        {/* Logo */}
        <div className="pf-panel">
          <div className="pf-panel-title">Logo</div>
          <div className="pf-logo-row">
            <div className="pf-logo-preview">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo entreprise" />
              ) : (
                <span className="pf-logo-placeholder">Aucun logo</span>
              )}
            </div>
            <div>
              <button
                type="button"
                className="pf-btn-ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Envoi...' : logoPreview ? 'Changer le logo' : 'Ajouter un logo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleLogoChange}
                hidden
              />
              <p className="pf-hint">JPG ou PNG, 2MB maximum.</p>
            </div>
          </div>
        </div>

        {/* Infos générales */}
        <div className="pf-panel">
          <div className="pf-panel-title">Informations générales</div>

          <div className="pf-field">
            <label className="pf-label">Nom de l&apos;entreprise *</label>
            <input
              className="pf-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Agence Créative SARL"
              required
            />
          </div>

          <div className="pf-field">
            <label className="pf-label">Adresse complète</label>
            <input
              className="pf-input"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Rue 12, Cocody, Abidjan"
            />
          </div>

          <div className="pf-row">
            <div className="pf-field">
              <label className="pf-label">Téléphone professionnel</label>
              <input
                className="pf-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+225 07 12 34 56 78"
              />
            </div>

            <div className="pf-field">
              <label className="pf-label">Pays</label>
              <select
                className="pf-input"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              >
                <option value="">Sélectionner...</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Coordonnées de paiement */}
        <div className="pf-panel">
          <div className="pf-panel-title">Coordonnées de paiement</div>

          <div className="pf-field">
            <label className="pf-label">Coordonnées bancaires (IBAN ou RIB local)</label>
            <textarea
              className="pf-input pf-textarea"
              value={form.bank_details}
              onChange={(e) => setForm({ ...form, bank_details: e.target.value })}
              placeholder="Banque, numéro de compte, RIB..."
              rows={3}
            />
          </div>

          <div className="pf-field">
            <label className="pf-label">Numéro Mobile Money</label>
            <input
              className="pf-input"
              value={form.mobile_money_number}
              onChange={(e) => setForm({ ...form, mobile_money_number: e.target.value })}
              placeholder="Orange Money, MTN MoMo, Moov Money..."
            />
          </div>

          <div className="pf-field">
            <label className="pf-label">Devise</label>
            <input className="pf-input" value="XOF (Franc CFA)" disabled />
          </div>
        </div>

        <button type="submit" className="pf-btn-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer le profil'}
        </button>
      </form>
    </div>
  )
}

const PROFILE_CSS = `
.pf-loading { color: var(--pierre); font-size: 14px; padding: 40px 0; }

.pf-header { margin-bottom: 24px; }
.pf-title { font-family: var(--fd); font-size: 26px; font-weight: 800; color: var(--nuit); margin-bottom: 6px; }
.pf-subtitle { font-size: 14px; color: var(--pierre); }

.pf-error {
  background: var(--terra-lt); color: var(--terra);
  border-radius: 9px; padding: 12px 16px; font-size: 13.5px; margin-bottom: 20px;
}
.pf-success {
  background: var(--savane); color: var(--forest);
  border-radius: 9px; padding: 12px 16px; font-size: 13.5px; margin-bottom: 20px;
}

.pf-form { display: flex; flex-direction: column; gap: 20px; max-width: 640px; }
.pf-panel {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 16px; padding: 24px;
}
.pf-panel-title {
  font-family: var(--fd); font-size: 14px; font-weight: 700;
  color: var(--nuit); margin-bottom: 18px;
}

.pf-logo-row { display: flex; align-items: center; gap: 20px; }
.pf-logo-preview {
  width: 80px; height: 80px; border-radius: 14px;
  background: var(--brume); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}
.pf-logo-preview img { width: 100%; height: 100%; object-fit: contain; }
.pf-logo-placeholder { font-size: 10.5px; color: var(--pierre); text-align: center; padding: 0 8px; }
.pf-hint { font-size: 11.5px; color: var(--pierre); margin-top: 8px; }

.pf-field { margin-bottom: 16px; }
.pf-field:last-child { margin-bottom: 0; }
.pf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pf-label { display: block; font-size: 12.5px; font-weight: 600; color: var(--nuit); margin-bottom: 6px; }
.pf-input {
  width: 100%; border: 1px solid var(--border); border-radius: 9px;
  padding: 10px 13px; font-size: 14px; font-family: var(--fb);
  outline: none; transition: border-color .15s; background: var(--white);
}
.pf-input:focus { border-color: var(--forest); }
.pf-input:disabled { background: var(--brume); color: var(--pierre); }
.pf-textarea { resize: vertical; }

.pf-btn-ghost {
  background: var(--brume); color: var(--nuit); border: none;
  border-radius: 9px; padding: 10px 18px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: var(--fb);
}
.pf-btn-ghost:disabled { opacity: .6; cursor: not-allowed; }
.pf-btn-primary {
  background: var(--forest); color: #fff; border: none;
  border-radius: 10px; padding: 13px 24px; font-size: 14px; font-weight: 700;
  cursor: pointer; font-family: var(--fb); align-self: flex-start;
  transition: filter .15s;
}
.pf-btn-primary:hover { filter: brightness(1.1); }
.pf-btn-primary:disabled { opacity: .6; cursor: not-allowed; }

@media (max-width: 560px) {
  .pf-row { grid-template-columns: 1fr; }
}
`