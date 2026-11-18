"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const money = (amount) => `${new Intl.NumberFormat('fr-FR').format(Math.round(Number(amount) || 0))} XOF`
const dateLabel = (date) => date ? new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString('fr-FR') : '—'

export default function ClientDetailPage() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [reminders, setReminders] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Reconnectez-vous pour consulter cette fiche.'); setLoading(false); return }
      const [{ data: customer, error: clientError }, { data: invoiceRows }, { data: reminderRows }] = await Promise.all([
        supabase.from('clients').select('*').eq('id', id).eq('user_id', user.id).maybeSingle(),
        supabase.from('invoices').select('id, invoice_number, status, issue_date, due_date, paid_at, total_amount').eq('client_id', id).eq('user_id', user.id).order('issue_date', { ascending: false }),
        supabase.from('reminders_log').select('id, type, status, created_at, invoice_number').eq('client_id', id).eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      ])
      if (clientError || !customer) setError('Client introuvable.')
      else { setClient(customer); setInvoices(invoiceRows || []); setReminders(reminderRows || []) }
      setLoading(false)
    }
    if (id) void load()
  }, [id])

  if (loading) return <p>Chargement de la fiche client…</p>
  if (error) return <main className="client-detail"><p role="alert">{error}</p><Link href="/clients">Retour aux clients</Link></main>

  const outstanding = invoices.filter((invoice) => ['sent', 'overdue'].includes(invoice.status)).reduce((sum, invoice) => sum + Number(invoice.total_amount || 0), 0)
  const paid = invoices.filter((invoice) => invoice.status === 'paid')
  const onTime = paid.filter((invoice) => invoice.paid_at && invoice.due_date && invoice.paid_at.slice(0, 10) <= invoice.due_date).length
  const score = paid.length ? Math.round(onTime / paid.length * 100) : null

  return <main className="client-detail"><style>{CSS}</style>
    <Link href="/clients">← Tous les clients</Link>
    <header><div><p>Fiche client</p><h1>{client.full_name}</h1>{client.company_name && <span>{client.company_name}</span>}</div><Link className="button" href={`/invoices/new?client=${client.id}`}>Nouvelle facture</Link></header>
    <section className="summary"><article><span>Solde dû</span><strong>{money(outstanding)}</strong></article><article><span>Total facturé</span><strong>{money(invoices.reduce((sum, invoice) => sum + Number(invoice.total_amount || 0), 0))}</strong></article><article><span>Fiabilité de paiement</span><strong>{score === null ? 'Pas encore évaluée' : `${score}% à temps`}</strong><small>{score === null ? 'Aucune facture réglée' : `${onTime} sur ${paid.length} réglée(s) à temps`}</small></article></section>
    <section className="panel"><h2>Coordonnées</h2><p>{client.email || 'Aucun e-mail'}</p><p>{client.whatsapp_number || 'Aucun numéro WhatsApp'}</p>{client.notes && <p>{client.notes}</p>}</section>
    <section className="panel"><h2>Historique des factures</h2>{invoices.length ? <div className="rows">{invoices.map((invoice) => <Link key={invoice.id} href={`/invoices/${invoice.id}`}><span>{invoice.invoice_number}<small>{dateLabel(invoice.issue_date)} · échéance {dateLabel(invoice.due_date)}</small></span><span>{money(invoice.total_amount)}<small>{invoice.status}</small></span></Link>)}</div> : <p>Aucune facture enregistrée pour ce client.</p>}</section>
    <section className="panel"><h2>Dernières activités de relance</h2>{reminders.length ? <div className="rows">{reminders.map((entry) => <div key={entry.id}><span>{entry.type} {entry.invoice_number && `· ${entry.invoice_number}`}</span><span>{entry.status}<small>{new Date(entry.created_at).toLocaleString('fr-FR')}</small></span></div>)}</div> : <p>Aucune activité enregistrée.</p>}</section>
  </main>
}

const CSS = `.client-detail{max-width:1000px;margin:0 auto;padding:24px;color:var(--nuit)}.client-detail>a{color:var(--forest)}.client-detail header{display:flex;justify-content:space-between;align-items:center;gap:16px;margin:24px 0}.client-detail header p{color:var(--pierre);margin:0}.client-detail h1{margin:4px 0}.client-detail .button{background:var(--forest);color:white;padding:12px 16px;border-radius:9px;text-decoration:none}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.summary article,.panel{background:white;border:1px solid var(--border);border-radius:12px;padding:18px}.summary article{display:grid;gap:8px}.summary span,.summary small{color:var(--pierre)}.summary strong{font-size:20px}.summary small{font-size:12px}.panel{margin-top:16px}.panel h2{font-size:18px;margin:0 0 12px}.rows{display:grid}.rows>a,.rows>div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-top:1px solid var(--border);color:var(--nuit);text-decoration:none}.rows span:last-child{text-align:right}.rows small{display:block;color:var(--pierre);font-size:12px;margin-top:4px}@media(max-width:700px){.summary{grid-template-columns:1fr}.client-detail header{align-items:flex-start;flex-direction:column}}`
