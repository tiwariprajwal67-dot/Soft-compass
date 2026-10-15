import { useEffect, useId, useRef } from 'react'
import './CompassCrew.css'

// ---------------------------------------------------------------
// CompassCrew: three small creatures that live on your header.
//
//   Plumb (lavender)  hangs from the header on a thread. The thread lets
//                     out as you scroll down the page, so it doubles as a
//                     reading-progress line. It swings when you scroll fast
//                     or push it with the mouse. Click it and it reels itself up.
//   Scout (sage)      runs back and forth along the bottom edge of the header.
//                     It stops to look around, naps now and then, and trots
//                     over to your cursor when you move it near the header.
//                     Click it and it hops.
//   Dozer (blush)     sleeps on the edge. When Scout passes (or you poke it)
//                     it wakes up, hops and says hello, then falls asleep again.
//
// Mount it once, anywhere (App.jsx is the natural place):  <CompassCrew />
// It finds your header with document.querySelector('header'); if your header
// uses another tag or class, pass headerSelector=".site-header".
// ---------------------------------------------------------------

const KINDS = {
  sage: ['#d3e3cc', '#9bb895', '#78987a'],
  lav: ['#e0d5fb', '#b7a5de', '#8c78c0'],
  blush: ['#feded4', '#f1c4b7', '#d79b8c'],
}
const FEET = { sage: '#86a480', lav: '#a190d2', blush: '#e2a597' }
const CHEEK = { sage: '#f1c4b7', lav: '#f1c4b7', blush: '#e58f86' }

const MOUTH_K = 0.26
const MOUTHS = {
  smile: { d: 'M-12 0 Q0 10 12 0', open: false },
  grin: { d: 'M-14 -1 L14 -1 Q12 14 0 14 Q-12 14 -14 -1 Z', open: true },
  o: { d: 'M-5 0 a5 6.5 0 1 0 10 0 a5 6.5 0 1 0 -10 0 Z', open: true },
  whistle: { d: 'M-3 1 a3 4 0 1 0 6 0 a3 4 0 1 0 -6 0 Z', open: true },
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const rnd = (a, b) => a + Math.random() * (b - a)

// ---------- Drawing (one orb, drawn in its own small coordinate space) ----------

function Eye({ side }) {
  return (
    <g transform={`translate(${side * 3.7} -1.2)`}>
      <g className="cc-lid">
        <circle className="cc-sclera" r="3.1" />
        <g className="cc-pupil">
          <circle className="cc-iris" r="1.7" />
          <circle className="cc-glint" r="0.55" cx="-0.55" cy="-0.6" />
        </g>
      </g>
    </g>
  )
}

function Orb({ name, kind, uid, feet }) {
  return (
    <g className="cc-orb" data-orb={name}>
      <g className="cc-flip">
        {feet && (
          <>
            <ellipse className="cc-foot" cx="-4.2" cy="10.3" rx="3.6" ry="2.2" fill={FEET[kind]} />
            <ellipse className="cc-foot" cx="4.2" cy="10.3" rx="3.6" ry="2.2" fill={FEET[kind]} />
          </>
        )}
        <g className="cc-body">
          <circle r="10.5" fill={`url(#${uid}-${kind})`} />
          <ellipse cx="-3.6" cy="-5.2" rx="2.6" ry="1.4" fill={`url(#${uid}-hl)`} transform="rotate(-32 -3.6 -5.2)" />
          <g className="cc-face">
            <ellipse cx="-6.4" cy="3.2" rx="2.2" ry="1.4" fill={CHEEK[kind]} fillOpacity="0.5" />
            <ellipse cx="6.4" cy="3.2" rx="2.2" ry="1.4" fill={CHEEK[kind]} fillOpacity="0.5" />
            <Eye side={-1} />
            <Eye side={1} />
            <g className="cc-mouth" transform={`translate(0 4.3) scale(${MOUTH_K})`}>
              <path style={{ strokeWidth: 1.1 / MOUTH_K }} d="" />
            </g>
          </g>
        </g>
      </g>
      <g className="cc-zs">
        <text className="cc-z" x="8" y="-8">z</text>
        <text className="cc-z cc-z2" x="11" y="-13">Z</text>
      </g>
      <circle className="cc-hit" r="15" />
    </g>
  )
}

// ---------- The crew ----------

export default function CompassCrew({
  headerSelector = 'header',
  zIndex = 60,
  plumb = true,
  scout = true,
  dozer = true,
  dozerAt = 0.34, // where Dozer sleeps, as a fraction of the page width
}) {
  const uid = 'cc' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const layerRef = useRef(null)

  useEffect(() => {
    const layer = layerRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const grab = (name) => {
      const root = layer.querySelector(`[data-orb="${name}"]`)
      if (!root) return null
      const lids = root.querySelectorAll('.cc-lid')
      const pupils = root.querySelectorAll('.cc-pupil')
      return {
        name,
        root,
        flip: root.querySelector('.cc-flip'),
        body: root.querySelector('.cc-body'),
        face: root.querySelector('.cc-face'),
        mouth: root.querySelector('.cc-mouth'),
        mouthPath: root.querySelector('.cc-mouth path'),
        lidL: lids[0], lidR: lids[1],
        pupL: pupils[0], pupR: pupils[1],
        feet: root.querySelectorAll('.cc-foot'),
        hit: root.querySelector('.cc-hit'),
        mouthName: '',
        sleeping: null,
        cur: { px: 0, py: 0, fx: 0, fy: 0, lid: 0 },
        blinkUntil: 0,
        nextBlink: performance.now() + rnd(900, 3500),
      }
    }

    const o = { plumb: grab('plumb'), scout: grab('scout'), dozer: grab('dozer') }
    const thread = layer.querySelector('.cc-thread')
    const knot = layer.querySelector('.cc-knot')

    // state
    const Pl = { L: 34, Lv: 0, th: 0.25, om: 0, reel: 0, hover: 0 }
    const Sc = { x: document.documentElement.clientWidth * 0.62, dir: 1, state: 'run', t: rnd(2, 5), step: 0, hop: 0, idles: 0, cheer: 0 }
    const Dz = { wake: 0, hop: 0 }
    let ptr = null
    let last = performance.now()
    let time = 0
    let lastSy = window.scrollY
    let scrollV = 0
    let raf = 0

    const setMouth = (c, name) => {
      const m = MOUTHS[name]
      c.mouthPath.setAttribute('d', m.d)
      c.mouth.classList.toggle('is-open', m.open)
      c.mouthName = name
    }

    // Eyes, face turn, lids and mouth for one orb. (vx, vy) is the vector from the orb to whatever it is looking at.
    const face = (c, vx, vy, flip, rot, lidTarget, mouth, dt, now) => {
      const cos = Math.cos(rot)
      const sin = Math.sin(rot)
      const lx = (vx * cos + vy * sin) * flip
      const ly = -vx * sin + vy * cos
      const d = Math.hypot(lx, ly) || 1
      const mag = Math.min(1, Math.hypot(vx, vy) / 160)
      const k = 1 - Math.exp(-dt * 10)
      const u = c.cur
      u.px += (lx / d * mag * 1.1 - u.px) * k
      u.py += (ly / d * mag * 0.9 - u.py) * k
      u.fx += (lx / d * mag * 0.8 - u.fx) * k
      u.fy += (ly / d * mag * 0.6 - u.fy) * k

      if (now > c.nextBlink) {
        c.blinkUntil = now + 130
        c.nextBlink = now + rnd(2600, 6000)
      }
      const lt = Math.max(lidTarget, now < c.blinkUntil ? 1 : 0)
      u.lid += (lt - u.lid) * (1 - Math.exp(-dt * 24))

      c.face.setAttribute('transform', `translate(${u.fx.toFixed(2)} ${u.fy.toFixed(2)})`)
      const pt = `translate(${u.px.toFixed(2)} ${u.py.toFixed(2)})`
      c.pupL.setAttribute('transform', pt)
      c.pupR.setAttribute('transform', pt)
      const sc = `scale(1,${(1 - 0.9 * u.lid).toFixed(3)})`
      c.lidL.style.transform = sc
      c.lidR.style.transform = sc
      if (c.mouthName !== mouth) setMouth(c, mouth)
    }

    const setSleeping = (c, on) => {
      if (c.sleeping !== on) {
        c.sleeping = on
        c.root.classList.toggle('is-sleeping', on)
      }
    }

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      time += dt

      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight
      const hdr = document.querySelector(headerSelector)
      const lineY = hdr ? hdr.getBoundingClientRect().bottom : 64
      const lineVis = clamp(lineY / 18, 0, 1) // creatures fade as a non-sticky header scrolls away

      const sy = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - vh
      const prog = maxScroll > 0 ? clamp(sy / maxScroll, 0, 1) : 0
      const sv = reduce ? 0 : (sy - lastSy) / Math.max(dt, 0.001)
      lastSy = sy
      scrollV += (sv - scrollV) * Math.min(1, dt * 10)

      const ptrActive = !!ptr && now - ptr.t < 5000

      // ---------- Plumb: a pendulum on a thread ----------
      const pl = o.plumb
      if (pl) {
        const show = vw >= 560
        pl.root.style.display = show ? '' : 'none'
        thread.style.display = show ? '' : 'none'
        knot.style.display = show ? '' : 'none'
        if (show) {
          const ax = vw - clamp(vw * 0.03, 26, 56) - 14
          const ay = Math.max(lineY, 0)

          Pl.reel = Math.max(0, Pl.reel - dt)
          const Lt = Pl.reel > 0 ? 14 : 34 + prog * 90
          Pl.Lv += ((Lt - Pl.L) * 70 - Pl.Lv * 9) * dt
          Pl.L = Math.max(10, Pl.L + Pl.Lv * dt)

          const bx0 = ax + Pl.L * Math.sin(Pl.th)
          const by0 = ay + Pl.L * Math.cos(Pl.th)
          if (!reduce) {
            let wind = -clamp(scrollV, -2500, 2500) * 0.004
            if (ptrActive) {
              const dx = bx0 - ptr.x
              const dy = by0 - ptr.y
              const dist = Math.hypot(dx, dy)
              if (dist < 130) wind += Math.sign(dx || 1) * (1 - dist / 130) * 16
            }
            const acc = -(1100 / Pl.L) * Math.sin(Pl.th) - 2.2 * Pl.om + wind
            Pl.om += acc * dt
            Pl.th = clamp(Pl.th + Pl.om * dt, -1.15, 1.15)
          } else {
            Pl.th = 0
          }

          const bx = ax + Pl.L * Math.sin(Pl.th)
          const by = ay + Pl.L * Math.cos(Pl.th)
          thread.setAttribute('x1', ax)
          thread.setAttribute('y1', ay)
          thread.setAttribute('x2', bx.toFixed(1))
          thread.setAttribute('y2', by.toFixed(1))
          knot.setAttribute('cx', ax)
          knot.setAttribute('cy', ay)
          pl.root.setAttribute('transform', `translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${(Pl.th * 57.2958).toFixed(1)}) scale(1.8)`)

          const target = ptrActive ? { x: ptr.x - bx, y: ptr.y - by } : { x: 0, y: 160 }
          const fast = Math.abs(Pl.om) > 2.6
          const mood = Pl.reel > 0 || fast ? 'o' : Pl.hover > 0 ? 'grin' : 'smile'
          Pl.hover = Math.max(0, Pl.hover - dt)
          face(pl, target.x, target.y, 1, Pl.th, 0, mood, dt, now)
        }
      }

      // ---------- Dozer: sleeps on the edge, wakes when someone passes ----------
      const dz = o.dozer
      const dzx = clamp(vw * dozerAt, 44, vw - 44)
      if (dz) {
        dz.root.style.opacity = lineVis
        const awake = Dz.wake > 0
        Dz.wake = Math.max(0, Dz.wake - dt)
        Dz.hop = Math.max(0, Dz.hop - dt)
        const hopY = Dz.hop > 0 ? Math.sin(Math.PI * (1 - Dz.hop / 0.5)) * 14 : 0
        const s = 1.3
        dz.root.setAttribute('transform', `translate(${dzx.toFixed(1)} ${(lineY - 12.6 * s - hopY).toFixed(1)}) scale(${s})`)
        const breathe = reduce ? 1 : 1 + 0.035 * Math.sin(time * 1.7)
        dz.body.setAttribute('transform', `translate(0 ${(10.5 * (1 - breathe)).toFixed(2)}) scale(1 ${breathe.toFixed(3)})`)
        setSleeping(dz, !awake)
        const look = ptrActive ? { x: ptr.x - dzx, y: ptr.y - lineY } : { x: Sc.x - dzx, y: 0 }
        face(dz, look.x, look.y, 1, 0, awake ? 0 : 0.92, awake ? 'grin' : 'whistle', dt, now)
      }

      // ---------- Scout: runs along the edge ----------
      const sc = o.scout
      if (sc) {
        sc.root.style.opacity = lineVis
        const chase = !reduce && ptrActive && Math.abs(ptr.y - lineY) < 90
        const speedBase = 95
        let running = false
        let speed = 0

        if (!reduce) {
          if (Sc.hop > 0) Sc.hop = Math.max(0, Sc.hop - dt)
          Sc.cheer = Math.max(0, Sc.cheer - dt)

          if (Sc.state === 'run') {
            running = true
            if (chase) {
              const dx = ptr.x - Sc.x
              Sc.dir = dx >= 0 ? 1 : -1
              speed = Math.min(170, 40 + Math.abs(dx) * 1.5)
              if (Math.abs(dx) < 26) { Sc.state = 'watch'; running = false; speed = 0 }
            } else {
              speed = speedBase
              Sc.t -= dt
              if (Sc.t <= 0) {
                Sc.state = 'idle'
                Sc.t = rnd(1.2, 2.8)
                Sc.idles += 1
                running = false
                speed = 0
              }
            }
            // wake Dozer when passing it
            if (dz && Dz.wake <= 0 && Math.abs(Sc.x - dzx) < 34 && Sc.state === 'run') {
              Dz.wake = 2.6
              Dz.hop = 0.5
              Sc.state = 'greet'
              Sc.t = 1.4
              Sc.dir = dzx >= Sc.x ? 1 : -1
              running = false
              speed = 0
            }
          } else if (Sc.state === 'idle') {
            Sc.t -= dt
            if (chase) Sc.state = 'run'
            else if (Sc.t <= 0) {
              if (Sc.idles >= 3 && Math.random() < 0.7) {
                Sc.state = 'nap'
                Sc.t = rnd(5, 8)
                Sc.idles = 0
              } else {
                Sc.state = 'run'
                Sc.t = rnd(2.5, 5)
                if (Math.random() < 0.5) Sc.dir *= -1
              }
            }
          } else if (Sc.state === 'nap') {
            Sc.t -= dt
            const poked = ptrActive && Math.abs(ptr.x - Sc.x) < 70 && Math.abs(ptr.y - lineY) < 70
            if (Sc.t <= 0 || poked) { Sc.state = 'idle'; Sc.t = 1 }
          } else if (Sc.state === 'watch') {
            if (!chase || Math.abs(ptr.x - Sc.x) > 50) Sc.state = 'run'
            else Sc.dir = ptr.x >= Sc.x ? 1 : -1
          } else if (Sc.state === 'greet') {
            Sc.t -= dt
            if (Sc.t <= 0) {
              Sc.state = 'run'
              Sc.t = rnd(3, 5)
              Sc.dir = dzx >= Sc.x ? -1 : 1
            }
          }

          if (running) {
            Sc.x += Sc.dir * speed * dt
            Sc.step += speed * dt * 0.13
          }
          if (Sc.x < 26) { Sc.x = 26; Sc.dir = 1 }
          if (Sc.x > vw - 26) { Sc.x = vw - 26; Sc.dir = -1 }
        }

        const hopY = Sc.hop > 0 ? Math.sin(Math.PI * (1 - Sc.hop / 0.55)) * 24 : 0
        const bob = running ? Math.abs(Math.sin(Sc.step)) * 1.2 : 0
        const cx = Sc.x
        const SS = 1.2
        const cy = lineY - 12.6 * SS - hopY
        sc.root.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${SS})`)
        sc.flip.setAttribute('transform', `scale(${Sc.dir} 1)`)
        sc.body.setAttribute('transform', `translate(0 ${(-bob).toFixed(2)}) rotate(${running ? 7 : 0})`)

        sc.feet.forEach((foot, i) => {
          if (running && Sc.hop <= 0) {
            const ph = Sc.step + i * Math.PI
            foot.setAttribute('transform', `translate(${(Math.cos(ph) * 2.8).toFixed(2)} ${(-Math.max(0, Math.sin(ph)) * 2.6).toFixed(2)})`)
          } else if (Sc.hop > 0) {
            foot.setAttribute('transform', 'translate(0 -2)')
          } else {
            foot.setAttribute('transform', 'translate(0 0)')
          }
        })

        const sleeping = Sc.state === 'nap'
        setSleeping(sc, sleeping)
        let look
        if (Sc.state === 'greet' && dz) look = { x: dzx - cx, y: 0 }
        else if (running && !chase) look = { x: Sc.dir * 200, y: 0 }
        else if (ptrActive) look = { x: ptr.x - cx, y: ptr.y - cy }
        else look = { x: Sc.dir * 200, y: 0 }
        const happy = Sc.hop > 0 || Sc.cheer > 0 || Sc.state === 'greet' || chase
        face(sc, look.x, look.y, Sc.dir, 0, sleeping ? 0.92 : 0, sleeping ? 'whistle' : happy ? 'grin' : 'smile', dt, now)
      }

      raf = requestAnimationFrame(frame)
    }

    // ---------- Input ----------
    const onMove = (e) => { ptr = { x: e.clientX, y: e.clientY, t: performance.now() } }
    window.addEventListener('pointermove', onMove, { passive: true })

    const listeners = []
    const on = (el, ev, fn) => {
      if (!el) return
      el.addEventListener(ev, fn)
      listeners.push(() => el.removeEventListener(ev, fn))
    }
    if (o.plumb) {
      on(o.plumb.hit, 'pointerenter', () => { Pl.om += (Math.random() < 0.5 ? -1 : 1) * 2.5; Pl.hover = 1.2 })
      on(o.plumb.hit, 'click', () => { Pl.reel = 0.9; Pl.om += 2 })
    }
    if (o.scout) {
      on(o.scout.hit, 'click', () => { Sc.hop = 0.55; Sc.cheer = 1.2; if (Sc.state === 'nap') { Sc.state = 'idle'; Sc.t = 1 } })
    }
    if (o.dozer) {
      const wake = () => { if (Dz.wake <= 0.3) { Dz.hop = 0.5 } Dz.wake = 2.6 }
      on(o.dozer.hit, 'pointerenter', wake)
      on(o.dozer.hit, 'click', wake)
    }

    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      listeners.forEach((off) => off())
    }
  }, [headerSelector, plumb, scout, dozer, dozerAt])

  return (
    <svg ref={layerRef} className="cc-layer" style={{ zIndex }} aria-hidden="true" focusable="false">
      <defs>
        {Object.entries(KINDS).map(([kind, cols]) => (
          <radialGradient key={kind} id={`${uid}-${kind}`} cx="0.36" cy="0.3" r="0.85">
            <stop offset="0" stopColor={cols[0]} />
            <stop offset="0.55" stopColor={cols[1]} />
            <stop offset="1" stopColor={cols[2]} />
          </radialGradient>
        ))}
        <radialGradient id={`${uid}-hl`}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {plumb && (
        <>
          <line className="cc-thread" x1="0" y1="0" x2="0" y2="0" />
          <circle className="cc-knot" r="2.6" />
          <Orb name="plumb" kind="lav" uid={uid} />
        </>
      )}
      {dozer && <Orb name="dozer" kind="blush" uid={uid} />}
      {scout && <Orb name="scout" kind="sage" uid={uid} feet />}
    </svg>
  )
}