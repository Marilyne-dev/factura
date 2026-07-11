"use client"

import { useState, useEffect } from 'react'

const slides = [
  {
    caption: 'Créez une facture professionnelle',
    svg: (
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <rect x="120" y="55" width="220" height="290" rx="16" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.12)" />
        <rect x="150" y="90" width="90" height="10" rx="5" fill="rgba(255,255,255,.16)" />
        <rect x="150" y="112" width="140" height="6" rx="3" fill="rgba(255,255,255,.08)" />
        <rect x="150" y="150" width="160" height="1" fill="rgba(255,255,255,.1)" />
        <rect x="150" y="168" width="160" height="8" rx="4" fill="rgba(255,255,255,.09)" />
        <rect x="150" y="188" width="160" height="8" rx="4" fill="rgba(255,255,255,.09)" />
        <rect x="150" y="208" width="160" height="8" rx="4" fill="rgba(255,255,255,.09)" />
        <rect x="150" y="228" width="160" height="1" fill="rgba(255,255,255,.1)" />
        <rect x="150" y="300" width="160" height="34" rx="9" fill="rgba(232,160,32,.14)" stroke="rgba(232,160,32,.35)" />
        <rect x="164" y="311" width="70" height="10" rx="5" fill="rgba(232,160,32,.55)" />
      </svg>
    ),
  },
  {
    caption: 'Relancez automatiquement par WhatsApp',
    svg: (
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <rect x="95" y="45" width="220" height="310" rx="22" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.1)" />
        <rect x="95" y="45" width="220" height="52" rx="22" fill="rgba(255,255,255,.06)" />
        <circle cx="128" cy="71" r="15" fill="rgba(232,160,32,.35)" />
        <rect x="153" y="63" width="80" height="8" rx="4" fill="rgba(255,255,255,.2)" />
        <rect x="153" y="78" width="50" height="6" rx="3" fill="rgba(255,255,255,.12)" />
        <rect x="115" y="122" width="150" height="42" rx="12" fill="rgba(255,255,255,.08)" />
        <rect x="155" y="188" width="145" height="56" rx="12" fill="rgba(232,160,32,.16)" stroke="rgba(232,160,32,.3)" />
        <rect x="115" y="268" width="110" height="30" rx="10" fill="rgba(255,255,255,.08)" />
      </svg>
    ),
  },
  {
    caption: 'Encaissez en Mobile Money',
    svg: (
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <circle cx="200" cy="200" r="95" fill="rgba(232,160,32,.05)" />
        <circle cx="200" cy="200" r="62" fill="none" stroke="rgba(232,160,32,.25)" strokeWidth="2" strokeDasharray="5 7" />
        <circle cx="172" cy="188" r="36" fill="rgba(232,160,32,.18)" stroke="rgba(232,160,32,.4)" />
        <circle cx="226" cy="212" r="36" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.18)" />
        <path d="M150 258 Q200 296 250 258" stroke="rgba(255,255,255,.15)" fill="none" strokeWidth="2" />
        <path d="M180 178 l16 16 l24 -28" stroke="rgba(232,160,32,.6)" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    caption: 'Suivez tout depuis votre dashboard',
    svg: (
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <rect x="100" y="230" width="28" height="90" rx="4" fill="rgba(255,255,255,.12)" />
        <rect x="144" y="190" width="28" height="130" rx="4" fill="rgba(255,255,255,.12)" />
        <rect x="188" y="140" width="28" height="180" rx="4" fill="rgba(232,160,32,.32)" />
        <rect x="232" y="200" width="28" height="120" rx="4" fill="rgba(255,255,255,.12)" />
        <rect x="276" y="165" width="28" height="155" rx="4" fill="rgba(255,255,255,.12)" />
        <path d="M100 210 L144 178 L188 122 L232 182 L276 148" stroke="rgba(232,160,32,.45)" fill="none" strokeWidth="2" />
      </svg>
    ),
  },
]

export default function AuthSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 15000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className="auth-slides">
        {slides.map((slide, i) => (
          <div key={i} className={`auth-slide ${i === index ? 'active' : ''}`}>
            {slide.svg}
          </div>
        ))}
      </div>

      <div className="auth-slide-info">
        <div className="auth-slide-caption">{slides[index].caption}</div>
        <div className="auth-slide-dots">
          {slides.map((_, i) => (
            <span key={i} className={`auth-slide-dot ${i === index ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </>
  )
}