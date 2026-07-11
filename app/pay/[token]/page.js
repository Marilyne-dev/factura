"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const formatXOF = (amount) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(amount || 0)) + ' XOF'

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—')

const STATUS_LABELS = {
  draft: 'Brouillon',
  sent: 'En attente de paiement',
  overdue: 'En retard',
  paid: 'Payée',
  cancelled: 'Annulée',
}

export default function PublicInvoicePage() {
  const { token } = useParams()

  const [invoice, setInvoice] = useState(null)
  const [items, setItems] = useState([])
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [pdfError, setPdfError] = useState('')

  useEffect(() => {
    if (token) load()
  }, [token])

  const load = async () => {
    setLoading(true)

    const { data: inv, error: invError } = await supabase
      .from('invoices')
      .select('id, invoice_number, status, subtotal, tax_rate, tax_amount, total_amount, issue_date, due_date, notes, user_id, clients(full_name, company_name, email, whatsapp_number)')
      .eq('payment_token', token)
      .maybeSingle()

    if (invError || !inv) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const [{ data: lineItems }, { data: companyData }] = await Promise.all([
      supabase
        .from('invoice_items')
        .select('id, description, quantity, unit_price, position')
        .eq('invoice_id', inv.id)
        .order('position', { ascending: true }),
      supabase
        .from('companies')
        .select('name, logo_url, address, phone, country, bank_details, mobile_money_number')
        .eq('user_id', inv.user_id)
        .maybeSingle(),
    ])

    setInvoice(inv)
    setItems(lineItems || [])
    setCompany(companyData || null)
    setLoading(false)
  }

  const handleDownloadPdf = async () => {
    setGeneratingPdf(true)
    setPdfError('')
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
      setPdfError('Impossible de générer le PDF. Réessayez.')
    }
    setGeneratingPdf(false)
  }

  if (loading) {
    return (
      <div className="pay-wrap">
        <style>{PAY_CSS}</style>
        <div className="pay-loading">Chargement de la facture...</div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="pay-wrap">
        <style>{PAY_CSS}</style>
        <div className="pay-card pay-notfound">
          <div className="pay-emoji">🔍</div>
          <h1 className="pay-notfound-title">Facture introuvable</h1>
          <p className="pay-notfound-text">
            Ce lien est peut-être incorrect ou expiré. Contactez l&apos;émetteur de la facture pour en obtenir un nouveau.
          </p>
        </div>
      </div>
    )
  }

  const isPaid = invoice.status === 'paid'
  const isCancelled = invoice.status === 'cancelled'

  return (
    <div className="pay-wrap">
      <style>{PAY_CSS}</style>

      <div className="pay-card">
        {/* En-tête entreprise */}
        <div className="pay-company">
          {company?.logo_url ? (
            <img src={company.logo_url} alt={company.name} className="pay-logo" />
          ) : (
            <div className="pay-company-name">{company?.name || 'Facture'}</div>
          )}
          {company?.logo_url && company?.name && (
            <div className="pay-company-name pay-company-name-sm">{company.name}</div>
          )}
        </div>

        {/* Statut + montant */}
        <div className={`pay-status-block ${isPaid ? 'is-paid' : isCancelled ? 'is-cancelled' : ''}`}>
          <div className="pay-status-label">{STATUS_LABELS[invoice.status] || invoice.status}</div>
          <div className="pay-amount">{formatXOF(invoice.total_amount)}</div>
          {!isPaid && !isCancelled && (
            <div className="pay-due">Échéance : {formatDate(invoice.due_date)}</div>
          )}
        </div>

        {isPaid && (
          <div className="pay-confirmation">
            ✓ Cette facture a été réglée. Merci !
          </div>
        )}

        {isCancelled && (
          <div className="pay-cancelled-msg">
            Cette facture a été annulée par l&apos;émetteur.
          </div>
        )}

        {/* Détails facture */}
        <div className="pay-section">
          <div className="pay-section-title">Détails</div>
          <div className="pay-meta-row">
            <span>N° facture</span>
            <span className="pay-mono">{invoice.invoice_number}</span>
          </div>
          <div className="pay-meta-row">
            <span>Facturé à</span>
            <span>{invoice.clients?.full_name || '—'}</span>
          </div>
          <div className="pay-meta-row">
            <span>Date d&apos;émission</span>
            <span>{formatDate(invoice.issue_date)}</span>
          </div>
        </div>

        {/* Lignes */}
        <div className="pay-section">
          <div className="pay-section-title">Articles</div>
          {items.map((line) => (
            <div className="pay-line" key={line.id}>
              <div className="pay-line-desc">
                {line.description}
                <span className="pay-line-qty">× {line.quantity}</span>
              </div>
              <div className="pay-line-amount">{formatXOF(line.quantity * line.unit_price)}</div>
            </div>
          ))}
          <div className="pay-totals">
            <div className="pay-totals-row">
              <span>Sous-total HT</span>
              <span>{formatXOF(invoice.subtotal)}</span>
            </div>
            <div className="pay-totals-row">
              <span>Taxe ({invoice.tax_rate || 0}%)</span>
              <span>{formatXOF(invoice.tax_amount)}</span>
            </div>
            <div className="pay-totals-row pay-totals-final">
              <span>Total</span>
              <span>{formatXOF(invoice.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Paiement */}
        {!isPaid && !isCancelled && (
          <div className="pay-section">
            <div className="pay-section-title">Comment payer</div>

            <button className="pay-btn-online" disabled title="Bientôt disponible">
              💳 Payer en ligne (bientôt disponible)
            </button>

            {(company?.bank_details || company?.mobile_money_number) && (
              <div className="pay-manual">
                <div className="pay-manual-label">Ou par virement / Mobile Money</div>
                {company?.mobile_money_number && (
                  <div className="pay-manual-line">
                    <strong>Mobile Money :</strong> {company.mobile_money_number}
                  </div>
                )}
                {company?.bank_details && (
                  <div className="pay-manual-line pay-manual-pre">{company.bank_details}</div>
                )}
                <p className="pay-manual-hint">
                  Merci d&apos;indiquer le numéro de facture <strong>{invoice.invoice_number}</strong> en référence de votre paiement.
                </p>
              </div>
            )}
          </div>
        )}

        {pdfError && <div className="pay-error">{pdfError}</div>}

        <button className="pay-btn-pdf" onClick={handleDownloadPdf} disabled={generatingPdf}>
          {generatingPdf ? 'Génération...' : '↓ Télécharger la facture (PDF)'}
        </button>

        {company?.phone && (
          <p className="pay-contact">Une question ? Contactez {company.name} au {company.phone}</p>
        )}
      </div>

      <p className="pay-footer">Facture générée via Factura</p>
    </div>
  )
}

const PAY_CSS = `
.pay-wrap {
  min-height: 100vh;
  background: var(--brume);
  display: flex; flex-direction: column; align-items: center;
  padding: 32px 16px 60px;
}
.pay-loading { color: var(--pierre); font-size: 14px; padding: 60px 0; }

.pay-card {
  background: var(--white); border: 1px solid var(--border); border-radius: 20px;
  padding: 32px 28px; max-width: 440px; width: 100%;
}

.pay-company { text-align: center; margin-bottom: 20px; }
.pay-logo { max-width: 140px; max-height: 60px; object-fit: contain; margin: 0 auto 8px; display: block; }
.pay-company-name { font-family: var(--fd); font-size: 18px; font-weight: 800; color: var(--nuit); }
.pay-company-name-sm { font-size: 13px; font-weight: 600; }

.pay-status-block {
  text-align: center; padding: 20px 0; border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border); margin-bottom: 20px;
}
.pay-status-label {
  font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
  color: var(--pierre); margin-bottom: 8px;
}
.pay-status-block.is-paid .pay-status-label { color: var(--forest); }
.pay-status-block.is-cancelled .pay-status-label { color: var(--terra); }
.pay-amount { font-family: var(--fd); font-size: 34px; font-weight: 800; color: var(--nuit); }
.pay-due { font-size: 13px; color: var(--pierre); margin-top: 6px; }

.pay-confirmation {
  background: var(--savane); color: var(--forest); border-radius: 10px;
  padding: 14px; text-align: center; font-weight: 700; font-size: 14px; margin-bottom: 20px;
}
.pay-cancelled-msg {
  background: var(--brume); color: var(--pierre); border-radius: 10px;
  padding: 14px; text-align: center; font-size: 13.5px; margin-bottom: 20px;
}

.pay-section { margin-bottom: 22px; }
.pay-section-title {
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
  color: var(--pierre); margin-bottom: 12px;
}
.pay-meta-row {
  display: flex; justify-content: space-between; font-size: 13.5px;
  color: var(--nuit); padding: 5px 0;
}
.pay-meta-row span:first-child { color: var(--pierre); }
.pay-mono { font-family: var(--fm); }

.pay-line {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 13.5px; padding: 8px 0; border-bottom: 1px solid var(--border);
}
.pay-line-desc { color: var(--nuit); }
.pay-line-qty { color: var(--pierre); font-size: 12px; margin-left: 6px; }
.pay-line-amount { font-family: var(--fm); font-weight: 600; white-space: nowrap; margin-left: 12px; }

.pay-totals { margin-top: 10px; padding-top: 10px; }
.pay-totals-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--pierre); padding: 4px 0; }
.pay-totals-final {
  font-family: var(--fd); font-size: 16px; font-weight: 800; color: var(--nuit);
  border-top: 1px solid var(--border); margin-top: 6px; padding-top: 10px;
}

.pay-btn-online {
  width: 100%; background: var(--gold); color: var(--nuit); border: none;
  border-radius: 12px; padding: 15px; font-size: 14.5px; font-weight: 700;
  cursor: not-allowed; opacity: .55; font-family: var(--fb); margin-bottom: 14px;
}

.pay-manual {
  background: var(--brume); border-radius: 12px; padding: 16px;
}
.pay-manual-label { font-size: 12px; font-weight: 700; color: var(--nuit); margin-bottom: 8px; }
.pay-manual-line { font-size: 13.5px; color: var(--nuit); margin-bottom: 4px; }
.pay-manual-pre { white-space: pre-wrap; font-family: var(--fm); font-size: 12.5px; line-height: 1.6; }
.pay-manual-hint { font-size: 12px; color: var(--pierre); margin-top: 10px; line-height: 1.5; }

.pay-error {
  background: var(--terra-lt); color: var(--terra); border-radius: 9px;
  padding: 10px 14px; font-size: 12.5px; margin-bottom: 12px;
}

.pay-btn-pdf {
  width: 100%; background: var(--white); border: 1.5px solid var(--forest); color: var(--forest);
  border-radius: 12px; padding: 13px; font-size: 13.5px; font-weight: 700;
  cursor: pointer; font-family: var(--fb);
}
.pay-btn-pdf:disabled { opacity: .6; cursor: not-allowed; }

.pay-contact { text-align: center; font-size: 12px; color: var(--pierre); margin-top: 16px; }

.pay-emoji { font-size: 34px; text-align: center; margin-bottom: 12px; }
.pay-notfound { text-align: center; }
.pay-notfound-title { font-family: var(--fd); font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.pay-notfound-text { font-size: 13.5px; color: var(--pierre); line-height: 1.6; }

.pay-footer { font-size: 11.5px; color: var(--pierre); margin-top: 24px; }
`