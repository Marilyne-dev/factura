"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import './dashboard.css'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: '📊' },
  { href: '/clients', label: 'Clients', icon: '👥' },
  { href: '/invoices', label: 'Factures', icon: '📄' },
  { href: '/settings/profile', label: 'Profil entreprise', icon: '🏢' },
  { href: '/settings/integrations', label: 'Intégrations', icon: '🔌' },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return

      if (!session) {
        router.replace('/login')
        return
      }
      setUser(session.user)
      setChecking(false)
    }

    checkSession()

    // Redirection automatique si la session expire (US-002, règle métier)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/login')
      }
    })

    return () => {
      mounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (checking) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-mark">
          <span className="nf">F</span>actura
        </div>
      </div>
    )
  }

  const initials = (user?.email || '?').charAt(0).toUpperCase()

  return (
    <div className="dash-shell">
      {/* Overlay mobile */}
      {menuOpen && <div className="dash-overlay" onClick={() => setMenuOpen(false)} />}

      <aside className={`dash-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="dash-sidebar-top">
          <Link href="/dashboard" className="dash-logo">
            <span className="nf">F</span>actura
          </Link>
        </div>

        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item ${active ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="dash-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="dash-sidebar-bottom">
          <Link href="/invoices/new" className="dash-cta">
            + Nouvelle facture
          </Link>

          <div className="dash-user">
            <div className="dash-user-avatar">{initials}</div>
            <div className="dash-user-info">
              <div className="dash-user-email">{user?.email}</div>
              <button className="dash-logout" onClick={handleLogout}>Se déconnecter</button>
            </div>
          </div>
        </div>
      </aside>

      <div className="dash-main-wrap">
        <header className="dash-topbar">
          <button className="dash-burger" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
            ☰
          </button>
          <Link href="/dashboard" className="dash-logo dash-logo-mobile">
            <span className="nf">F</span>actura
          </Link>
          <div className="dash-topbar-spacer" />
        </header>

        <main className="dash-main">
          {children}
        </main>
      </div>
    </div>
  )
}