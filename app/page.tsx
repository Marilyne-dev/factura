import Link from 'next/link'
import './landing.css'

export const metadata = {
  title: 'Factura — Envoyez la facture. On s\'occupe du reste.',
  description: 'Factura crée vos factures, relance vos clients sur WhatsApp, et vous fait encaisser en Mobile Money.',
}

export default function Home() {
  return (
    <>
      <div className="lp" style={{width: "100%", background: "#F7F5EF"}}>

        {/* EN-TETE + HERO (bleu nuit) */}
        <div style={{background: "#0D1B3E", color: "#ffffff"}}>
          <header style={{maxWidth: "1200px", margin: "0 auto", padding: "20px 24px", boxSizing: "border-box", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px"}}>
            <a href="#" aria-label="Factura, accueil" style={{display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#ffffff"}}>
              <span style={{width: "36px", height: "36px", borderRadius: "8px", background: "#FFCC00", color: "#0D1B3E", display: "inline-flex", alignItems: "center", justifyContent: "center"}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"></path><path d="M10 14l2 2 3.5-4"></path></svg>
              </span>
              <span style={{fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "24px", letterSpacing: "-0.02em"}}>Factura</span>
            </a>
            <nav aria-label="Navigation principale" style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 28px"}}>
              <a href="#etapes" style={{color: "#ffffff", textDecoration: "none", fontWeight: "500", fontSize: "15px"}}>Comment ça marche</a>
              <a href="#fonctions" style={{color: "#ffffff", textDecoration: "none", fontWeight: "500", fontSize: "15px"}}>Fonctions</a>
              <a href="#tarifs" style={{color: "#ffffff", textDecoration: "none", fontWeight: "500", fontSize: "15px"}}>Tarifs</a>
              <a href="#faq" style={{color: "#ffffff", textDecoration: "none", fontWeight: "500", fontSize: "15px"}}>FAQ</a>
              <Link href="/login" style={{color: "#ffffff", fontWeight: "600", fontSize: "15px"}}>Se connecter</Link>
              <Link href="/register" style={{display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 22px", borderRadius: "8px", background: "#FFCC00", color: "#0D1B3E", fontWeight: "700", fontSize: "15px", textDecoration: "none"}}>Créer ma première facture</Link>
            </nav>
          </header>

          <section style={{maxWidth: "1200px", margin: "0 auto", padding: "56px 24px 96px", boxSizing: "border-box", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "56px"}}>
            <div style={{flex: "1 1 460px", minWidth: "0", display: "flex", flexDirection: "column", gap: "24px", alignItems: "flex-start"}}>
              <span style={{display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", border: "1.5px solid #78B4FF", color: "#ffffff", fontSize: "13px", fontWeight: "600"}}>
                <span style={{width: "8px", height: "8px", borderRadius: "50%", background: "#FFCC00"}}></span>
                Produit en bêta : nous construisons en public
              </span>
              <h1 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "clamp(40px,5.2vw,68px)", lineHeight: "1.04", letterSpacing: "-0.03em", color: "#ffffff"}}>Envoyez la facture. <span style={{color: "#FFCC00"}}>On s'occupe du reste.</span></h1>
              <p style={{margin: "0", fontSize: "20px", lineHeight: "1.5", color: "#C9D2EA", maxWidth: "540px"}}>Factura crée vos factures, relance vos clients sur WhatsApp, et vous fait encaisser en Mobile Money.</p>
              <div style={{display: "flex", flexWrap: "wrap", gap: "12px"}}>
                <Link href="/register" style={{display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px", height: "48px", padding: "0 26px", borderRadius: "8px", background: "#FFCC00", color: "#0D1B3E", fontWeight: "700", fontSize: "16px", textDecoration: "none"}}>Créer ma première facture
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg>
                </Link>
                <a href="#demo" style={{display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 26px", borderRadius: "8px", border: "2px solid #ffffff", color: "#ffffff", fontWeight: "600", fontSize: "16px", textDecoration: "none", boxSizing: "border-box"}}>Voir la démo</a>
              </div>
              <p style={{margin: "0", fontSize: "14px", color: "#C9D2EA"}}>5 factures gratuites par mois · Sans carte · Annulation à tout moment</p>
            </div>

            {/* Produit réel : facture, relance, payée */}
            <div style={{flex: "1 1 440px", minWidth: "0", display: "flex", flexDirection: "column", gap: "16px"}}>
              <div style={{background: "#ffffff", color: "#0D1B3E", borderRadius: "16px", padding: "24px", boxShadow: "0 24px 48px -16px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", gap: "20px"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px"}}>
                  <div>
                    <div style={{fontSize: "13px", color: "#4A5575", fontWeight: "600"}}>Facture FAC-2026-014</div>
                    <div style={{fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "20px"}}>Studio Abomey</div>
                  </div>
                  <span style={{padding: "4px 10px", borderRadius: "6px", background: "#F7F5EF", color: "#4A5575", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em"}}>Exemple</span>
                </div>
                <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px"}}>
                  <div style={{fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "40px", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums"}}>150 000 XOF</div>
                  <span style={{display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "999px", background: "#F9E0E0", color: "#A52A2A", fontSize: "12px", fontWeight: "700"}}><span style={{width: "8px", height: "8px", borderRadius: "50%", background: "#D64545"}}></span>En retard · 3 jours</span>
                </div>
                <div style={{height: "1px", background: "#E3E0D5"}}></div>
                <div>
                  <div style={{fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5575", marginBottom: "12px"}}>Séquence de relance WhatsApp</div>
                  <div style={{display: "flex", gap: "8px"}}>
                    <div style={{flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px"}}>
                      <span style={{width: "32px", height: "32px", borderRadius: "50%", background: "#0D1B3E", color: "#FFCC00", display: "inline-flex", alignItems: "center", justifyContent: "center"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"></path></svg></span>
                      <span style={{fontSize: "13px", fontWeight: "700"}}>J+3</span><span style={{fontSize: "12px", color: "#4A5575"}}>Envoyée</span>
                    </div>
                    <div style={{flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px"}}>
                      <span style={{width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #0D1B3E", boxSizing: "border-box"}}></span>
                      <span style={{fontSize: "13px", fontWeight: "700"}}>J+7</span><span style={{fontSize: "12px", color: "#4A5575"}}>Prévue</span>
                    </div>
                    <div style={{flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px"}}>
                      <span style={{width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #0D1B3E", boxSizing: "border-box"}}></span>
                      <span style={{fontSize: "13px", fontWeight: "700"}}>J+14</span><span style={{fontSize: "12px", color: "#4A5575"}}>Prévue</span>
                    </div>
                    <div style={{flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px"}}>
                      <span style={{width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #0D1B3E", boxSizing: "border-box"}}></span>
                      <span style={{fontSize: "13px", fontWeight: "700"}}>J+30</span><span style={{fontSize: "12px", color: "#4A5575"}}>Prévue</span>
                    </div>
                  </div>
                </div>
                <div style={{background: "#F7F5EF", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", color: "#4A5575"}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H10l-6 4z"></path></svg>
                    Aperçu du message · J+3
                  </div>
                  <p style={{margin: "0", fontSize: "15px", lineHeight: "1.5"}}>Bonjour Rose, votre facture FAC-2026-014 de 150 000 XOF est échue depuis 3 jours. Payez en un clic avec Wave ou Orange Money : <span style={{fontWeight: "700", textDecoration: "underline"}}>[lien de paiement]</span></p>
                </div>
              </div>
              <div style={{background: "#16295C", border: "1px solid #2F4585", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px"}}>
                <span style={{width: "40px", height: "40px", borderRadius: "50%", background: "#FFCC00", color: "#0D1B3E", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"></path></svg></span>
                <div>
                  <div style={{fontWeight: "700", fontSize: "15px", color: "#ffffff"}}>Paiement reçu en Mobile Money</div>
                  <div style={{fontSize: "14px", color: "#C9D2EA"}}>La facture passe à « Payée ». Les relances s'arrêtent d'elles-mêmes.</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* PROBLEME */}
        <section style={{maxWidth: "1200px", margin: "0 auto", padding: "96px 24px 48px", boxSizing: "border-box"}}>
          <div style={{maxWidth: "720px", marginBottom: "40px"}}>
            <div style={{fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#4A5575", marginBottom: "12px"}}>Le problème</div>
            <h2 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "clamp(30px,3.6vw,44px)", lineHeight: "1.12", letterSpacing: "-0.02em"}}>Se faire payer ne devrait pas être un deuxième métier.</h2>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px"}}>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
              <div style={{fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "32px", color: "#0D1B3E"}}>01</div>
              <p style={{margin: "0", fontSize: "17px", lineHeight: "1.55"}}>Vous avez envoyé la facture il y a trois semaines. Le client a lu votre message. Aucune réponse.</p>
            </article>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
              <div style={{fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "32px", color: "#0D1B3E"}}>02</div>
              <p style={{margin: "0", fontSize: "17px", lineHeight: "1.55"}}>Relancer, c'est réécrire le même message gênant, sans savoir si c'est trop tôt ou trop tard.</p>
            </article>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
              <div style={{fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "32px", color: "#0D1B3E"}}>03</div>
              <p style={{margin: "0", fontSize: "17px", lineHeight: "1.55"}}>Le virement arrive sur Mobile Money. Vous cherchez quelle facture il règle, dans quel cahier, dans quel fichier.</p>
            </article>
          </div>
        </section>

        {/* 3 ETAPES */}
        <section id="etapes" style={{background: "#0D1B3E", color: "#ffffff", marginTop: "48px"}}>
          <div style={{maxWidth: "1200px", margin: "0 auto", padding: "88px 24px", boxSizing: "border-box"}}>
            <div style={{maxWidth: "720px", marginBottom: "48px"}}>
              <div style={{fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#78B4FF", marginBottom: "12px"}}>Comment ça marche</div>
              <h2 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "clamp(30px,3.6vw,44px)", lineHeight: "1.12", letterSpacing: "-0.02em", color: "#ffffff"}}>Trois étapes. Puis Factura prend le relais.</h2>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px"}}>
              <div style={{border: "1px solid #2F4585", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
                <span style={{width: "40px", height: "40px", borderRadius: "50%", background: "#FFCC00", color: "#0D1B3E", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "18px"}}>1</span>
                <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "24px"}}>Créez</h3>
                <p style={{margin: "0", color: "#C9D2EA", fontSize: "16px"}}>Client, lignes, montant en XOF. Votre profil d'entreprise s'affiche sur chaque facture.</p>
              </div>
              <div style={{border: "1px solid #2F4585", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
                <span style={{width: "40px", height: "40px", borderRadius: "50%", background: "#FFCC00", color: "#0D1B3E", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "18px"}}>2</span>
                <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "24px"}}>Envoyez</h3>
                <p style={{margin: "0", color: "#C9D2EA", fontSize: "16px"}}>Par e-mail ou par lien. Le statut passe à « Envoyée » seulement après un envoi réussi.</p>
              </div>
              <div style={{border: "1px solid #2F4585", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
                <span style={{width: "40px", height: "40px", borderRadius: "50%", background: "#FFCC00", color: "#0D1B3E", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "18px"}}>3</span>
                <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "24px"}}>Encaissez</h3>
                <p style={{margin: "0", color: "#C9D2EA", fontSize: "16px"}}>Relances WhatsApp à J+3, J+7, J+14 et J+30, avec un lien de paiement. Arrêt automatique dès que la facture est payée.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FONCTIONS */}
        <section id="fonctions" style={{maxWidth: "1200px", margin: "0 auto", padding: "96px 24px", boxSizing: "border-box"}}>
          <div style={{maxWidth: "720px", marginBottom: "40px"}}>
            <div style={{fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#4A5575", marginBottom: "12px"}}>Fonctions</div>
            <h2 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "clamp(30px,3.6vw,44px)", lineHeight: "1.12", letterSpacing: "-0.02em"}}>Ce qu'il faut pour se faire payer. Rien de plus.</h2>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "20px"}}>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
              <span style={{width: "44px", height: "44px", borderRadius: "10px", background: "#0D1B3E", color: "#FFCC00", display: "inline-flex", alignItems: "center", justifyContent: "center"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"></path><path d="M14 3v5h5"></path><path d="M10 13h6"></path><path d="M10 17h6"></path></svg></span>
              <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "20px"}}>Factures claires</h3>
              <p style={{margin: "0", color: "#4A5575", fontSize: "16px"}}>TVA exacte. 200 000 XOF HT + 18 % = 236 000 XOF TTC. Modifiables en brouillon, numéros jamais réutilisés.</p>
            </article>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
              <span style={{width: "44px", height: "44px", borderRadius: "10px", background: "#0D1B3E", color: "#FFCC00", display: "inline-flex", alignItems: "center", justifyContent: "center"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H10l-6 4z"></path><path d="M8 9.5h8"></path><path d="M8 12.5h5"></path></svg></span>
              <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "20px"}}>Relances WhatsApp</h3>
              <p style={{margin: "0", color: "#4A5575", fontSize: "16px"}}>Une séquence visible, un aperçu du message avant l'envoi, un journal des relances. Arrêt automatique si payé.</p>
            </article>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
              <span style={{width: "44px", height: "44px", borderRadius: "10px", background: "#0D1B3E", color: "#FFCC00", display: "inline-flex", alignItems: "center", justifyContent: "center"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2"></rect><path d="M11 18h2"></path></svg></span>
              <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "20px"}}>Lien de paiement</h3>
              <p style={{margin: "0", color: "#4A5575", fontSize: "16px"}}>Un lien par facture, Mobile Money et carte. Le client paie en un clic, sans créer de compte.</p>
            </article>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
              <span style={{width: "44px", height: "44px", borderRadius: "10px", background: "#0D1B3E", color: "#FFCC00", display: "inline-flex", alignItems: "center", justifyContent: "center"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 20v-7"></path><path d="M11 20V5"></path><path d="M17 20v-10"></path><path d="M3 21h18"></path></svg></span>
              <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "20px"}}>Tableau de bord exact</h3>
              <p style={{margin: "0", color: "#4A5575", fontSize: "16px"}}>Encaissé, en attente, en retard, taux de recouvrement. Calculés depuis le statut et la date de paiement.</p>
            </article>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
              <span style={{width: "44px", height: "44px", borderRadius: "10px", background: "#0D1B3E", color: "#FFCC00", display: "inline-flex", alignItems: "center", justifyContent: "center"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4 4-6 8-6s8 2 8 6"></path></svg></span>
              <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "20px"}}>Fiche client</h3>
              <p style={{margin: "0", color: "#4A5575", fontSize: "16px"}}>Historique, solde dû, dernière relance et délai moyen de paiement, sur une seule page.</p>
            </article>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px"}}>
              <span style={{width: "44px", height: "44px", borderRadius: "10px", background: "#0D1B3E", color: "#FFCC00", display: "inline-flex", alignItems: "center", justifyContent: "center"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2"></rect><path d="M3.5 10h17"></path><path d="M8 3v4"></path><path d="M16 3v4"></path></svg></span>
              <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "20px"}}>Dates et retards justes</h3>
              <p style={{margin: "0", color: "#4A5575", fontSize: "16px"}}>Dates locales, sans décalage. Une facture échue et impayée passe toute seule à « En retard ».</p>
            </article>
          </div>
        </section>

        {/* DEMO */}
        <section id="demo" style={{maxWidth: "1200px", margin: "0 auto", padding: "0 24px 96px", boxSizing: "border-box"}}>
          <div style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "20px", padding: "48px", display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "center"}}>
            <div style={{flex: "1 1 380px", minWidth: "0", display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-start"}}>
              <h2 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "clamp(28px,3.2vw,40px)", lineHeight: "1.12", letterSpacing: "-0.02em"}}>Essayez avant de vous inscrire.</h2>
              <p style={{margin: "0", color: "#4A5575", fontSize: "17px"}}>Une démo réelle, avec des données d'exemple clairement étiquetées. Créez une facture, voyez la relance, marquez-la payée.</p>
              <Link href="/register" style={{display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 26px", borderRadius: "8px", background: "#0D1B3E", color: "#ffffff", fontWeight: "700", fontSize: "16px", textDecoration: "none"}}>Ouvrir la démo</Link>
            </div>
            <div style={{flex: "1 1 380px", minWidth: "0", background: "#F7F5EF", border: "1px solid #E3E0D5", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px"}}>
              <div style={{display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap"}}>
                <div><div style={{fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5575"}}>Facture</div><div style={{fontWeight: "700"}}>FAC-2026-011</div></div>
                <span style={{alignSelf: "flex-start", padding: "4px 10px", borderRadius: "6px", background: "#ffffff", border: "1px solid #E3E0D5", color: "#4A5575", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em"}}>Démo</span>
              </div>
              <div style={{fontSize: "14px", color: "#4A5575"}}>[Votre entreprise] → Kossi Design SARL</div>
              <div style={{display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #DAD6C8", fontVariantNumeric: "tabular-nums"}}><span>Prestation de conseil</span><span style={{fontWeight: "600"}}>200 000 XOF</span></div>
              <div style={{display: "flex", justifyContent: "space-between", fontVariantNumeric: "tabular-nums", color: "#4A5575"}}><span>TVA 18 %</span><span>36 000 XOF</span></div>
              <div style={{display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "2px solid #0D1B3E", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "22px", fontVariantNumeric: "tabular-nums"}}><span>Total TTC</span><span>236 000 XOF</span></div>
            </div>
          </div>
        </section>

        {/* TARIFS */}
        <section id="tarifs" style={{maxWidth: "1200px", margin: "0 auto", padding: "0 24px 96px", boxSizing: "border-box"}}>
          <div style={{maxWidth: "720px", marginBottom: "40px"}}>
            <div style={{fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#4A5575", marginBottom: "12px"}}>Tarifs</div>
            <h2 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "clamp(30px,3.6vw,44px)", lineHeight: "1.12", letterSpacing: "-0.02em"}}>Des prix en XOF, affichés en entier.</h2>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px", alignItems: "stretch"}}>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px"}}>
              <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "22px"}}>Gratuit</h3>
              <div style={{fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "40px", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums"}}>0 XOF</div>
              <p style={{margin: "0", color: "#4A5575"}}>5 factures par mois, tous les mois.</p>
              <ul style={{margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", flexGrow: "1"}}>
                <li style={{display: "flex", gap: "10px", alignItems: "flex-start"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D1B3E" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex: "none", marginTop: "2px"}}><path d="M5 12.5l4.5 4.5L19 7"></path></svg>Factures et clients</li>
                <li style={{display: "flex", gap: "10px", alignItems: "flex-start"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D1B3E" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex: "none", marginTop: "2px"}}><path d="M5 12.5l4.5 4.5L19 7"></path></svg>Tableau de bord</li>
                <li style={{display: "flex", gap: "10px", alignItems: "flex-start"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D1B3E" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex: "none", marginTop: "2px"}}><path d="M5 12.5l4.5 4.5L19 7"></path></svg>PDF à envoyer vous-même</li>
              </ul>
              <Link href="/register" style={{display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", borderRadius: "8px", border: "2px solid #0D1B3E", color: "#0D1B3E", fontWeight: "700", textDecoration: "none", boxSizing: "border-box"}}>Commencer gratuitement</Link>
            </article>
            <article style={{background: "#0D1B3E", color: "#ffffff", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 20px 40px -16px rgba(13,27,62,0.5)"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px"}}>
                <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "22px"}}>Pro</h3>
                <span style={{padding: "4px 10px", borderRadius: "999px", background: "#FFCC00", color: "#0D1B3E", fontSize: "12px", fontWeight: "800"}}>Relances incluses</span>
              </div>
              <div><span style={{fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "40px", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums"}}>9 900 XOF</span><span style={{color: "#C9D2EA"}}> /mois</span></div>
              <p style={{margin: "0", color: "#C9D2EA"}}>Environ 15 € par mois. Relances WhatsApp automatiques.</p>
              <ul style={{margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", flexGrow: "1"}}>
                <li style={{display: "flex", gap: "10px", alignItems: "flex-start"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex: "none", marginTop: "2px"}}><path d="M5 12.5l4.5 4.5L19 7"></path></svg>Factures illimitées</li>
                <li style={{display: "flex", gap: "10px", alignItems: "flex-start"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex: "none", marginTop: "2px"}}><path d="M5 12.5l4.5 4.5L19 7"></path></svg>Séquence J+3, J+7, J+14, J+30</li>
                <li style={{display: "flex", gap: "10px", alignItems: "flex-start"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex: "none", marginTop: "2px"}}><path d="M5 12.5l4.5 4.5L19 7"></path></svg>Liens de paiement Mobile Money et carte</li>
              </ul>
              <Link href="/register" style={{display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", borderRadius: "8px", background: "#FFCC00", color: "#0D1B3E", fontWeight: "700", textDecoration: "none"}}>Essayer Pro</Link>
            </article>
            <article style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px"}}>
              <h3 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "700", fontSize: "22px"}}>Business</h3>
              <div><span style={{fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "40px", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums"}}>24 900 XOF</span><span style={{color: "#4A5575"}}> /mois</span></div>
              <p style={{margin: "0", color: "#4A5575"}}>Environ 38 € par mois. Multi-utilisateurs et API.</p>
              <ul style={{margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", flexGrow: "1"}}>
                <li style={{display: "flex", gap: "10px", alignItems: "flex-start"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D1B3E" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex: "none", marginTop: "2px"}}><path d="M5 12.5l4.5 4.5L19 7"></path></svg>Tout Pro</li>
                <li style={{display: "flex", gap: "10px", alignItems: "flex-start"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D1B3E" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex: "none", marginTop: "2px"}}><path d="M5 12.5l4.5 4.5L19 7"></path></svg>Plusieurs utilisateurs</li>
                <li style={{display: "flex", gap: "10px", alignItems: "flex-start"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D1B3E" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flex: "none", marginTop: "2px"}}><path d="M5 12.5l4.5 4.5L19 7"></path></svg>Accès API</li>
              </ul>
              <Link href="/register" style={{display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", borderRadius: "8px", border: "2px solid #0D1B3E", color: "#0D1B3E", fontWeight: "700", textDecoration: "none", boxSizing: "border-box"}}>Choisir Business</Link>
            </article>
          </div>
          <p style={{margin: "24px 0 0", color: "#4A5575", fontSize: "15px", maxWidth: "820px"}}>Frais Mobile Money : ceux de votre opérateur. L'abonnement se règle par lien de paiement, à chaque échéance. Il n'y a pas de prélèvement automatique.</p>
        </section>

        {/* FAQ */}
        <section id="faq" style={{maxWidth: "860px", margin: "0 auto", padding: "0 24px 96px", boxSizing: "border-box"}}>
          <h2 style={{margin: "0 0 32px", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "clamp(30px,3.6vw,44px)", lineHeight: "1.12", letterSpacing: "-0.02em"}}>Questions fréquentes</h2>
          <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
            <details open style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "12px", padding: "20px 24px"}}>
              <summary className="lp-sum" style={{cursor: "pointer", fontWeight: "700", fontSize: "18px"}}>Faut-il une carte bancaire pour commencer ?</summary>
              <p style={{margin: "12px 0 0", color: "#4A5575", fontSize: "16px"}}>Non. Le plan Gratuit donne 5 factures par mois, tous les mois, sans carte. Vous pouvez annuler à tout moment.</p>
            </details>
            <details style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "12px", padding: "20px 24px"}}>
              <summary className="lp-sum" style={{cursor: "pointer", fontWeight: "700", fontSize: "18px"}}>L'abonnement est-il prélevé automatiquement ?</summary>
              <p style={{margin: "12px 0 0", color: "#4A5575", fontSize: "16px"}}>Non. Vous recevez un lien de paiement Mobile Money à chaque échéance. Rien n'est prélevé sans votre action.</p>
            </details>
            <details style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "12px", padding: "20px 24px"}}>
              <summary className="lp-sum" style={{cursor: "pointer", fontWeight: "700", fontSize: "18px"}}>Qui paie les frais Mobile Money ?</summary>
              <p style={{margin: "12px 0 0", color: "#4A5575", fontSize: "16px"}}>Ce sont les frais de votre opérateur. Ils sont indiqués sur la page Tarifs.</p>
            </details>
            <details style={{background: "#ffffff", border: "1px solid #E3E0D5", borderRadius: "12px", padding: "20px 24px"}}>
              <summary className="lp-sum" style={{cursor: "pointer", fontWeight: "700", fontSize: "18px"}}>Factura est-il terminé ?</summary>
              <p style={{margin: "12px 0 0", color: "#4A5575", fontSize: "16px"}}>Non. Factura est en bêta et nous construisons en public. Rejoignez la liste d'attente pour tester en avance et nous dire ce qui manque.</p>
            </details>
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={{background: "#0D1B3E", color: "#ffffff"}}>
          <div style={{maxWidth: "1200px", margin: "0 auto", padding: "80px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "24px"}}>
            <h2 style={{margin: "0", fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "clamp(32px,4.2vw,52px)", lineHeight: "1.1", letterSpacing: "-0.02em", maxWidth: "760px", color: "#ffffff"}}>Envoyez la facture. <span style={{color: "#FFCC00"}}>On s'occupe du reste.</span></h2>
            <div style={{display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center"}}>
              <Link href="/register" style={{display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 28px", borderRadius: "8px", background: "#FFCC00", color: "#0D1B3E", fontWeight: "700", fontSize: "16px", textDecoration: "none"}}>Créer ma première facture</Link>
              <a href="#tarifs" style={{display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 28px", borderRadius: "8px", border: "2px solid #ffffff", color: "#ffffff", fontWeight: "600", fontSize: "16px", textDecoration: "none", boxSizing: "border-box"}}>Voir les tarifs</a>
            </div>
            <p style={{margin: "0", fontSize: "14px", color: "#C9D2EA"}}>5 factures gratuites par mois · Sans carte · Annulation à tout moment</p>
          </div>
        </section>

        {/* PIED DE PAGE */}
        <footer style={{background: "#08122C", color: "#C9D2EA"}}>
          <div style={{maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", boxSizing: "border-box", display: "flex", flexWrap: "wrap", gap: "24px 48px", justifyContent: "space-between", alignItems: "flex-start"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <span style={{fontFamily: "'Outfit',sans-serif", fontWeight: "800", fontSize: "22px", color: "#ffffff"}}>Factura</span>
              <span style={{fontSize: "14px"}}>© 2026 Factura. Produit en bêta.</span>
            </div>
            <nav aria-label="Pied de page" style={{display: "flex", flexWrap: "wrap", gap: "12px 28px", fontSize: "14px"}}>
              <a href="#" style={{color: "#C9D2EA"}}>Mentions légales</a>
              <a href="#" style={{color: "#C9D2EA"}}>Confidentialité</a>
              <a href="#" style={{color: "#C9D2EA"}}>CGV</a>
              <a href="#" style={{color: "#C9D2EA"}}>Cookies</a>
              <a href="#" style={{color: "#C9D2EA"}}>Contact : [E-MAIL DE CONTACT]</a>
            </nav>
          </div>
        </footer>

      </div>
    </>
  )
}
