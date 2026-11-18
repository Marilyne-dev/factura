"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  // Mettre à true uniquement quand les témoignages sont de vraies citations de vrais clients
  const SHOW_TESTIMONIALS = false

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
        <Link href="/register" className="nav-cta">Commencer gratuitement</Link>
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
        <div className="hero-eyebrow">WhatsApp · Mobile Money · XOF &amp; EUR</div>
        <h1 className="hero-title">
          Envoyez la<br />
          facture. <em>On<br />
          s&apos;occupe</em><br />
          du reste.
        </h1>
        <p className="hero-sub">
          Factura relance vos clients impayés via WhatsApp et encaisse en Mobile Money — sans que vous leviez le petit doigt.
        </p>
        <div className="hero-ctas">
          <Link href="/register" className="btn-hero-p">Commencer gratuitement →</Link>
          <a href="#hiw" className="btn-hero-g">Voir la démo ▶</a>
        </div>
        <div className="hero-trust">Pas de carte bancaire · Annulation à tout moment · 5 factures gratuites</div>
        <div className="hero-social">
          <div className="stars">★★★★★</div>
          <span>Utilisé par <strong style={{color: 'rgba(255,255,255,.75)'}}>500+ freelances</strong> et PME en Afrique de l'Ouest</span>
        </div>
      </div>

      {/* Visual */}
      <div className="hero-visual">

        {/* Floating badges */}
        <div className="hero-badge hero-badge-left">
          <div className="hb-ico">💰</div>
          <div>
            <div className="hb-t">+750 000 XOF</div>
            <div className="hb-s">vient d&apos;être encaissé</div>
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
<div className="stats-bar">
  <div className="container">
    <div className="stats-inner">
      <div className="stat-item">
        <div className="stat-n">500+</div>
        <div className="stat-l">freelances & PME actifs</div>
      </div>
      <div className="stat-div"></div>
      <div className="stat-item">
        <div className="stat-n">6</div>
        <div className="stat-l">pays en Afrique de l'Ouest</div>
      </div>
      <div className="stat-div"></div>
      <div className="stat-item">
        <div className="stat-n">−15j</div>
        <div className="stat-l">délai de paiement moyen</div>
      </div>
      <div className="stat-div"></div>
      <div className="stat-item">
        <div className="stat-n">4</div>
        <div className="stat-l">Mobile Money intégrés</div>
      </div>
      <div className="stat-div"></div>
      <div className="stat-item">
        <div className="stat-n">98%</div>
        <div className="stat-l">de taux de livraison WhatsApp</div>
      </div>
    </div>
  </div>
</div>


{/* ══════════════════════════════════
     PAIN
══════════════════════════════════ */}
<section className="pain-sec" id="pain">
  <svg className="pat-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{opacity: '.12'}}>
    <defs><pattern id="pain-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <polygon points="20,1 39,20 20,39 1,20" fill="none" stroke="#fff" strokeWidth=".8"/>
      <circle cx="20" cy="20" r="1.5" fill="#C4521A"/>
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#pain-pat)"/>
  </svg>
  <div className="container" style={{position: 'relative', zIndex: '1'}}>
    <div className="pain-eyebrow">La réalité du terrain</div>
    <h2 className="pain-title">Les factures impayées coûtent plus qu'on ne le croit.</h2>

    <div className="pain-grid">
      <div className="pain-card">
        <div className="pain-big">47<span className="pain-big-unit">j</span></div>
        <div className="pain-card-title">Délai moyen avant paiement</div>
        <div className="pain-card-desc">En Afrique de l'Ouest, un freelance attend en moyenne 47 jours pour être payé. Pendant ce temps, les charges continuent de tomber.</div>
      </div>
      <div className="pain-card">
        <div className="pain-big">6<span className="pain-big-unit">×</span></div>
        <div className="pain-card-title">Relances manuelles par facture</div>
        <div className="pain-card-desc">6 messages, 6 moments de tension avec votre client. Chaque relance manuelle coûte du temps, de l'énergie et parfois la relation.</div>
      </div>
      <div className="pain-card">
        <div className="pain-big">23<span className="pain-big-unit">%</span></div>
        <div className="pain-card-title">Des factures jamais payées</div>
        <div className="pain-card-desc">Faute de suivi systématique, près d'une facture sur quatre finit aux oubliettes. De l'argent gagné, mais jamais encaissé.</div>
      </div>
    </div>

    <div className="pain-bottom">
      <div className="pain-bottom-ico">💡</div>
      <div className="pain-bottom-txt">
        <strong>Ce n'est pas un problème de clients difficiles.</strong> C'est un problème de process. Dès que la relance est automatique, systématique et personnalisée — les clients paient. Factura s'en charge à votre place.
      </div>
    </div>
  </div>
</section>


{/* ══════════════════════════════════
     HOW IT WORKS
══════════════════════════════════ */}
<section className="hiw-sec" id="hiw">
  <div className="container">
    <div className="sec-label">Comment ça marche</div>
    <h2 className="sec-title">Trois étapes. Zéro effort.</h2>
    <p className="sec-sub">Pas de formation, pas d'intégration complexe. Vous créez une facture, Factura fait le reste.</p>

    <div className="hiw-steps">
      <div className="hiw-step">
        <div className="step-num">01</div>
        <div className="step-icon">📄</div>
        <h3 className="step-title">Créez votre facture en 3 minutes</h3>
        <p className="step-desc">Depuis Factura ou importée depuis vos outils existants. Votre logo, votre numéro de facture, les détails de votre prestation — en XOF ou EUR.</p>
        <div className="step-tag">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#0F3D2A" strokeWidth="1.2"/><path d="M4 6l1.5 1.5L8 4" stroke="#0F3D2A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          PDF automatique
        </div>
      </div>

      <div className="hiw-step">
        <div className="step-num">02</div>
        <div className="step-icon">📱</div>
        <h3 className="step-title">Factura relance à votre place</h3>
        <p className="step-desc">J+3, J+7, J+14, J+30... Chaque message WhatsApp est personnalisé avec le nom du client, le montant exact et un lien de paiement direct. Vos clients croient que vous écrivez vous-même.</p>
        <div className="step-tag">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#0F3D2A" strokeWidth="1.2"/><path d="M4 6l1.5 1.5L8 4" stroke="#0F3D2A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          100% automatique
        </div>
      </div>

      <div className="hiw-step">
        <div className="step-num">03</div>
        <div className="step-icon">✅</div>
        <h3 className="step-title">Votre client paie. Vous encaissez.</h3>
        <p className="step-desc">Orange Money, Wave, MTN MoMo, Moov Money, carte bancaire. L'argent arrive sur votre compte. Vous recevez une notification instantanée. La facture est clôturée.</p>
        <div className="step-tag">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#0F3D2A" strokeWidth="1.2"/><path d="M4 6l1.5 1.5L8 4" stroke="#0F3D2A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          4 opérateurs Mobile Money
        </div>
      </div>
    </div>
  </div>
</section>


{/* ══════════════════════════════════
     FEATURES
══════════════════════════════════ */}
<section className="feat-sec" id="features">
  <svg className="pat-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="feat-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <polygon points="20,1 39,20 20,39 1,20" fill="none" stroke="#fff" strokeWidth=".7" opacity=".25"/>
      <polygon points="20,9 31,20 20,31 9,20" fill="none" stroke="#E8A020" strokeWidth=".5" opacity=".3"/>
      <circle cx="20" cy="20" r="1.5" fill="#E8A020" opacity=".3"/>
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#feat-pat)"/>
  </svg>
  <div className="container" style={{position: 'relative', zIndex: '1'}}>
    <div className="sec-label">Fonctionnalités</div>
    <h2 className="sec-title" style={{color: '#fff'}}>Tout ce dont vous avez besoin.<br />Rien de superflu.</h2>
    <p className="sec-sub" style={{color: 'rgba(255,255,255,.5)'}}>Conçu pour des gens qui n'ont pas de temps à perdre.</p>

    <div className="feat-grid">
      <div className="feat-card">
        <div className="feat-ico">📱</div>
        <h3 className="feat-title">Relances WhatsApp automatiques</h3>
        <p className="feat-desc">Séquences de relance programmées et personnalisées. Le bon message, au bon moment, dans le bon ton — sans que vous y pensiez.</p>
        <div className="feat-pill">J+3 · J+7 · J+14 · J+30</div>
      </div>
      <div className="feat-card">
        <div className="feat-ico">💸</div>
        <h3 className="feat-title">Paiement Mobile Money intégré</h3>
        <p className="feat-desc">Orange Money, Wave, MTN MoMo, Moov Money. Chaque lien de paiement est personnalisé par facture. L'encaissement est instantané.</p>
        <div className="feat-pill">4 opérateurs · Carte Visa/MC</div>
      </div>
      <div className="feat-card">
        <div className="feat-ico">🧾</div>
        <h3 className="feat-title">Factures professionnelles en XOF</h3>
        <p className="feat-desc">PDF propre à votre image, numérotation automatique, TVA calculée, mentions légales. Prêt à envoyer en 3 minutes.</p>
        <div className="feat-pill">XOF · EUR · PDF + lien</div>
      </div>
      <div className="feat-card">
        <div className="feat-ico">📊</div>
        <h3 className="feat-title">Tableau de bord en temps réel</h3>
        <p className="feat-desc">Ce qui est payé, ce qui attend, ce qui est en retard. Vos KPIs financiers au premier coup d'œil, sur mobile comme sur desktop.</p>
        <div className="feat-pill">Temps réel · Mobile-first</div>
      </div>
      <div className="feat-card">
        <div className="feat-ico">👥</div>
        <h3 className="feat-title">Gestion multi-clients</h3>
        <p className="feat-desc">Carnet de clients centralisé. Historique complet de chaque relation. Savoir en un clin d'œil qui paye bien et qui il faut surveiller.</p>
        <div className="feat-pill">Historique · Scoring client</div>
      </div>
      <div className="feat-card">
        <div className="feat-ico">🌍</div>
        <h3 className="feat-title">Europe-ready</h3>
        <p className="feat-desc">Basculez en EUR et SEPA en un clic. Factura est conçu pour une expansion sans friction — de Dakar à Paris, de Lomé à Bruxelles.</p>
        <div className="feat-pill">XOF → EUR · SEPA</div>
      </div>
    </div>
  </div>
</section>


{/* ══════════════════════════════════
     TESTIMONIALS
══════════════════════════════════ */}
{SHOW_TESTIMONIALS && (
<section className="testi-sec" id="testimonials">
  <div className="container">
    <div className="sec-label text-center">Témoignages</div>
    <h2 className="sec-title text-center">Ils font confiance à Factura</h2>
    <p className="sec-sub text-center" style={{marginLeft: 'auto', marginRight: 'auto'}}>Des freelances et gérants de PME qui ont arrêté de courir après leurs paiements.</p>

    <div className="testi-grid">
      <div className="testi-card">
        <div className="testi-stars">★★★★★</div>
        <p className="testi-quote">
          "Avant Factura, je passais deux heures par semaine à envoyer des rappels. Maintenant c'est zéro. Un client qui ne payait jamais en moins de 45 jours le fait en <strong>8 jours en moyenne</strong> depuis que les relances sont automatiques."
        </p>
        <div className="testi-author">
          <div className="testi-avatar">AK</div>
          <div>
            <div className="testi-name">Amadou Keïta</div>
            <div className="testi-role">Développeur web freelance · Dakar, SN</div>
          </div>
        </div>
      </div>
      <div className="testi-card">
        <div className="testi-stars">★★★★★</div>
        <p className="testi-quote">
          "J'ai récupéré <strong>1,2 million XOF</strong> de factures que j'avais presque abandonnées. Factura a envoyé les relances, mes clients ont payé. Je n'ai rien fait. C'est exactement la promesse."
        </p>
        <div className="testi-author">
          <div className="testi-avatar" style={{background: 'var(--gold)', color: 'var(--nuit)'}}>AM</div>
          <div>
            <div className="testi-name">Awa Mensah</div>
            <div className="testi-role">Directrice agence créative · Abidjan, CI</div>
          </div>
        </div>
      </div>
      <div className="testi-card">
        <div className="testi-stars">★★★★★</div>
        <p className="testi-quote">
          "Ce que j'aime, c'est que mes clients <strong>ne savent pas que c'est automatique</strong>. Les messages ont l'air d'être écrits par moi. Ça maintient la relation tout en assurant le paiement."
        </p>
        <div className="testi-author">
          <div className="testi-avatar" style={{background: 'var(--terra)'}}>KA</div>
          <div>
            <div className="testi-name">Kossi Agbéko</div>
            <div className="testi-role">Consultant RH indépendant · Lomé, TG</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
)}


{/* ══════════════════════════════════
     PRICING
══════════════════════════════════ */}
<section className="pricing-sec" id="pricing">
  <div className="container">
    <div className="pricing-header">
      <div className="sec-label">Tarifs</div>
      <h2 className="sec-title">Simple et transparent — en XOF</h2>
      <p style={{fontSize: '16px', color: 'var(--pierre)'}}>Commencez gratuitement. Passez au Pro quand vous êtes prêt.</p>
    </div>

    <div className="pricing-grid">

      {/* Free */}
      <div className="pc">
        <div className="pc-name">Gratuit</div>
        <div className="pc-price">
          <div className="pc-amount"><span className="pc-currency">XOF</span> 0</div>
          <div className="pc-period">pour toujours</div>
        </div>
        <Link href="/register" className="pc-cta pc-cta--outline">Commencer gratuitement</Link>
        <div className="pc-div"></div>
        <ul className="pc-features">
          <li className="pc-feature"><span className="pc-check">✓</span>5 factures par mois</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Relances WhatsApp basiques (J+7, J+30)</li>
          <li className="pc-feature"><span className="pc-check">✓</span>1 intégration Mobile Money</li>
          <li className="pc-feature"><span className="pc-check">✓</span>PDF de facture professionnel</li>
          <li className="pc-feature"><span className="pc-cross" style={{color: '#ddd', fontSize: '16px'}}>—</span>Analytics avancés</li>
          <li className="pc-feature"><span className="pc-cross" style={{color: '#ddd', fontSize: '16px'}}>—</span>Relances personnalisées</li>
        </ul>
      </div>

      {/* Pro */}
      <div className="pc pc--pro">
        <div className="pc-badge">Le plus populaire</div>
        <div className="pc-name">Pro</div>
        <div className="pc-price">
          <div className="pc-amount"><span className="pc-currency">XOF</span> 9 900</div>
          <div className="pc-period">par mois · ≈ 15€</div>
        </div>
        <Link href="/register" className="pc-cta pc-cta--gold">Essayer 14 jours gratuits</Link>
        <div className="pc-div"></div>
        <ul className="pc-features">
          <li className="pc-feature"><span className="pc-check">✓</span>Factures illimitées</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Toutes les intégrations Mobile Money</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Relances personnalisées (J+3, J+7, J+14, J+30)</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Analytics — encaissé, en attente, en retard</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Paiement par carte bancaire</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Support par WhatsApp</li>
        </ul>
      </div>

      {/* Business */}
      <div className="pc">
        <div className="pc-name">Business</div>
        <div className="pc-price">
          <div className="pc-amount"><span className="pc-currency">XOF</span> 24 900</div>
          <div className="pc-period">par mois · ≈ 38€</div>
        </div>
        <Link href="/register" className="pc-cta pc-cta--outline">Contacter l'équipe</Link>
        <div className="pc-div"></div>
        <ul className="pc-features">
          <li className="pc-feature"><span className="pc-check">✓</span>Tout ce qui est inclus dans Pro</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Jusqu'à 5 utilisateurs</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Accès API pour intégrations</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Rapports exportables (Excel, PDF)</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Support prioritaire dédié</li>
          <li className="pc-feature"><span className="pc-check">✓</span>Multi-devises XOF + EUR</li>
        </ul>
      </div>

    </div>
  </div>
</section>


{/* ══════════════════════════════════
     FAQ
══════════════════════════════════ */}
<section className="faq-sec" id="faq">
  <div className="container">
    <div className="faq-header">
      <div className="sec-label">Questions fréquentes</div>
      <h2 className="sec-title">Tout ce que vous voulez savoir</h2>
    </div>
    <div className="faq-grid">

      <details>
        <summary>Mes clients sauront-ils que les relances sont automatiques ?</summary>
        <div className="faq-body">Non. Chaque message WhatsApp est envoyé depuis votre numéro professionnel et personnalisé avec le prénom du client, le montant exact et le numéro de facture. <strong>Vos clients ont l'impression que vous écrivez vous-même.</strong> C'est ça qui rend Factura efficace sans abîmer la relation client.</div>
      </details>

      <details>
        <summary>Quels opérateurs Mobile Money sont disponibles ?</summary>
        <div className="faq-body">Factura intègre <strong>Orange Money, Wave, MTN MoMo et Moov Money</strong> — couvrant le Sénégal, la Côte d'Ivoire, le Togo, le Bénin, le Mali et le Burkina Faso. Le paiement par <strong>carte bancaire Visa et Mastercard</strong> est également disponible pour vos clients en Europe.</div>
      </details>

      <details>
        <summary>Puis-je utiliser Factura si je travaille aussi avec des clients en Europe ?</summary>
        <div className="faq-body">Oui. Factura supporte les <strong>factures en EUR</strong> et les virements SEPA. Vous pouvez gérer vos clients africains en XOF et vos clients européens en EUR depuis le même tableau de bord, sans friction.</div>
      </details>

      <details>
        <summary>Est-ce que mes données financières sont sécurisées ?</summary>
        <div className="faq-body">Oui. Toutes les données sont <strong>chiffrées en AES-256</strong>, hébergées en Europe (RGPD), avec SSL/TLS sur toutes les communications. Nous ne stockons jamais les informations de paiement de vos clients — elles sont gérées directement par les opérateurs (FedaPay, CinetPay).</div>
      </details>

      <details>
        <summary>Que se passe-t-il si je dépasse les 5 factures gratuites ?</summary>
        <div className="faq-body">Vous recevez une notification et vous pouvez <strong>passer au plan Pro à tout moment</strong>, sans interruption de service. Il n'y a pas de limite surprise — vous décidez en connaissance de cause.</div>
      </details>

      <details>
        <summary>Puis-je annuler mon abonnement à tout moment ?</summary>
        <div className="faq-body">Oui. <strong>Aucun engagement, aucune pénalité.</strong> Vous annulez depuis votre compte en 30 secondes. Vos données restent accessibles en lecture pendant 30 jours après l'annulation.</div>
      </details>

    </div>
  </div>
</section>


{/* ══════════════════════════════════
     FINAL CTA
══════════════════════════════════ */}
<section className="cta-sec">
  <svg className="pat-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="cta-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <polygon points="20,1 39,20 20,39 1,20" fill="none" stroke="#fff" strokeWidth=".8" opacity=".25"/>
      <polygon points="20,9 31,20 20,31 9,20" fill="none" stroke="#E8A020" strokeWidth=".6" opacity=".35"/>
      <circle cx="20" cy="20" r="1.8" fill="#E8A020" opacity=".4"/>
      <circle cx="0"  cy="0"  r="1.2" fill="#fff" opacity=".15"/>
      <circle cx="40" cy="0"  r="1.2" fill="#fff" opacity=".15"/>
      <circle cx="0"  cy="40" r="1.2" fill="#fff" opacity=".15"/>
      <circle cx="40" cy="40" r="1.2" fill="#fff" opacity=".15"/>
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#cta-pat)"/>
  </svg>
  <div className="cta-inner container">
    <h2 className="cta-title">
      Arrêtez de courir<br />après vos <em>paiements.</em>
    </h2>
    <p className="cta-sub">Rejoignez 500+ freelances et PME qui encaissent à l'heure — sans effort, sans tension.</p>
    <Link href="/register" className="cta-btn">
      Commencer gratuitement
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </Link>
    <div className="cta-trust">Pas de carte bancaire · 5 factures gratuites · Annulation à tout moment</div>
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
        <p className="footer-tagline">Envoyez la facture. On s'occupe du reste. Fait pour l'Afrique de l'Ouest et l'Europe.</p>
        <div style={{marginTop: '20px'}}>
          <div className="footer-countries">
            <div className="flag-pill">🇸🇳 Sénégal</div>
            <div className="flag-pill">🇨🇮 Côte d'Ivoire</div>
            <div className="flag-pill">🇹🇬 Togo</div>
            <div className="flag-pill">🇧🇯 Bénin</div>
            <div className="flag-pill">🇲🇱 Mali</div>
            <div className="flag-pill">🇫🇷 Europe</div>
          </div>
        </div>
      </div>

      <div>
        <div className="footer-col-title">Produit</div>
        <ul className="footer-links">
          <li><a href="#">Fonctionnalités</a></li>
          <li><a href="#">Tarifs</a></li>
          <li><a href="#">Intégrations Mobile Money</a></li>
          <li><a href="#">Modèles de factures</a></li>
          <li><a href="#">API Développeurs</a></li>
        </ul>
      </div>

      <div>
        <div className="footer-col-title">Ressources</div>
        <ul className="footer-links">
          <li><a href="#">Guide de démarrage</a></li>
          <li><a href="#">Documentation</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Cas clients</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>

      <div>
        <div className="footer-col-title">Entreprise</div>
        <ul className="footer-links">
          <li><a href="#">À propos</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">WhatsApp Support</a></li>
          <li><a href="#">Partenaires</a></li>
          <li><a href="#">Presse</a></li>
        </ul>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="footer-copy">© 2026 Factura. Tous droits réservés.</div>
      <div className="footer-legal">
        <a href="#">Confidentialité</a>
        <a href="#">Conditions d'utilisation</a>
        <a href="#">Cookies</a>
        <a href="#">RGPD</a>
      </div>
    </div>
  </div>
</footer>


    </>
  )
}
