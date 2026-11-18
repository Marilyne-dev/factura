"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatInvoiceDate, getInvoiceStatus } from '@/lib/invoice-utils.mjs'

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

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'draft', label: 'Brouillons' },
  { key: 'sent', label: 'Envoyées' },
  { key: 'overdue', label: 'En retard' },
  { key: 'paid', label: 'Payées' },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const loadInvoices = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    // Jointure avec clients pour afficher le nom sans requête séparée
    const { data, error } = await supabase
      .from('invoices')
      .select('id, invoice_number, status, total_amount, due_date, issue_date, created_at, clients(full_name, company_name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setInvoices(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous invoice list request.
    void loadInvoices()
  }, [loadInvoices])

  const filtered = useMemo(() => {
    let list = invoices
    if (filter !== 'all') list = list.filter((i) => getInvoiceStatus(i) === filter)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (i) =>
          i.invoice_number?.toLowerCase().includes(q) ||
          i.clients?.full_name?.toLowerCase().includes(q) ||
          i.clients?.company_name?.toLowerCase().includes(q)
      )
    }
    return list
  }, [invoices, filter, search])

  const counts = useMemo(() => {
    const c = { all: invoices.length, draft: 0, sent: 0, overdue: 0, paid: 0 }
    invoices.forEach((invoice) => {
      const status = getInvoiceStatus(invoice)
      if (c[status] !== undefined) c[status]++
    })
    return c
  }, [invoices])

  return (
    <div className="iv">
      <style>{INVOICES_CSS}</style>

      <div className="iv-header">
        <div>
          <h1 className="iv-title">Factures</h1>
          <p className="iv-subtitle">Toutes vos factures, brouillons et paiements reçus.</p>
        </div>
        <Link href="/invoices/new" className="iv-cta">+ Nouvelle facture</Link>
      </div>

      <div className="iv-toolbar">
        <div className="iv-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`iv-filter ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {counts[f.key] > 0 && <span className="iv-filter-count">{counts[f.key]}</span>}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="iv-search"
          placeholder="Rechercher une facture..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="iv-loading">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="iv-empty">
          <div className="iv-empty-emoji">📄</div>
          <h2 className="iv-empty-title">
            {invoices.length === 0 ? 'Aucune facture pour le moment' : 'Aucun résultat'}
          </h2>
          <p className="iv-empty-text">
            {invoices.length === 0
              ? 'Créez votre première facture pour commencer à être payé plus vite.'
              : 'Essayez un autre filtre ou une autre recherche.'}
          </p>
          {invoices.length === 0 && (
            <Link href="/invoices/new" className="iv-cta">Créer ma première facture</Link>
          )}
        </div>
      ) : (
        <div className="iv-table">
          <div className="iv-row iv-row-head">
            <div className="iv-col-num">N° Facture</div>
            <div className="iv-col-client">Client</div>
            <div className="iv-col-date">Échéance</div>
            <div className="iv-col-amount">Montant</div>
            <div className="iv-col-status">Statut</div>
          </div>
          {filtered.map((inv) => {
            const status = getInvoiceStatus(inv)
            return (
              <Link href={`/invoices/${inv.id}`} className="iv-row" key={inv.id}>
                <div className="iv-col-num iv-num">{inv.invoice_number}</div>
                <div className="iv-col-client">
                  {inv.clients?.full_name || <span className="iv-muted">Client supprimé</span>}
                </div>
                <div className="iv-col-date">
                  {formatInvoiceDate(inv.due_date) || '—'}
                </div>
                <div className="iv-col-amount">{formatXOF(inv.total_amount)}</div>
                <div className="iv-col-status">
                  <span className={`iv-badge ${STATUS_CLASS[status]}`}>
                    {STATUS_LABELS[status] || status}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

const INVOICES_CSS = `
.iv-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 24px;
}
.iv-title { font-family: var(--fd); font-size: 26px; font-weight: 800; color: var(--nuit); margin-bottom: 6px; }
.iv-subtitle { font-size: 14px; color: var(--pierre); }
.iv-cta {
  background: var(--gold); color: var(--nuit); font-weight: 700; font-size: 13.5px;
  border-radius: 10px; padding: 12px 20px; white-space: nowrap; transition: filter .15s;
}
.iv-cta:hover { filter: brightness(.93); }

.iv-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 20px;
}
.iv-filters { display: flex; gap: 6px; flex-wrap: wrap; }
.iv-filter {
  background: var(--white); border: 1px solid var(--border); color: var(--pierre);
  border-radius: 100px; padding: 7px 14px; font-size: 12.5px; font-weight: 600;
  cursor: pointer; font-family: var(--fb); display: flex; align-items: center; gap: 6px;
  transition: all .15s;
}
.iv-filter:hover { border-color: var(--forest); }
.iv-filter.active { background: var(--forest); color: #fff; border-color: var(--forest); }
.iv-filter-count {
  background: rgba(255,255,255,.2); border-radius: 100px;
  font-size: 10.5px; padding: 1px 6px;
}
.iv-filter:not(.active) .iv-filter-count { background: var(--brume); color: var(--nuit); }

.iv-search {
  border: 1px solid var(--border); border-radius: 10px;
  padding: 9px 14px; font-size: 13.5px; font-family: var(--fb);
  outline: none; min-width: 220px; transition: border-color .15s;
}
.iv-search:focus { border-color: var(--forest); }

.iv-loading { color: var(--pierre); font-size: 14px; padding: 40px 0; text-align: center; }

.iv-table {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 14px; overflow: hidden;
}
.iv-row {
  display: grid;
  grid-template-columns: 140px 1.5fr 110px 140px 110px;
  gap: 12px; align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  color: var(--nuit);
  transition: background .1s;
}
.iv-row:last-child { border-bottom: none; }
a.iv-row:hover { background: var(--brume); }
.iv-row-head {
  font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
  color: var(--pierre); background: var(--brume);
}
.iv-num { font-family: var(--fm); font-size: 13px; }
.iv-col-client { font-size: 13.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.iv-col-date { font-size: 13px; color: var(--pierre); }
.iv-col-amount { font-family: var(--fm); font-size: 13.5px; font-weight: 600; }
.iv-muted { color: var(--pierre); font-style: italic; }

.iv-badge {
  display: inline-flex; align-items: center; font-size: 11.5px; font-weight: 700;
  padding: 4px 11px; border-radius: 100px;
}
.st-draft { background: var(--brume); color: var(--pierre); }
.st-sent { background: var(--savane); color: var(--forest); }
.st-overdue { background: var(--terra-lt); color: var(--terra); }
.st-paid { background: #DDF3E6; color: #1B7A45; }
.st-cancelled { background: var(--brume); color: var(--pierre); text-decoration: line-through; }

.iv-empty {
  background: var(--white); border: 1px dashed var(--border);
  border-radius: 16px; padding: 60px 30px; text-align: center;
}
.iv-empty-emoji { font-size: 34px; margin-bottom: 12px; }
.iv-empty-title { font-family: var(--fd); font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.iv-empty-text { font-size: 13.5px; color: var(--pierre); max-width: 360px; margin: 0 auto 22px; line-height: 1.6; }

@media (max-width: 720px) {
  .iv-row { grid-template-columns: 1fr 1fr; grid-template-areas: "num status" "client client" "date amount"; row-gap: 6px; }
  .iv-row-head { display: none; }
  .iv-col-num { grid-area: num; }
  .iv-col-status { grid-area: status; justify-self: end; }
  .iv-col-client { grid-area: client; }
  .iv-col-date { grid-area: date; }
  .iv-col-amount { grid-area: amount; justify-self: end; }
}
`
