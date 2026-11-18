"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const today = () => new Date().toISOString().slice(0, 10)

export default function EditDraftInvoicePage() {
  const { id } = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState(null)
  const [clients, setClients] = useState([])
  const [clientId, setClientId] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [taxRate, setTaxRate] = useState('0')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Reconnectez-vous pour modifier cette facture.'); setBusy(false); return }
      const [{ data: inv }, { data: clientRows }, { data: lineRows }] = await Promise.all([
        supabase.from('invoices').select('*').eq('id', id).eq('user_id', user.id).eq('status', 'draft').maybeSingle(),
        supabase.from('clients').select('id, full_name, company_name').eq('user_id', user.id).order('full_name'),
        supabase.from('invoice_items').select('description, quantity, unit_price, position').eq('invoice_id', id).order('position'),
      ])
      if (!inv) { setError('Cette facture est introuvable ou n’est plus un brouillon.'); setBusy(false); return }
      setInvoice(inv)
      setClients(clientRows || [])
      setClientId(inv.client_id)
      setIssueDate(inv.issue_date)
      setDueDate(inv.due_date)
      setTaxRate(String(inv.tax_rate || 0))
      setNotes(inv.notes || '')
      setItems((lineRows || []).map((line) => ({ ...line })))
      setBusy(false)
    }
    if (id) void load()
  }, [id])

  const updateItem = (index, key, value) => setItems((current) => current.map((item, i) => i === index ? { ...item, [key]: value } : item))
  const save = async (event) => {
    event.preventDefault()
    setError('')
    if (!items.length || items.some((item) => !item.description?.trim() || Number(item.quantity) <= 0 || Number(item.unit_price) < 0)) {
      setError('Ajoutez au moins une ligne valide à la facture.')
      return
    }
    if (dueDate < issueDate) { setError('La date d’échéance doit suivre la date d’émission.'); return }
    setSaving(true)
    const { data, error: updateError } = await supabase.rpc('update_invoice_draft_with_items', {
      p_invoice_id: id,
      p_client_id: clientId,
      p_issue_date: issueDate,
      p_due_date: dueDate,
      p_tax_rate: Number(taxRate),
      p_notes: notes || null,
      p_items: items.map((item, position) => ({ description: item.description.trim(), quantity: Number(item.quantity), unit_price: Number(item.unit_price), position })),
    })
    setSaving(false)
    if (updateError) {
      setError(updateError.message?.includes('function') ? 'Appliquez la migration Supabase avant de modifier les brouillons.' : 'Impossible d’enregistrer le brouillon. Vérifiez les données puis réessayez.')
      return
    }
    if (data) router.push(`/invoices/${id}`)
  }

  if (busy) return <p>Chargement du brouillon…</p>
  return <main className="edit-draft">
    <style>{CSS}</style>
    <Link href={invoice ? `/invoices/${invoice.id}` : '/invoices'}>← Retour à la facture</Link>
    <h1>Modifier {invoice?.invoice_number || 'le brouillon'}</h1>
    {error && <p role="alert" className="error">{error}</p>}
    {invoice && <form onSubmit={save}>
      <label>Client<select required value={clientId} onChange={(e) => setClientId(e.target.value)}>{clients.map((client) => <option key={client.id} value={client.id}>{client.company_name || client.full_name}</option>)}</select></label>
      <div className="row"><label>Date d’émission<input type="date" value={issueDate} max={today()} required onChange={(e) => setIssueDate(e.target.value)} /></label><label>Échéance<input type="date" value={dueDate} required onChange={(e) => setDueDate(e.target.value)} /></label></div>
      <label>TVA (%)<input type="number" min="0" max="100" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} /></label>
      <h2>Lignes</h2>
      {items.map((item, index) => <div className="row item" key={`${index}-${item.position}`}><label>Description<input required value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} /></label><label>Qté<input required type="number" min="0.01" step="0.01" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} /></label><label>Prix unitaire (XOF)<input required type="number" min="0" step="1" value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', e.target.value)} /></label><button type="button" onClick={() => setItems((current) => current.filter((_, i) => i !== index))} aria-label="Supprimer la ligne">×</button></div>)}
      <button type="button" onClick={() => setItems((current) => [...current, { description: '', quantity: 1, unit_price: 0 }])}>+ Ajouter une ligne</button>
      <label>Notes<textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
      <button className="save" disabled={saving || !items.length}>{saving ? 'Enregistrement…' : 'Enregistrer le brouillon'}</button>
    </form>}
  </main>
}

const CSS = `.edit-draft{max-width:820px;margin:0 auto;padding:24px;color:var(--nuit)}.edit-draft>a{color:var(--forest)}.edit-draft form{display:grid;gap:16px;margin-top:20px}.edit-draft label{display:grid;gap:6px;font-size:13px;font-weight:600}.edit-draft input,.edit-draft select,.edit-draft textarea{width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font:inherit}.edit-draft .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.edit-draft .item{grid-template-columns:3fr 1fr 2fr auto;align-items:end}.edit-draft button{border:1px solid var(--border);background:white;border-radius:8px;padding:10px;cursor:pointer}.edit-draft .save{background:var(--forest);color:white}.edit-draft .error{padding:12px;background:#fff0e9;color:#8a321b}@media(max-width:650px){.edit-draft .row,.edit-draft .item{grid-template-columns:1fr 1fr}.edit-draft .item label:first-child{grid-column:1/-1}}`
