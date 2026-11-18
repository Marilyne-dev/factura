"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { computeDashboardKpis, computeMonthlyInvoiceTotals } from '@/lib/invoice-utils.mjs'

// ─────────────────────────────────────────────
// Formatage montant en XOF
// ─────────────────────────────────────────────
const formatXOF = (amount) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(amount || 0)) + ' XOF'

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

const ACTIVITY_ICONS = {
  whatsapp_sent: '✅',
  link_clicked: '👁️',
  payment_received: '💰',
  email_sent: '📧',
  send_failed: '❌',
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [companyName, setCompanyName] = useState('')
  const [kpis, setKpis] = useState({ encaisse: 0, attente: 0, retard: 0, tauxRecouvrement: 0 })
  const [monthlyData, setMonthlyData] = useState([])
  const [activity, setActivity] = useState([])
  const [hasInvoices, setHasInvoices] = useState(true) // false si aucune facture -> état vide

  const loadDashboard = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Profil entreprise (nom affiché en en-tête) — table `companies` attendue selon PRD US-003
      const { data: company } = await supabase
        .from('companies')
        .select('name')
        .eq('user_id', user.id)
        .maybeSingle()
      if (company?.name) setCompanyName(company.name)

      // Factures — table `invoices` attendue selon PRD US-006
      const { data: invoices, error: invError } = await supabase
        .from('invoices')
        .select('id, status, total_amount, paid_at, created_at, due_date')
        .eq('user_id', user.id)

      if (invError || !invoices) {
        setHasInvoices(false)
        setLoading(false)
        return
      }

      setHasInvoices(invoices.length > 0)
      setKpis(computeDashboardKpis(invoices))
      setMonthlyData(computeMonthlyInvoiceTotals(invoices))

      // Journal des relances — table `reminders_log` attendue selon PRD US-013
      const { data: log } = await supabase
        .from('reminders_log')
        .select('id, type, created_at, amount, client_name, invoice_number, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setActivity(log || [])
    } catch (err) {
      console.error('Erreur chargement dashboard:', err)
      setHasInvoices(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous dashboard data load.
    void loadDashboard()
  }, [loadDashboard])

  const maxMonthly = Math.max(1, ...monthlyData.map((b) => b.total))

  if (loading) {
    return (
      <div className="dp-skeleton">
        <div className="dp-skel-line" style={{ width: '220px', height: '28px' }} />
        <div className="dp-skel-kpis">
          <div className="dp-skel-card" />
          <div className="dp-skel-card" />
          <div className="dp-skel-card" />
        </div>
        <div className="dp-skel-card" style={{ height: '220px' }} />
      </div>
    )
  }

  return (
    <div className="dp">
      <style>{DASHBOARD_PAGE_CSS}</style>

      <div className="dp-header">
        <div>
          <h1 className="dp-title">
            Bonjour{companyName ? `, ${companyName}` : ''} 👋
          </h1>
          <p className="dp-subtitle">Voici un aperçu de votre activité de facturation.</p>
        </div>
        <Link href="/invoices/new" className="dp-cta">+ Nouvelle facture</Link>
      </div>

      {!hasInvoices ? (
        <div className="dp-empty">
          <div className="dp-empty-emoji">📄</div>
          <h2 className="dp-empty-title">Créez votre première facture</h2>
          <p className="dp-empty-text">
            Dès que vous aurez envoyé une facture, vos statistiques d&apos;encaissement et votre journal de relances apparaîtront ici.
          </p>
          <Link href="/invoices/new" className="dp-cta">Créer ma première facture</Link>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="dp-kpis">
            <div className="dp-kpi">
              <div className="dp-kpi-icon dp-kpi-icon-gold">💰</div>
              <div className="dp-kpi-label">Encaissé ce mois</div>
              <div className="dp-kpi-value">{formatXOF(kpis.encaisse)}</div>
            </div>
            <div className="dp-kpi">
              <div className="dp-kpi-icon dp-kpi-icon-forest">📋</div>
              <div className="dp-kpi-label">En attente</div>
              <div className="dp-kpi-value">{formatXOF(kpis.attente)}</div>
            </div>
            <div className="dp-kpi">
              <div className="dp-kpi-icon dp-kpi-icon-terra">🔴</div>
              <div className="dp-kpi-label">En retard</div>
              <div className="dp-kpi-value">{formatXOF(kpis.retard)}</div>
            </div>
            <div className="dp-kpi">
              <div className="dp-kpi-icon dp-kpi-icon-forest">📈</div>
              <div className="dp-kpi-label">Taux de recouvrement</div>
              <div className="dp-kpi-value">{kpis.tauxRecouvrement}%</div>
            </div>
          </div>

          <div className="dp-grid">
            {/* Mini bar chart 6 mois */}
            <div className="dp-panel">
              <div className="dp-panel-title">Encaissements — 6 derniers mois</div>
              <div className="dp-chart">
                {monthlyData.map((b, idx) => {
                  const heightPct = Math.max(4, Math.round((b.total / maxMonthly) * 100))
                  const isCurrent = idx === monthlyData.length - 1
                  return (
                    <div className="dp-bar-col" key={idx}>
                      <div className="dp-bar-track">
                        <div
                          className={`dp-bar ${isCurrent ? 'current' : ''}`}
                          style={{ height: `${heightPct}%` }}
                          title={formatXOF(b.total)}
                        />
                      </div>
                      <div className="dp-bar-label">{MONTHS_FR[b.month]}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Journal des relances */}
            <div className="dp-panel">
              <div className="dp-panel-title">Journal des relances</div>
              {activity.length === 0 ? (
                <p className="dp-empty-mini">Aucune activité récente.</p>
              ) : (
                <ul className="dp-feed">
                  {activity.map((a) => (
                    <li className="dp-feed-item" key={a.id}>
                      <span className="dp-feed-icon">{ACTIVITY_ICONS[a.type] || '•'}</span>
                      <div className="dp-feed-body">
                        <div className="dp-feed-line">
                          <strong>{a.client_name}</strong>
                          {a.invoice_number && <span className="dp-feed-inv"> · {a.invoice_number}</span>}
                        </div>
                        <div className="dp-feed-meta">
                          {new Date(a.created_at).toLocaleString('fr-FR', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                          })}
                          {a.amount ? ` · ${formatXOF(a.amount)}` : ''}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const DASHBOARD_PAGE_CSS = `
.dp-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 32px;
}
.dp-title {
  font-family: var(--fd); font-size: 26px; font-weight: 800;
  color: var(--nuit); letter-spacing: -.01em; margin-bottom: 6px;
}
.dp-subtitle { font-size: 14px; color: var(--pierre); }
.dp-cta {
  background: var(--v3-primary); color: var(--white);
  font-weight: 700; font-size: 13.5px;
  border-radius: 10px; padding: 12px 20px;
  white-space: nowrap; transition: filter .15s;
}
.dp-cta:hover { background: var(--v3-primary-hover); }

.dp-kpis {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
  margin-bottom: 24px;
}
.dp-kpi {
  background: var(--white); border: 1px solid var(--v3-border);
  border-radius: 14px; padding: 22px;
  box-shadow: 0 1px 2px rgb(15 23 42 / .04);
  transition: box-shadow .2s ease, transform .2s ease;
}
.dp-kpi:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgb(15 23 42 / .07); }
.dp-kpi-icon {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; margin-bottom: 14px;
}
.dp-kpi-icon-gold { background: var(--gold-lt); }
.dp-kpi-icon-forest { background: oklch(0.94 0.05 145); }
.dp-kpi-icon-terra { background: var(--terra-lt); }
.dp-kpi-label { font-size: 12.5px; color: var(--pierre); margin-bottom: 6px; }
.dp-kpi-value { font-family: var(--fd); font-size: 20px; font-weight: 700; color: var(--nuit); }

.dp-grid {
  display: grid; grid-template-columns: 1.3fr 1fr; gap: 20px;
}
.dp-panel {
  background: var(--white); border: 1px solid var(--v3-border);
  border-radius: 14px; padding: 24px;
  box-shadow: 0 1px 2px rgb(15 23 42 / .04);
}
.dp-panel-title {
  font-family: var(--fd); font-size: 14px; font-weight: 700;
  color: var(--nuit); margin-bottom: 20px;
}

.dp-chart {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 10px; height: 160px;
}
.dp-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
.dp-bar-track {
  flex: 1; width: 100%; max-width: 34px; display: flex; align-items: flex-end;
  background: #f1f5f9; border-radius: 6px; overflow: hidden;
}
.dp-bar { width: 100%; background: oklch(0.91 0.04 145); border-radius: 6px 6px 0 0; transition: height .3s; }
.dp-bar.current { background: var(--v3-success); }
.dp-bar-label { font-size: 11px; color: var(--pierre); margin-top: 8px; }

.dp-feed { list-style: none; display: flex; flex-direction: column; gap: 14px; }
.dp-feed-item { display: flex; align-items: flex-start; gap: 10px; }
.dp-feed-icon { font-size: 14px; margin-top: 1px; }
.dp-feed-body { min-width: 0; }
.dp-feed-line { font-size: 13.5px; color: var(--nuit); }
.dp-feed-inv { color: var(--pierre); font-family: var(--fm); font-size: 12px; }
.dp-feed-meta { font-size: 11.5px; color: var(--pierre); margin-top: 2px; }
.dp-empty-mini { font-size: 13px; color: var(--pierre); }

.dp-empty {
  background: var(--white); border: 1px dashed var(--border);
  border-radius: 16px; padding: 60px 30px; text-align: center;
}
.dp-empty-emoji { font-size: 34px; margin-bottom: 12px; }
.dp-empty-title { font-family: var(--fd); font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.dp-empty-text { font-size: 13.5px; color: var(--pierre); max-width: 380px; margin: 0 auto 22px; line-height: 1.6; }

.dp-skeleton { display: flex; flex-direction: column; gap: 20px; }
.dp-skel-line, .dp-skel-card {
  background: linear-gradient(90deg, var(--brume) 25%, var(--savane) 50%, var(--brume) 75%);
  background-size: 200% 100%; animation: dp-shimmer 1.4s infinite; border-radius: 12px;
}
.dp-skel-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.dp-skel-card { height: 90px; }
@keyframes dp-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

@media (max-width: 900px) {
  .dp-kpis { grid-template-columns: 1fr 1fr; }
  .dp-grid { grid-template-columns: 1fr; }
}
@media (max-width: 520px) {
  .dp-kpis { grid-template-columns: 1fr; }
}
`
