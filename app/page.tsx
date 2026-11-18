"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>


{/* ══════════════════════════════════
     NAV
══════════════════════════════════ */}
<nav className={`nav ${scrolled ? "scrolled" : ""}`} id="nav">
  <div className="container">
    <div className="nav-inner">
      <a href="#hero" className="nav-logo">
        <span className="nf">F</span><span className="nc">actura</span>
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" style={{marginLeft: '2px'}} xmlns="http://www.w3.org/2000/svg">
          <path d="M4 11.5L9 16.5L18 6" stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <ul className="nav-links">
        <li><a href="#hiw">Comment ça marche</a></li>
        <li><a href="#features">Fonctionnalités</a></li>
        <li><a href="#pricing">Tarifs</a></li>
      </ul>
      <div className="nav-actions">
        <Link href="/login" className="nav-login">Connexion</Link>
        <Link href="/register" className="nav-cta">Créer un compte</Link>
      </div>
    </div>
  </div>
</nav>


{/* ══════════════════════════════════
     HERO
══════════════════════════════════ */}
<section className="hero" id="hero">
  <svg className="pat-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="hero-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <polygon points="20,1 39,20 20,39 1,20" fill="none" stroke="#fff" strokeWidth=".7" opacity=".25" />
      <polygon points="20,9 31,20 20,31 9,20" fill="none" stroke="#E8A020" strokeWidth=".5" opacity=".3" />
      <circle cx="20" cy="20" r="1.5" fill="#E8A020" opacity=".35" />
      <circle cx="0" cy="0" r="1.2" fill="#fff" opacity=".15" />
      <circle cx="40" cy="0" r="1.2" fill="#fff" opacity=".15" />
      <circle cx="0" cy="40" r="1.2" fill="#fff" opacity=".15" />
      <circle cx="40" cy="40" r="1.2" fill="#fff" opacity=".15" />
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#hero-pat)" />
  </svg>

  <div className="container">
    <div className="hero-grid">

      {/* Copy */}
      <div className="hero-copy">
        <div className="hero-eyebrow">Facturation et suivi des paiements · XOF</div>
        <h1 className="hero-title">
          Envoyez la<br />
          facture. <em>On<br />
          s&apos;occupe</em><br />
          du reste.
        </h1>
        <p className="hero-sub">
          Créez vos factures en XOF, envoyez-les par e-mail et suivez leur statut depuis votre tableau de bord.
        </p>
        <div className="hero-ctas">
          <Link href="/register" className="btn-hero-p">Créer un compte →</Link>
          <a href="#features" className="btn-hero-g">Découvrir les fonctions</a>
        </div>
        <div className="hero-trust">Version bêta · Factures en XOF et export PDF</div>
        <div className="hero-social">
          <span>Aperçu illustratif avec données fictives. Les relances automatiques ne sont pas disponibles.</span>
        </div>
      </div>

      {/* Visual */}
      <div className="hero-visual">

        {/* Floating badges */}
        <div className="hero-badge hero-badge-left">
          <div className="hb-ico">💰</div>
          <div>
            <div className="hb-t">+750 000 XOF</div>
            <div className="hb-s">Exemple fictif</div>
          </div>
        </div>
        <div className="hero-badge hero-badge-right">
          <div className="hb-ico">📱</div>
          <div>
            <div className="hb-t">Relance envoyée</div>
            <div className="hb-s">Kofi · FAC-047 · J+7</div>
          </div>
        </div>

        {/* Phone */}
        <div className="phone-wrap">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            <div className="phone-status">
              <span>09:23</span>
              <span>▌▌▌ WiFi ⬛</span>
            </div>
            <div className="wa-topbar">
              <div className="wa-av-s">F</div>
              <div>
                <div className="wa-info-name">Factura · relances</div>
                <div className="wa-info-sub">en ligne</div>
              </div>
            </div>
            <div className="chat-area">

              {/* Step 1: Invoice card */}
              <div className="anim-invoice">
                <div className="ai-label">FACTURE EN ATTENTE</div>
                <div className="ai-client">Awa Diallo</div>
                <div className="ai-num">FAC-2026-047 · Agence Créative</div>
                <div className="ai-row">
                  <div className="ai-amt">750 000 <span style={{fontSize: '13px', color: 'rgba(255,255,255,.4)'}}>XOF</span></div>
                  <div className="ai-due">
                    <div style={{color: 'var(--terra)', fontSize: '10px', fontWeight: '700'}}>EN RETARD</div>
                    <div>+7 jours</div>
                  </div>
                </div>
                <div className="ai-bar">
                  <div className="ai-seg done"></div>
                  <div className="ai-seg done"></div>
                  <div className="ai-seg now"></div>
                  <div className="ai-seg"></div>
                  <div className="ai-seg"></div>
                </div>
              </div>

              {/* Step 2: Sending */}
              <div className="anim-sending">
                <div className="send-dot"></div>
                <div className="send-txt">Envoi relance WhatsApp J+7...</div>
              </div>

              {/* Step 3: WhatsApp bubble */}
              <div className="anim-bubble">
                <div className="bubble-txt">
                  Bonjour <strong>Awa</strong> 👋<br />
                  Votre facture de <span className="bubble-amt">750 000 XOF</span> est en attente depuis 7 jours.<br />
                  Réglez en 1 clic 👇
                </div>
                <div className="bubble-time">09:23 ✓✓</div>
                <div className="bubble-btns">
                  <div className="bubble-btn">💳 Payer</div>
                  <div className="bubble-btn">📄 Facture</div>
                </div>
              </div>

              {/* Step 4: Paid confirmation */}
              <div className="anim-paid">
                <div className="paid-icon">✅</div>
                <div className="paid-info">
                  <div className="paid-label">Paiement reçu ✓</div>
                  <div className="paid-amt">750 000 XOF</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


{/* ══════════════════════════════════
     STATS BAR
══════════════════════════════════ */}
<section className="pain-sec" id="pain">
  <div className="container" style={{position: 'relative', zIndex: '1'}}>
    <div className="pain-eyebrow">Un suivi plus simple</div>
    <h2 className="pain-title">Le suivi des factures ne devrait pas prendre toute votre journée.</h2>
    <div className="pain-grid">
      <div className="pain-card"><div className="pain-card-title">Des échéances dispersées</div><div className="pain-card-desc">Retrouvez les dates d’échéance et les statuts de vos factures dans un même espace.</div></div>
      <div className="pain-card"><div className="pain-card-title">Des rappels à ne pas oublier</div><div className="pain-card-desc">Consultez les factures en attente ou en retard et contactez vos clients selon votre suivi habituel.</div></div>
      <div className="pain-card"><div className="pain-card-title">Une visibilité limitée</div><div className="pain-card-desc">Le tableau de bord résume les montants encaissés, à recevoir et en retard.</div></div>
    </div>
  </div>
</section>

<section className="hiw-sec" id="hiw">
  <div className="container">
    <div className="sec-label">Comment ça marche</div>
    <h2 className="sec-title">Créez, envoyez et suivez vos factures.</h2>
    <div className="hiw-steps">
      <div className="hiw-step"><div className="step-num">01</div><h3 className="step-title">Créez une facture</h3><p className="step-desc">Ajoutez un client, vos lignes de prestation, les dates et la TVA. Téléchargez le PDF.</p></div>
      <div className="hiw-step"><div className="step-num">02</div><h3 className="step-title">Partagez-la avec votre client</h3><p className="step-desc">Envoyez la facture par e-mail depuis l’application ou partagez son lien public.</p></div>
      <div className="hiw-step"><div className="step-num">03</div><h3 className="step-title">Suivez son statut</h3><p className="step-desc">Retrouvez les factures payées, en attente et en retard dans votre tableau de bord.</p></div>
    </div>
  </div>
</section>

<section className="feat-sec" id="features">
  <div className="container" style={{position: 'relative', zIndex: '1'}}>
    <div className="sec-label">Fonctionnalités disponibles</div>
    <h2 className="sec-title" style={{color: '#fff'}}>Les outils essentiels pour vos factures.</h2>
    <div className="feat-grid">
      <div className="feat-card"><h3 className="feat-title">Factures PDF</h3><p className="feat-desc">Créez des factures en XOF avec calcul de TVA et export PDF.</p></div>
      <div className="feat-card"><h3 className="feat-title">Clients</h3><p className="feat-desc">Enregistrez vos clients et retrouvez-les lors de la création d’une facture.</p></div>
      <div className="feat-card"><h3 className="feat-title">Suivi des paiements</h3><p className="feat-desc">Consultez les factures payées, en attente et en retard.</p></div>
      <div className="feat-card"><h3 className="feat-title">Partage par e-mail</h3><p className="feat-desc">Envoyez un lien de facture à votre client lorsque l’envoi d’e-mail est configuré.</p></div>
      <div className="feat-card"><h3 className="feat-title">Lien de paiement</h3><p className="feat-desc">Le parcours Moneroo est disponible lorsque les clés et le webhook sont configurés.</p></div>
      <div className="feat-card"><h3 className="feat-title">Profil d’entreprise</h3><p className="feat-desc">Ajoutez les coordonnées qui doivent apparaître sur vos factures.</p></div>
    </div>
  </div>
</section>

<section className="testi-sec" id="testimonials">
  <div className="container">
    <div className="sec-label text-center">Bêta</div>
    <h2 className="sec-title text-center">Factura est en cours de développement.</h2>
    <p className="sec-sub text-center" style={{marginLeft: 'auto', marginRight: 'auto'}}>Nous n’affichons pas encore de témoignages ni de résultats clients vérifiés. Les fonctions disponibles sont décrites sur cette page.</p>
  </div>
</section>

<section className="pricing-sec" id="pricing">
  <div className="container">
    <div className="pricing-header">
      <div className="sec-label">Disponibilité</div>
      <h2 className="sec-title">Version bêta</h2>
      <p style={{fontSize: '16px', color: 'var(--pierre)'}}>Factura est en cours de développement. Les abonnements et leurs tarifs ne sont pas encore disponibles.</p>
    </div>
    <div className="pricing-grid">
      <div className="pc"><div className="pc-name">Fonctions disponibles</div><div className="pc-div"></div><ul className="pc-features"><li className="pc-feature">Création de factures en XOF et PDF</li><li className="pc-feature">Gestion de clients</li><li className="pc-feature">Suivi du statut des factures</li><li className="pc-feature">Paiement en ligne selon la configuration du compte</li></ul><Link href="/register" className="pc-cta pc-cta--outline">Essayer la bêta</Link></div>
    </div>
  </div>
</section>

<section className="faq-sec" id="faq">
  <div className="container">
    <div className="faq-header"><div className="sec-label">Questions fréquentes</div><h2 className="sec-title">À propos de la bêta</h2></div>
    <div className="faq-grid">
      <details><summary>Les relances WhatsApp sont-elles disponibles ?</summary><div className="faq-body">Non. Les relances automatiques WhatsApp ne sont pas encore disponibles. Vous pouvez suivre les échéances et contacter vos clients vous-même.</div></details>
      <details><summary>Puis-je recevoir un paiement en ligne ?</summary><div className="faq-body">Le parcours Moneroo est en cours d’intégration. Il fonctionne uniquement si le compte marchand, les clés serveur et le webhook sont configurés.</div></details>
      <details><summary>Quels sont les tarifs ?</summary><div className="faq-body">Les offres payantes ne sont pas encore ouvertes. Les conditions et tarifs seront publiés avant leur mise en vente.</div></details>
    </div>
  </div>
</section>

<section className="cta-sec">
  <svg className="pat-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="cta-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <polygon points="20,1 39,20 20,39 1,20" fill="none" stroke="#fff" strokeWidth=".8" opacity=".25" />
      <polygon points="20,9 31,20 20,31 9,20" fill="none" stroke="#E8A020" strokeWidth=".6" opacity=".35" />
      <circle cx="20" cy="20" r="1.8" fill="#E8A020" opacity=".4" />
      <circle cx="0" cy="0" r="1.2" fill="#fff" opacity=".15" />
      <circle cx="40" cy="0" r="1.2" fill="#fff" opacity=".15" />
      <circle cx="0" cy="40" r="1.2" fill="#fff" opacity=".15" />
      <circle cx="40" cy="40" r="1.2" fill="#fff" opacity=".15" />
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#cta-pat)" />
  </svg>
  <div className="cta-inner container">
    <h2 className="cta-title">
      Arrêtez de courir<br />après vos <em>paiements.</em>
    </h2>
    <p className="cta-sub">Créez vos factures et suivez les paiements dans une application en bêta.</p>
    <Link href="/register" className="cta-btn">
      Créer un compte
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Link>
    <div className="cta-trust">Création de factures en XOF · Export PDF · Suivi des échéances</div>
  </div>
</section>


{/* ══════════════════════════════════
     FOOTER
══════════════════════════════════ */}
<footer className="footer">
  <div className="container">
    <div className="footer-top">
      <div className="footer-brand">
        <div className="footer-logo"><span className="ff">F</span>actura ✓</div>
        <p className="footer-tagline">Envoyez la facture. On s&apos;occupe du reste. Application de facturation en bêta.</p>
        <div style={{marginTop: '20px'}}>
          <div className="footer-countries">






          </div>
        </div>
      </div>

      <div>
        <div className="footer-col-title">Produit</div>
        <ul className="footer-links">
          <li><span>Fonctionnalités</span></li>
          <li><span>Tarifs</span></li>
          <li><span>Intégrations Mobile Money</span></li>
          <li><span>Modèles de factures</span></li>
          <li><span>API Développeurs</span></li>
        </ul>
      </div>

      <div>
        <div className="footer-col-title">Ressources</div>
        <ul className="footer-links">
          <li><span>Guide de démarrage</span></li>
          <li><span>Documentation</span></li>
          <li><span>Blog</span></li>
          <li><span>Cas clients</span></li>
          <li><span>FAQ</span></li>
        </ul>
      </div>

      <div>
        <div className="footer-col-title">Entreprise</div>
        <ul className="footer-links">
          <li><span>À propos</span></li>
          <li><span>Contact</span></li>
          <li><span>WhatsApp Support</span></li>
          <li><span>Partenaires</span></li>
          <li><span>Presse</span></li>
        </ul>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="footer-copy">© 2026 Factura. Tous droits réservés.</div>
      <div className="footer-legal"><span>Informations légales à compléter avant lancement.</span></div>
  </div>
</div>
</footer>



    </>
  )
}
