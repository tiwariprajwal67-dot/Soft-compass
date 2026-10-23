import { useEffect, useLayoutEffect, useRef } from 'react'
import '../../styles/scroll-effects.css'

// Things on the home page that should glide in as you scroll.
// Add a selector here to animate something new. No other file needs to change.
const REVEAL_SELECTORS = [
  '#assessments .eyebrow',
  '#assessments h2',
  '#how-it-works .eyebrow',
  '#how-it-works h2',
  '.how__step',
  '.about__intro > *',
  '.about__item',
  '.contact .eyebrow',
  '.contact h2',
  '.contact__lead',
  '.contact__card',
  '.contact__soon',
]

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ScrollEffects() {
  const barRef = useRef(null)

  // 1) Mark the elements BEFORE the browser paints, so nothing flashes.
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined

    const targets = [...document.querySelectorAll(REVEAL_SELECTORS.join(','))].filter(
      // Skip anything that already has its own entrance animation.
      (el) => !el.classList.contains('fade-up'),
    )

    targets.forEach((el) => {
      const position = Array.from(el.parentElement.children).indexOf(el)
      el.style.setProperty('--reveal-delay', `${Math.min(position, 5) * 0.09}s`)
      el.dataset.reveal = ''
      el.dataset.from = 'bottom'
    })

    // 2) Watch them. Visible = glide in. Fully out of view = reset, remembering
    //    which edge it left through, so it re-enters from that same side.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting, boundingClientRect, rootBounds }) => {
          if (isIntersecting) {
            target.dataset.visible = 'true'
          } else {
            const top = rootBounds ? rootBounds.top : 0
            target.dataset.from = boundingClientRect.top < top ? 'top' : 'bottom'
            delete target.dataset.visible
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    targets.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      targets.forEach((el) => {
        delete el.dataset.reveal
        delete el.dataset.from
        delete el.dataset.visible
        el.style.removeProperty('--reveal-delay')
      })
    }
  }, [])

  // 3) Scroll progress bar and a gentle drift on the hero artwork.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const bar = barRef.current
    const stage = document.querySelector('.hero__stage')
    let frame = 0

    function update() {
      frame = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`
      if (stage) stage.style.translate = `0 ${Math.min(y, 900) * 0.12}px`
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      if (stage) stage.style.removeProperty('translate')
    }
  }, [])

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />
}