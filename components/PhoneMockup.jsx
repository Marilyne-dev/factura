export default function PhoneMockup() {
  return (
    <div className="auth-phone-scale">
      <div className="auth-phone-stage">

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
  )
}