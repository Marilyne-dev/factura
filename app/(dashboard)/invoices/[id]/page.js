"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const formatXOF = (amount) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(amount || 0)) + ' XOF'

const STATUS_LABELS = {
  draft: 'Brouillon',
  sent: 'Envoyée',
  overdue: 'En retard',
  paid: 'Payée',
  cancelled: 'Annulée',
}

const STATUS_CLASS = {
  draft: 'st-draft',
  sent: 'st-sent',
  overdue: 'st-overdue',
  paid: 'st-paid',
  cancelled: 'st-cancelled',
}

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [invoice, setInvoice] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [company, setCompany] = useState(null)
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)

  useEffect(() => {
    if (id) load()
  }, [id])

  const load = async () => {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: inv, error: invError }, { data: companyData }] = await Promise.all([
      supabase
        .from('invoices')
        .select('id, invoice_number, status, subtotal, tax_rate, tax_amount, total_amount, issue_date, due_date, notes, sent_at, created_at, client_id, payment_token, clients(full_name, company_name, email, whatsapp_number)')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(),
    ])

    if (invError || !inv) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const { data: lineItems } = await supabase
      .from('invoice_items')
      .select('id, description, quantity, unit_price, position')
      .eq('invoice_id', id)
      .order('position', { ascending: true })

    setInvoice(inv)
    setCompany(companyData || null)
    setItems(lineItems || [])
    setLoading(false)
  }

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    setError('')

    const payload = { status: newStatus }
    if (newStatus === 'sent' && !invoice.sent_at) {
      payload.sent_at = new Date().toISOString()
    }

    const { error: updError } = await supabase
      .from('invoices')
      .update(payload)
      .eq('id', id)

    if (updError) {
      setError("Impossible de mettre à jour le statut.")
      setUpdating(false)
      return
    }

    setInvoice((prev) => ({ ...prev, ...payload }))
    setUpdating(false)
  }

  const handleDownloadPdf = async () => {
    setGeneratingPdf(true)
    setError('')
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { default: InvoicePDF } = await import('@/components/InvoicePDF')

      const blob = await pdf(
        <InvoicePDF
          company={company}
          invoice={invoice}
          client={invoice.clients}
          items={items}
        />
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${invoice.invoice_number}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      setError('Impossible de générer le PDF. Réessayez.')
    }
    setGeneratingPdf(false)
  }

  const handleSendEmail = async () => {
    if (!invoice.clients?.email) {
      setError("Ce client n'a pas d'adresse email enregistrée.")
      return
    }

    setSendingEmail(true)
    setError('')
    setEmailSuccess(false)

    try {
      const payUrl = `${window.location.origin}/pay/${invoice.payment_token}`

      const res = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: invoice.clients.email,
          clientName: invoice.clients.full_name,
          invoiceNumber: invoice.invoice_number,
          totalAmount: invoice.total_amount,
          dueDate: invoice.due_date,
          payUrl,
          companyName: company?.name,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || "Échec de l'envoi de l'email.")
        setSendingEmail(false)
        return
      }

      if (invoice.status === 'draft') {
        const payload = { status: 'sent', sent_at: new Date().toISOString() }
        await supabase.from('invoices').update(payload).eq('id', id)
        setInvoice((prev) => ({ ...prev, ...payload }))
      }

      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('reminders_log').insert({
        user_id: user.id,
        invoice_id: invoice.id,
        client_id: invoice.client_id,
        type: 'email_sent',
        client_name: invoice.clients.full_name,
        invoice_number: invoice.invoice_number,
        amount: invoice.total_amount,
      })

      setEmailSuccess(true)
      setTimeout(() => setEmailSuccess(false), 4000)
    } catch (e) {
      setError("Une erreur est survenue lors de l'envoi.")
    }

    setSendingEmail(false)
  }

  const handleDelete = async () => {
    setUpdating(true)
    await supabase.from('invoice_items').delete().eq('invoice_id', id)
    const { error: delError } = await supabase.from('invoices').delete().eq('id', id)

    if (delError) {
      setError("Impossible de supprimer la facture.")
      setUpdating(false)
      return
    }

    router.push('/invoices')
  }

  if (loading) return <div className="ivd-loading">Chargement...</div>

  if (notFound) {
    return (
      <div className="ivd-notfound">
        <style>{INVOICE_DETAIL_CSS}</style>
        <div className="ivd-empty-emoji">🔍</div>
        <h2 className="ivd-notfound-title">Facture introuvable</h2>
        <p className="ivd-notfound-text">Elle a peut-être été supprimée, ou vous n&apos;y avez pas accès.</p>
        <Link href="/invoices" className="ivd-btn-primary">Retour aux factures</Link>
      </div>
    )
  }

  return (
    <div className="ivd">
      <style>{INVOICE_DETAIL_CSS}</style>

      <div className="ivd-topbar">
        <Link href="/invoices" className="ivd-back">← Toutes les factures</Link>
      </div>

      <div className="ivd-header">
        <div>
          <div className="ivd-header-top">
            <h1 className="ivd-title">{invoice.invoice_number}</h1>
            <span className={`ivd-badge ${STATUS_CLASS[invoice.status]}`}>
              {STATUS_LABELS[invoice.status] || invoice.status}
            </span>
          </div>
          <p className="ivd-subtitle">
            {invoice.clients?.full_name || <span className="ivd-muted">Client supprimé</span>}
            {invoice.clients?.company_name ? ` — ${invoice.clients.company_name}` : ''}
          </p>
        </div>

        <div className="ivd-actions">
          <button className="ivd-btn-ghost" onClick={handleDownloadPdf} disabled={generatingPdf}>
            {generatingPdf ? 'Génération...' : 'Télécharger PDF'}
          </button>
        </div>
      </div>

      {error && <div className="ivd-error">{error}</div>}
      {emailSuccess && <div className="ivd-success">✓ Email envoyé avec succès à {invoice.clients?.email}</div>}

      <div className="ivd-panel">
        <div className="ivd-meta-grid">
          <div>
            <div className="ivd-meta-label">Date d&apos;émission</div>
            <div className="ivd-meta-value">
              {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('fr-FR') : '—'}
            </div>
          </div>
          <div>
            <div className="ivd-meta-label">Date d&apos;échéance</div>
            <div className="ivd-meta-value">
              {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('fr-FR') : '—'}
            </div>
          </div>
          <div>
            <div className="ivd-meta-label">Créée le</div>
            <div className="ivd-meta-value">
              {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
          {invoice.sent_at && (
            <div>
              <div className="ivd-meta-label">Envoyée le</div>
              <div className="ivd-meta-value">
                {new Date(invoice.sent_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="ivd-panel">
        <div className="ivd-panel-title">Lignes d&apos;articles</div>

        <div className="ivd-lines-head">
          <div>Description</div>
          <div>Qté</div>
          <div>Prix unitaire</div>
          <div>Sous-total</div>
        </div>

        {items.length === 0 ? (
          <div className="ivd-no-items">Aucune ligne enregistrée pour cette facture.</div>
        ) : (
          items.map((line) => (
            <div className="ivd-line" key={line.id}>
              <div className="ivd-line-desc">{line.description}</div>
              <div className="ivd-line-num">{line.quantity}</div>
              <div className="ivd-line-num">{formatXOF(line.unit_price)}</div>
              <div className="ivd-line-total">{formatXOF(line.quantity * line.unit_price)}</div>
            </div>
          ))
        )}

        <div className="ivd-totals">
          <div className="ivd-totals-row">
            <span>Sous-total HT</span>
            <span>{formatXOF(invoice.subtotal)}</span>
          </div>
          <div className="ivd-totals-row">
            <span>Taxe ({invoice.tax_rate || 0}%)</span>
            <span>{formatXOF(invoice.tax_amount)}</span>
          </div>
          <div className="ivd-totals-row ivd-totals-final">
            <span>Total TTC</span>
            <span>{formatXOF(invoice.total_amount)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="ivd-panel">
          <div className="ivd-panel-title">Note</div>
          <p className="ivd-notes">{invoice.notes}</p>
        </div>
      )}

      <div className="ivd-panel">
        <div className="ivd-panel-title">Actions</div>
        <div className="ivd-status-actions">
          <button
            className="ivd-btn-primary"
            disabled={sendingEmail || !invoice.clients?.email}
            onClick={handleSendEmail}
            title={!invoice.clients?.email ? "Ce client n'a pas d'email enregistré" : ''}
          >
            {sendingEmail ? 'Envoi...' : '✉️ Envoyer par email'}
          </button>

          {invoice.status === 'draft' && (
            <button className="ivd-btn-ghost" disabled={updating} onClick={() => updateStatus('sent')}>
              Marquer comme envoyée (sans email)
            </button>
          )}
          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <button className="ivd-btn-primary" disabled={updating} onClick={() => updateStatus('paid')}>
              Marquer comme payée
            </button>
          )}
          {invoice.status !== 'cancelled' && invoice.status !== 'paid' && (
            <button className="ivd-btn-ghost" disabled={updating} onClick={() => updateStatus('cancelled')}>
              Annuler la facture
            </button>
          )}

          {!confirmDelete ? (
            <button className="ivd-btn-danger" disabled={updating} onClick={() => setConfirmDelete(true)}>
              Supprimer
            </button>
          ) : (
            <div className="ivd-confirm-delete">
              <span>Supprimer définitivement ?</span>
              <button className="ivd-btn-danger" disabled={updating} onClick={handleDelete}>
                {updating ? 'Suppression...' : 'Confirmer'}
              </button>
              <button className="ivd-btn-ghost" disabled={updating} onClick={() => setConfirmDelete(false)}>
                Annuler
              </button>
            </div>
          )}
        </div>
        <p className="ivd-hint">
          L&apos;envoi WhatsApp sera branché à une étape suivante (validation Meta requise).
        </p>
      </div>
    </div>
  )
}

const INVOICE_DETAIL_CSS = `
.ivd-loading { color: var(--pierre); font-size: 14px; padding: 40px 0; }

.ivd-topbar { margin-bottom: 16px; }
.ivd-back { font-size: 13px; color: var(--pierre); font-weight: 600; }
.ivd-back:hover { color: var(--forest); }

.ivd-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 24px;
}
.ivd-header-top { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
.ivd-title { font-family: var(--fd); font-size: 24px; font-weight: 800; color: var(--nuit); }
.ivd-subtitle { font-size: 14px; color: var(--pierre); }
.ivd-muted { color: var(--pierre); font-style: italic; }

.ivd-badge {
  display: inline-flex; align-items: center; font-size: 11.5px; font-weight: 700;
  padding: 4px 11px; border-radius: 100px;
}
.st-draft { background: var(--brume); color: var(--pierre); }
.st-sent { background: var(--savane); color: var(--forest); }
.st-overdue { background: var(--terra-lt); color: var(--terra); }
.st-paid { background: var(--gold-lt); color: #8a5c10; }
.st-cancelled { background: var(--brume); color: var(--pierre); text-decoration: line-through; }

.ivd-actions { display: flex; gap: 10px; }

.ivd-error { background: var(--terra-lt); color: var(--terra); border-radius: 9px; padding: 12px 16px; font-size: 13.5px; margin-bottom: 20px; }
.ivd-success { background: var(--savane); color: var(--forest); border-radius: 9px; padding: 12px 16px; font-size: 13.5px; margin-bottom: 20px; }

.ivd-panel {
  background: var(--white); border: 1px solid var(--border); border-radius: 16px;
  padding: 24px; margin-bottom: 20px; max-width: 780px;
}
.ivd-panel-title { font-family: var(--fd); font-size: 14px; font-weight: 700; color: var(--nuit); margin-bottom: 16px; }

.ivd-meta-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
}
.ivd-meta-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; color: var(--pierre); margin-bottom: 4px; }
.ivd-meta-value { font-size: 13.5px; color: var(--nuit); font-family: var(--fm); }

.ivd-lines-head {
  display: grid; grid-template-columns: 1fr 70px 130px 120px; gap: 10px;
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em;
  color: var(--pierre); margin-bottom: 8px; padding: 0 2px;
}
.ivd-line {
  display: grid; grid-template-columns: 1fr 70px 130px 120px; gap: 10px;
  align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border);
  font-size: 13.5px;
}
.ivd-line:last-of-type { border-bottom: none; }
.ivd-line-num { font-family: var(--fm); text-align: right; }
.ivd-line-total { font-family: var(--fm); font-weight: 600; text-align: right; color: var(--nuit); }
.ivd-no-items { font-size: 13.5px; color: var(--pierre); padding: 16px 0; text-align: center; }

.ivd-totals { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
.ivd-totals-row { display: flex; justify-content: space-between; font-size: 13.5px; color: var(--pierre); padding: 6px 0; }
.ivd-totals-final {
  font-family: var(--fd); font-size: 16px; font-weight: 800; color: var(--nuit);
  border-top: 1px solid var(--border); margin-top: 6px; padding-top: 12px;
}

.ivd-notes { font-size: 13.5px; color: var(--nuit); line-height: 1.6; white-space: pre-wrap; }

.ivd-status-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.ivd-btn-primary {
  background: var(--forest); color: #fff; border: none;
  border-radius: 10px; padding: 11px 20px; font-size: 13px; font-weight: 700;
  cursor: pointer; font-family: var(--fb); transition: filter .15s;
}
.ivd-btn-primary:hover { filter: brightness(1.1); }
.ivd-btn-ghost {
  background: var(--white); border: 1.5px solid var(--border); color: var(--nuit);
  border-radius: 10px; padding: 11px 20px; font-size: 13px; font-weight: 700;
  cursor: pointer; font-family: var(--fb);
}
.ivd-btn-ghost:hover { border-color: var(--forest); color: var(--forest); }
.ivd-btn-danger {
  background: var(--white); border: 1.5px solid var(--terra); color: var(--terra);
  border-radius: 10px; padding: 11px 20px; font-size: 13px; font-weight: 700;
  cursor: pointer; font-family: var(--fb);
}
.ivd-btn-danger:hover { background: var(--terra-lt); }
button:disabled { opacity: .5; cursor: not-allowed; }

.ivd-confirm-delete { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--pierre); }

.ivd-hint { font-size: 12px; color: var(--pierre); margin-top: 14px; line-height: 1.5; }

.ivd-notfound {
  max-width: 480px; margin: 60px auto; text-align: center;
}
.ivd-empty-emoji { font-size: 34px; margin-bottom: 12px; }
.ivd-notfound-title { font-family: var(--fd); font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.ivd-notfound-text { font-size: 13.5px; color: var(--pierre); margin-bottom: 22px; line-height: 1.6; }

@media (max-width: 640px) {
  .ivd-meta-grid { grid-template-columns: 1fr 1fr; }
  .ivd-lines-head { display: none; }
  .ivd-line { grid-template-columns: 1fr; gap: 4px; padding: 12px; background: var(--brume); border-radius: 10px; margin-bottom: 8px; border-bottom: none; }
  .ivd-line-num, .ivd-line-total { text-align: left; }
}
`