'use client'

import { useEffect, useRef } from 'react'

/* Animations de la page d'accueil : apparition au défilement + barre de progression.
   Rien ne bouge si le visiteur a demandé « réduire les animations » dans son système. */
export default function LandingEffects() {
  const bar = useRef(null)

  useEffect(() => {
    const root = document.querySelector('.lp')
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    // Éléments qui apparaissent en glissant, avec un léger décalage entre voisins
    const groups = [
      '.lp-grid',
      '#demo > div > div',
      '#faq > div > div',
    ]
    const targets = []
    root.querySelectorAll('h2').forEach((el) => { el.dataset.rIdx = '0'; targets.push(el) })
    root.querySelectorAll('#tarifs > p, footer > div').forEach((el) => { el.dataset.rIdx = '1'; targets.push(el) })
    groups.forEach((sel) => {
      root.querySelectorAll(sel).forEach((parent) => {
        Array.from(parent.children).forEach((el, i) => { el.dataset.rIdx = String(i); targets.push(el) })
      })
    })
    root.querySelectorAll('#faq details').forEach((el, i) => { el.dataset.rIdx = String(i); if (!targets.includes(el)) targets.push(el) })

    const uniq = Array.from(new Set(targets))
    uniq.forEach((el) => {
      el.classList.add('lp-r')
      el.style.setProperty('--i', el.dataset.rIdx || '0')
    })
    root.classList.add('lp-anim')

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target
        el.classList.add('lp-in')
        io.unobserve(el)
        // une fois apparu, on libère l'élément pour que les effets au survol fonctionnent
        setTimeout(() => el.classList.remove('lp-r', 'lp-in'), 1600)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    uniq.forEach((el) => io.observe(el))

    // Barre de progression en haut de page
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const h = document.documentElement
        const max = h.scrollHeight - h.clientHeight
        const p = max > 0 ? h.scrollTop / max : 0
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      uniq.forEach((el) => el.classList.remove('lp-r', 'lp-in'))
      root.classList.remove('lp-anim')
    }
  }, [])

  return <div ref={bar} className="lp-progress" aria-hidden="true" />
}
