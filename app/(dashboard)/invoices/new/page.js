"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  addDaysToDateInputValue,
  createInvoiceNumber,
  getInvoiceDraftError,
  toDateInputValue,
} from '@/lib/invoice-utils.mjs'

const formatXOF = (amount) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(amount || 0)) + ' XOF'

const emptyLine = () => ({
  key: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unit_price: 0,
})

const todayISO = () => toDateInputValue()
const addDaysISO = (days) => addDaysToDateInputValue(days)

export default function NewInvoicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [clientId, setClientId] = useState('')
  const [issueDate, setIssueDate] = useState(todayISO())
  const [dueDate, setDueDate] = useState(addDaysISO(14))
  const [lines, setLines] = useState([emptyLine()])
  const [taxRate, setTaxRate] = useState(0)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const init = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: clientList }, { data: company }] = await Promise.all([
      supabase.from('clients').select('id, full_name, company_name').eq('user_id', user.id).order('full_name'),
      supabase.from('companies').select('bank_details').eq('user_id', user.id).maybeSingle(),
    ])

    setClients(clientList || [])
    if (company?.bank_details) {
      setNotes(company.bank_details)
    }

    // Numéro auto-incrémenté FAC-2026-001 (US-006)
    setInvoiceNumber(createInvoiceNumber())

    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts asynchronous invoice form initialization.
    void init()
  }, [init])

  const updateLine = (key, field, value) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, [field]: value } : l)))
  }

  const addLine = () => setLines((prev) => [...prev, emptyLine()])

  const removeLine = (key) => {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.key !== key) : prev))
  }

  const subtotal = Math.round(lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unit_price) || 0), 0))
  const taxAmount = Math.round(subtotal * ((Number(taxRate) || 0) / 100))
  const total = subtotal + taxAmount

  const validate = () => getInvoiceDraftError({ clientId, issueDate, dueDate, lines, taxRate })

  const handleSave = async (statusToSave) => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      setError('Votre session a expiré. Reconnectez-vous.')
      return
    }

    const { data: invoice, error: invError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        client_id: clientId,
        invoice_number: invoiceNumber,
        status: statusToSave,
        issue_date: issueDate,
        due_date: dueDate,
        subtotal,
        tax_rate: taxRate || 0,
        tax_amount: taxAmount,
        total_amount: total,
        notes: notes || null,
        sent_at: statusToSave === 'sent' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (invError) {
      setSaving(false)
      setError(
        invError.code === '23505'
          ? 'Ce numéro de facture existe déjà. Rechargez la page pour en générer un nouveau.'
          : "Une erreur est survenue lors de l'enregistrement."
      )
      return
    }

    const itemsPayload = lines
      .filter((l) => l.description.trim())
      .map((l, idx) => ({
        invoice_id: invoice.id,
        description: l.description.trim(),
        quantity: Number(l.quantity) || 0,
        unit_price: Number(l.unit_price) || 0,
        position: idx,
      }))

    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsPayload)

    setSaving(false)

    if (itemsError) {
      const { error: cleanupError } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoice.id)
        .eq('user_id', user.id)
      setSaving(false)
      setError(cleanupError
        ? 'La facture existe, mais ses lignes n’ont pas été enregistrées. Rechargez avant de continuer.'
        : 'Les lignes n’ont pas été enregistrées. La facture incomplète a été supprimée; réessayez.')
      return
    }
    router.push(`/invoices/${invoice.id}`)
  }

  if (loading) return <div className="ni-loading">Chargement...</div>

  return (
    <div className="ni">
      <style>{NEW_INVOICE_CSS}</style>

      <div className="ni-header">
        <div>
          <h1 className="ni-title">Nouvelle facture</h1>
          <p className="ni-subtitle">{invoiceNumber}</p>
        </div>
      </div>

      {clients.length === 0 && (
        <div className="ni-warning">
          Vous n&apos;avez encore aucun client. <a href="/clients">Ajoutez-en un</a> avant de créer une facture.
        </div>
      )}

      {error && <div className="ni-error">{error}</div>}

      <div className="ni-panel">
        <div className="ni-row-2">
          <div className="ni-field">
            <label className="ni-label">Client *</label>
            <select className="ni-input" value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">Sélectionner un client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}{c.company_name ? ` — ${c.company_name}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="ni-field">
            <label className="ni-label">N° de facture</label>
            <input className="ni-input" value={invoiceNumber} disabled />
          </div>
        </div>

        <div className="ni-row-2">
          <div className="ni-field">
            <label className="ni-label">Date d&apos;émission</label>
            <input type="date" className="ni-input" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          </div>
          <div className="ni-field">
            <label className="ni-label">Date d&apos;échéance *</label>
            <input type="date" className="ni-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
        </div>
      </div>

      <div className="ni-panel">
        <div className="ni-panel-title">Lignes d&apos;articles</div>

        <div className="ni-lines-head">
          <div>Description</div>
          <div>Qté</div>
          <div>Prix unitaire</div>
          <div>Sous-total</div>
          <div></div>
        </div>

        {lines.map((line) => {
          const lineTotal = (Number(line.quantity) || 0) * (Number(line.unit_price) || 0)
          return (
            <div className="ni-line" key={line.key}>
              <input
                className="ni-input"
                placeholder="Développement site vitrine..."
                value={line.description}
                onChange={(e) => updateLine(line.key, 'description', e.target.value)}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                className="ni-input ni-input-num"
                value={line.quantity}
                onChange={(e) => updateLine(line.key, 'quantity', e.target.value)}
              />
              <input
                type="number"
                min="0"
                step="1"
                className="ni-input ni-input-num"
                value={line.unit_price}
                onChange={(e) => updateLine(line.key, 'unit_price', e.target.value)}
              />
              <div className="ni-line-total">{formatXOF(lineTotal)}</div>
              <button type="button" className="ni-line-remove" onClick={() => removeLine(line.key)} disabled={lines.length === 1}>
                ✕
              </button>
            </div>
          )
        })}

        <button type="button" className="ni-add-line" onClick={addLine}>+ Ajouter une ligne</button>

        <div className="ni-totals">
          <div className="ni-totals-row">
            <span>Sous-total HT</span>
            <span>{formatXOF(subtotal)}</span>
          </div>
          <div className="ni-totals-row">
            <span>
              Taxe
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                className="ni-tax-input"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />%
            </span>
            <span>{formatXOF(taxAmount)}</span>
          </div>
          <div className="ni-totals-row ni-totals-final">
            <span>Total TTC</span>
            <span>{formatXOF(total)}</span>
          </div>
        </div>
      </div>

      <div className="ni-panel">
        <div className="ni-panel-title">Note de bas de page</div>
        <textarea
          className="ni-input ni-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Conditions de paiement, coordonnées bancaires..."
          rows={3}
        />
      </div>

      <div className="ni-actions">
        <button type="button" className="ni-btn-ghost" onClick={() => handleSave('draft')} disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer en brouillon'}
        </button>
        <button type="button" className="ni-btn-primary" onClick={() => handleSave('sent')} disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer et marquer envoyée'}
        </button>
      </div>
      <p className="ni-hint">
        L&apos;envoi automatique par WhatsApp/Email et la génération PDF seront branchés à l&apos;étape suivante — pour l&apos;instant cette action enregistre la facture et change son statut.
      </p>
    </div>
  )
}

const NEW_INVOICE_CSS = `
.ni-loading { color: var(--pierre); font-size: 14px; padding: 40px 0; }
.ni-header { margin-bottom: 20px; }
.ni-title { font-family: var(--fd); font-size: 26px; font-weight: 800; color: var(--nuit); margin-bottom: 4px; }
.ni-subtitle { font-family: var(--fm); font-size: 13px; color: var(--pierre); }

.ni-warning {
  background: var(--gold-lt); color: #8a5c10; border-radius: 10px;
  padding: 12px 16px; font-size: 13px; margin-bottom: 20px;
}
.ni-warning a { color: var(--forest); font-weight: 700; text-decoration: underline; }
.ni-error { background: var(--terra-lt); color: var(--terra); border-radius: 9px; padding: 12px 16px; font-size: 13.5px; margin-bottom: 20px; }

.ni-panel {
  background: var(--white); border: 1px solid var(--border); border-radius: 16px;
  padding: 24px; margin-bottom: 20px; max-width: 780px;
}
.ni-panel-title { font-family: var(--fd); font-size: 14px; font-weight: 700; color: var(--nuit); margin-bottom: 16px; }

.ni-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.ni-row-2:last-child { margin-bottom: 0; }
.ni-field { display: flex; flex-direction: column; gap: 6px; }
.ni-label { font-size: 12.5px; font-weight: 600; color: var(--nuit); }
.ni-input {
  border: 1px solid var(--border); border-radius: 9px; padding: 10px 13px;
  font-size: 13.5px; font-family: var(--fb); outline: none; transition: border-color .15s;
  width: 100%; background: var(--white);
}
.ni-input:focus { border-color: var(--forest); }
.ni-input:disabled { background: var(--brume); color: var(--pierre); }
.ni-textarea { resize: vertical; }

.ni-lines-head {
  display: grid; grid-template-columns: 1fr 70px 130px 120px 28px; gap: 10px;
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em;
  color: var(--pierre); margin-bottom: 8px; padding: 0 2px;
}
.ni-line {
  display: grid; grid-template-columns: 1fr 70px 130px 120px 28px; gap: 10px;
  align-items: center; margin-bottom: 8px;
}
.ni-input-num { text-align: right; font-family: var(--fm); }
.ni-line-total { font-family: var(--fm); font-size: 13px; text-align: right; color: var(--nuit); }
.ni-line-remove {
  background: none; border: none; color: var(--pierre); cursor: pointer;
  font-size: 14px; width: 24px; height: 24px;
}
.ni-line-remove:disabled { opacity: .3; cursor: not-allowed; }

.ni-add-line {
  background: var(--brume); border: none; border-radius: 8px;
  padding: 9px 16px; font-size: 12.5px; font-weight: 600; color: var(--forest);
  cursor: pointer; font-family: var(--fb); margin-top: 6px;
}

.ni-totals { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); }
.ni-totals-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13.5px; color: var(--pierre); padding: 6px 0;
}
.ni-totals-row span:first-child { display: flex; align-items: center; gap: 6px; }
.ni-tax-input {
  width: 50px; border: 1px solid var(--border); border-radius: 6px;
  padding: 3px 6px; font-size: 12.5px; font-family: var(--fm); text-align: right;
}
.ni-totals-final {
  font-family: var(--fd); font-size: 16px; font-weight: 800; color: var(--nuit);
  border-top: 1px solid var(--border); margin-top: 6px; padding-top: 12px;
}

.ni-actions { display: flex; gap: 10px; max-width: 780px; }
.ni-btn-ghost {
  background: var(--white); border: 1.5px solid var(--forest); color: var(--forest);
  border-radius: 10px; padding: 12px 22px; font-size: 13.5px; font-weight: 700;
  cursor: pointer; font-family: var(--fb);
}
.ni-btn-primary {
  background: var(--forest); color: #fff; border: none;
  border-radius: 10px; padding: 12px 22px; font-size: 13.5px; font-weight: 700;
  cursor: pointer; font-family: var(--fb); transition: filter .15s;
}
.ni-btn-primary:hover { filter: brightness(1.1); }
.ni-btn-ghost:disabled, .ni-btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.ni-hint { font-size: 12px; color: var(--pierre); margin-top: 12px; max-width: 780px; line-height: 1.5; }

@media (max-width: 640px) {
  .ni-row-2 { grid-template-columns: 1fr; }
  .ni-lines-head { display: none; }
  .ni-line { grid-template-columns: 1fr; gap: 6px; padding: 12px; background: var(--brume); border-radius: 10px; }
  .ni-line-total { text-align: left; }
  .ni-actions { flex-direction: column; }
}
`
