"use client"

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

const emptyForm = { id: null, full_name: '', company_name: '', email: '', whatsapp_number: '', notes: '' }

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setClients(data || [])
    setLoading(false)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.company_name?.toLowerCase().includes(q)
    )
  }, [clients, search])

  const openCreate = () => {
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (client) => {
    setForm(client)
    setFormError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
  }

  // Validation simple du format international (+225 07 XX XX XX XX)
  const isValidWhatsapp = (value) => {
    if (!value) return true // optionnel
    return /^\+\d{7,15}$/.test(value.replace(/\s/g, ''))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!form.full_name.trim()) {
      setFormError('Le nom complet est obligatoire.')
      return
    }
    if (form.whatsapp_number && !isValidWhatsapp(form.whatsapp_number)) {
      setFormError('Le numéro WhatsApp doit être au format international, ex : +225 07 12 34 56 78.')
      return
    }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      user_id: user.id,
      full_name: form.full_name.trim(),
      company_name: form.company_name?.trim() || null,
      email: form.email?.trim() || null,
      whatsapp_number: form.whatsapp_number?.trim() || null,
      notes: form.notes?.trim() || null,
    }

    let error
    if (form.id) {
      ;({ error } = await supabase.from('clients').update(payload).eq('id', form.id))
    } else {
      ;({ error } = await supabase.from('clients').insert(payload))
    }

    setSaving(false)

    if (error) {
      if (error.code === '23505') {
        setFormError('Un client avec cet email existe déjà dans votre annuaire.')
      } else {
        setFormError("Une erreur est survenue. Réessayez.")
      }
      return
    }

    setModalOpen(false)
    loadClients()
  }

  const confirmDelete = async () => {
    setDeleteError('')

    // Vérification : impossible si factures actives liées (règle métier US-005)
    const { data: activeInvoices } = await supabase
      .from('invoices')
      .select('id')
      .eq('client_id', deleteTarget.id)
      .limit(1)

    if (activeInvoices && activeInvoices.length > 0) {
      setDeleteError('Impossible de supprimer ce client : des factures lui sont associées. Archivez-les ou supprimez-les d’abord.')
      return
    }

    const { error } = await supabase.from('clients').delete().eq('id', deleteTarget.id)
    if (error) {
      setDeleteError("Une erreur est survenue. Réessayez.")
      return
    }

    setDeleteTarget(null)
    loadClients()
  }

  return (
    <div className="cl">
      <style>{CLIENTS_CSS}</style>

      <div className="cl-header">
        <div>
          <h1 className="cl-title">Clients</h1>
          <p className="cl-subtitle">Votre annuaire de clients pour la facturation.</p>
        </div>
        <button className="cl-cta" onClick={openCreate}>+ Nouveau client</button>
      </div>

      <input
        type="text"
        className="cl-search"
        placeholder="Rechercher par nom, email ou entreprise..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="cl-loading">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="cl-empty">
          <div className="cl-empty-emoji">👥</div>
          <h2 className="cl-empty-title">
            {search ? 'Aucun résultat' : 'Aucun client pour le moment'}
          </h2>
          <p className="cl-empty-text">
            {search
              ? 'Essayez une autre recherche.'
              : "Ajoutez votre premier client pour pouvoir créer une facture."}
          </p>
          {!search && (
            <button className="cl-cta" onClick={openCreate}>+ Ajouter un client</button>
          )}
        </div>
      ) : (
        <div className="cl-list">
          {filtered.map((c) => (
            <div className="cl-card" key={c.id}>
              <div className="cl-card-avatar">{c.full_name.charAt(0).toUpperCase()}</div>
              <div className="cl-card-info">
                <div className="cl-card-name">{c.full_name}</div>
                {c.company_name && <div className="cl-card-company">{c.company_name}</div>}
                <div className="cl-card-meta">
                  {c.email && <span>{c.email}</span>}
                  {c.whatsapp_number && <span>{c.whatsapp_number}</span>}
                </div>
              </div>
              <div className="cl-card-actions">
                <button className="cl-icon-btn" onClick={() => openEdit(c)} title="Modifier">✏️</button>
                <button className="cl-icon-btn" onClick={() => { setDeleteTarget(c); setDeleteError('') }} title="Supprimer">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal création / édition */}
      {modalOpen && (
        <div className="cl-modal-overlay" onClick={closeModal}>
          <div className="cl-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="cl-modal-title">{form.id ? 'Modifier le client' : 'Nouveau client'}</h2>

            {formError && <div className="cl-error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="cl-field">
                <label className="cl-label">Nom complet *</label>
                <input
                  className="cl-input"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Awa Diallo"
                  required
                />
              </div>

              <div className="cl-field">
                <label className="cl-label">Entreprise</label>
                <input
                  className="cl-input"
                  value={form.company_name || ''}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  placeholder="Agence Créative"
                />
              </div>

              <div className="cl-field">
                <label className="cl-label">Email</label>
                <input
                  type="email"
                  className="cl-input"
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="awa@entreprise.com"
                />
              </div>

              <div className="cl-field">
                <label className="cl-label">Numéro WhatsApp</label>
                <input
                  className="cl-input"
                  value={form.whatsapp_number || ''}
                  onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                  placeholder="+225 07 12 34 56 78"
                />
              </div>

              <div className="cl-field">
                <label className="cl-label">Notes internes</label>
                <textarea
                  className="cl-input cl-textarea"
                  value={form.notes || ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Non visible par le client"
                  rows={3}
                />
              </div>

              <div className="cl-modal-actions">
                <button type="button" className="cl-btn-ghost" onClick={closeModal} disabled={saving}>Annuler</button>
                <button type="submit" className="cl-btn-primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : form.id ? 'Enregistrer' : 'Créer le client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {deleteTarget && (
        <div className="cl-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="cl-modal cl-modal-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="cl-modal-title">Supprimer {deleteTarget.full_name} ?</h2>
            <p className="cl-modal-text">Cette action est irréversible.</p>
            {deleteError && <div className="cl-error">{deleteError}</div>}
            <div className="cl-modal-actions">
              <button className="cl-btn-ghost" onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button className="cl-btn-terra" onClick={confirmDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CLIENTS_CSS = `
.cl-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 24px;
}
.cl-title { font-family: var(--fd); font-size: 26px; font-weight: 800; color: var(--nuit); margin-bottom: 6px; }
.cl-subtitle { font-size: 14px; color: var(--pierre); }
.cl-cta {
  background: var(--gold); color: var(--nuit); font-weight: 700; font-size: 13.5px;
  border: none; border-radius: 10px; padding: 12px 20px; cursor: pointer;
  white-space: nowrap; transition: filter .15s; font-family: var(--fb);
}
.cl-cta:hover { filter: brightness(.93); }

.cl-search {
  width: 100%; max-width: 380px;
  border: 1px solid var(--border); border-radius: 10px;
  padding: 11px 14px; font-size: 14px; font-family: var(--fb);
  margin-bottom: 24px; outline: none; transition: border-color .15s;
}
.cl-search:focus { border-color: var(--forest); }

.cl-loading { color: var(--pierre); font-size: 14px; padding: 40px 0; text-align: center; }

.cl-list { display: flex; flex-direction: column; gap: 10px; }
.cl-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--white); border: 1px solid var(--border);
  border-radius: 14px; padding: 16px 18px;
}
.cl-card-avatar {
  width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
  background: var(--savane); color: var(--forest);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--fd); font-weight: 700; font-size: 15px;
}
.cl-card-info { flex: 1; min-width: 0; }
.cl-card-name { font-size: 14.5px; font-weight: 600; color: var(--nuit); }
.cl-card-company { font-size: 12.5px; color: var(--pierre); margin-top: 1px; }
.cl-card-meta { display: flex; gap: 14px; margin-top: 6px; font-size: 12px; color: var(--pierre); flex-wrap: wrap; }
.cl-card-actions { display: flex; gap: 6px; flex-shrink: 0; }
.cl-icon-btn {
  background: var(--brume); border: none; border-radius: 8px;
  width: 34px; height: 34px; cursor: pointer; font-size: 14px;
  transition: background .15s;
}
.cl-icon-btn:hover { background: var(--savane); }

.cl-empty {
  background: var(--white); border: 1px dashed var(--border);
  border-radius: 16px; padding: 60px 30px; text-align: center;
}
.cl-empty-emoji { font-size: 34px; margin-bottom: 12px; }
.cl-empty-title { font-family: var(--fd); font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.cl-empty-text { font-size: 13.5px; color: var(--pierre); max-width: 360px; margin: 0 auto 22px; line-height: 1.6; }

.cl-modal-overlay {
  position: fixed; inset: 0; background: rgba(10,15,13,.5);
  display: flex; align-items: center; justify-content: center;
  padding: 20px; z-index: 100;
}
.cl-modal {
  background: var(--white); border-radius: 18px; padding: 32px;
  width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto;
}
.cl-modal-sm { max-width: 380px; }
.cl-modal-title { font-family: var(--fd); font-size: 18px; font-weight: 700; color: var(--nuit); margin-bottom: 18px; }
.cl-modal-text { font-size: 13.5px; color: var(--pierre); margin-bottom: 16px; }

.cl-field { margin-bottom: 16px; }
.cl-label { display: block; font-size: 12.5px; font-weight: 600; color: var(--nuit); margin-bottom: 6px; }
.cl-input {
  width: 100%; border: 1px solid var(--border); border-radius: 9px;
  padding: 10px 13px; font-size: 14px; font-family: var(--fb);
  outline: none; transition: border-color .15s;
}
.cl-input:focus { border-color: var(--forest); }
.cl-textarea { resize: vertical; }

.cl-error {
  background: var(--terra-lt); color: var(--terra);
  border-radius: 9px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px;
}

.cl-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; }
.cl-btn-ghost {
  background: var(--brume); color: var(--nuit); border: none;
  border-radius: 9px; padding: 10px 18px; font-size: 13.5px; font-weight: 600;
  cursor: pointer; font-family: var(--fb);
}
.cl-btn-primary {
  background: var(--forest); color: #fff; border: none;
  border-radius: 9px; padding: 10px 18px; font-size: 13.5px; font-weight: 600;
  cursor: pointer; font-family: var(--fb); transition: filter .15s;
}
.cl-btn-primary:hover { filter: brightness(1.1); }
.cl-btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.cl-btn-terra {
  background: var(--terra); color: #fff; border: none;
  border-radius: 9px; padding: 10px 18px; font-size: 13.5px; font-weight: 600;
  cursor: pointer; font-family: var(--fb);
}
`
