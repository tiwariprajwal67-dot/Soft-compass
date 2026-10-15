import { useEffect, useRef } from 'react'

// ---------------------------------------------------------------
// SoftDrift: a quiet, living background for the whole site.
//
//   - Soft pastel orbs drift slowly upward. They sit at different depths, so
//     they shift against each other when you scroll, and they glide out of the
//     way of your cursor.
//   - Big, blurred patches of colour sit behind everything and change mood as
//     you read down the page: sage at the top, lavender in the middle, blush at the end.
//   - A short pastel comet follows your cursor.
//   - Click anywhere and a few little orbs pop out and float away.
//
// One fixed canvas, no DOM clutter, and it ignores the mouse completely.
// Mount it once in App.jsx:  <SoftDrift />
//
// Props (all optional)
//   zIndex   default -1 (behind the page). If you cannot see it because a wrapper
//            has a solid background, try 0 and lower `density`.
//   density  0.5 to 1.5, how many orbs (default 1)
//   cursor   comet trail on or off (default true)
//   clicks   click pops on or off (default true)
//   mood     scroll-driven colour patches on or off (default true)
// ---------------------------------------------------------------

const DARK = [[155, 184, 149], [183, 165, 222], [241, 196, 183]] // sage, lavender, blush
const LIGHT = [[104, 148, 98], [132, 108, 200], [226, 138, 118]]

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const rnd = (a, b) => a + Math.random() * (b - a)
const mix = (c1, c2, f) => [c1[0] + (c2[0] - c1[0]) * f, c1[1] + (c2[1] - c1[1]) * f, c1[2] + (c2[2] - c1[2]) * f]
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`

export default function SoftDrift({ zIndex = -1, density = 1, cursor = true, clicks = true, mood = true }) {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

    let vw = 0
    let vh = 0
    let parts = []
    let pops = []
    let trail = []
    let ptr = null
    let lastMove = 0
    const sm = { x: 0, y: 0 }
    let raf = 0
    let last = performance.now()
    let time = 0

    const isDark = () => {
      const t = document.documentElement.getAttribute('data-theme')
      return t ? t === 'dark' : darkQuery.matches
    }

    const seed = () => {
      const n = Math.round(clamp((vw * vh) / 45000, 14, 34) * density)
      parts = Array.from({ length: n }, () => ({
        x: rnd(0, vw),
        y: rnd(0, vh + 60),
        r: rnd(3, 15),
        d: rnd(0.2, 1),
        ci: Math.floor(Math.random() * 3),
        a: rnd(0.12, 0.32),
        ph: rnd(0, 6.28),
        vx: 0,
        vy: 0,
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      vw = document.documentElement.clientWidth
      vh = window.innerHeight
      cv.width = Math.round(vw * dpr)
      cv.height = Math.round(vh * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      if (reduce) draw(0)
    }

    const glow = (x, y, r, color, a) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, rgba(color, a))
      g.addColorStop(1, rgba(color, 0))
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, 6.2832)
      ctx.fill()
    }

    function draw(dt) {
      const now = performance.now()
      const dark = isDark()
      const pal = dark ? DARK : LIGHT
      ctx.clearRect(0, 0, vw, vh)

      const sy = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - vh
      const prog = maxScroll > 0 ? clamp(sy / maxScroll, 0, 1) : 0
      const ptrActive = !!ptr && now - lastMove < 2500

      // 1) mood patches: sage at the top, lavender in the middle, blush at the end
      if (mood) {
        const base = dark ? 0.15 : 0.12
        const R = Math.max(vw, vh) * 0.6
        const w = [1 - prog, 0.55 + 0.45 * Math.sin(prog * Math.PI), prog]
        const pos = [[0.14, 0.26], [0.62, 0.46], [0.9, 0.82]]
        for (let i = 0; i < 3; i += 1) {
          const dx = Math.sin(time * 0.05 + i * 2) * 0.04
          const dy = Math.cos(time * 0.04 + i) * 0.04
          glow((pos[i][0] + dx) * vw, (pos[i][1] + dy) * vh, R, pal[i], base * (0.25 + 0.75 * w[i]))
        }
      }

      // 2) drifting orbs
      const span = vh + 60
      for (const p of parts) {
        if (dt) {
          p.y -= (5 + 12 * p.d) * dt
          p.x += Math.sin(time * 0.3 + p.ph) * 6 * p.d * dt
          p.vx *= Math.exp(-dt * 2.5)
          p.vy *= Math.exp(-dt * 2.5)
          p.x += p.vx * dt
          p.y += p.vy * dt
          if (p.x < -20) p.x = vw + 20
          if (p.x > vw + 20) p.x = -20
        }
        const y = ((((p.y - sy * 0.18 * p.d) % span) + span) % span) - 30
        if (dt && ptrActive) {
          const dx = p.x - ptr.x
          const dy = y - ptr.y
          const dist = Math.hypot(dx, dy)
          if (dist < 150 && dist > 0.1) {
            const f = (1 - dist / 150) * 120
            p.vx += (dx / dist) * f * dt * 6
            p.vy += (dy / dist) * f * dt * 6
          }
        }
        glow(p.x, y, p.r * (0.7 + p.d * 0.6), pal[p.ci], p.a * (dark ? 1 : 1.7))
      }

      // 3) cursor comet
      if (cursor && dt && ptrActive) {
        sm.x += (ptr.x - sm.x) * (1 - Math.exp(-dt * 9))
        sm.y += (ptr.y - sm.y) * (1 - Math.exp(-dt * 9))
        trail.push({ x: sm.x, y: sm.y })
        if (trail.length > 16) trail.shift()
        glow(sm.x, sm.y, 90, pal[1], dark ? 0.1 : 0.09)
        for (let i = 0; i < trail.length; i += 1) {
          const f = i / trail.length
          const t = (time * 0.35 + f * 0.9) % 3
          const k = Math.floor(t)
          const c = mix(pal[k], pal[(k + 1) % 3], t - k)
          glow(trail[i].x, trail[i].y, 3 + f * 9, c, 0.05 + f * 0.3)
        }
      } else if (trail.length) {
        trail.shift()
      }

      // 4) click pops
      if (dt) {
        pops = pops.filter((q) => q.life < q.max)
        for (const q of pops) {
          q.life += dt
          q.vx *= Math.exp(-dt * 2.2)
          q.vy = q.vy * Math.exp(-dt * 2.2) - 40 * dt
          q.x += q.vx * dt
          q.y += q.vy * dt
        }
      }
      for (const q of pops) {
        const a = (1 - q.life / q.max) * 0.85
        glow(q.x, q.y, q.r * 2.2, pal[q.ci], a)
      }
    }

    const frame = (nowMs) => {
      const dt = Math.min(0.05, (nowMs - last) / 1000)
      last = nowMs
      time += dt
      draw(dt)
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e) => {
      if (e.pointerType === 'touch') return
      ptr = { x: e.clientX, y: e.clientY }
      lastMove = performance.now()
      if (!trail.length) { sm.x = ptr.x; sm.y = ptr.y }
    }
    const onDown = (e) => {
      if (!clicks || reduce) return
      for (let i = 0; i < 12; i += 1) {
        const a = rnd(0, 6.2832)
        const v = rnd(50, 170)
        pops.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, r: rnd(2, 5), life: 0, max: rnd(0.8, 1.3), ci: i % 3 })
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    if (!reduce) raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [density, cursor, clicks, mood])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex }}
    />
  )
}