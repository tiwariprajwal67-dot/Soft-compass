import { useEffect, useId, useRef, useState } from 'react'
import './Login.css'

// ---------------------------------------------------------------
// Login: a sign-in page with three orb characters (sage, lavender,
// blush) that react to what you do.
//   - they follow the cursor, then the text caret while you type your email
//   - they look away (and the lavender one covers its eyes) at the password
//   - show the password and one of them peeks
//   - wrong login: they shake; right login: they jump
//
// Props (all optional):
//   onSubmit({ email, password, remember })  async, return true/false or { ok, message }.
//                                            Without it, the demo login below is used.
//   onSuccess(result)                        called ~1.6s after a good login, so the
//                                            celebration plays before you navigate.
//   onForgot / onSignup / onGuest            link and button handlers.
//   brand                                    name shown top-left (default "Soft Compass").
//   showDemo                                 show the demo-login hint (default true; set
//                                            false once real authentication is wired in).
// ---------------------------------------------------------------

const VB = { w: 520, h: 470 }
const DEMO = { email: 'hello@softcompass.app', password: 'compass' }

const CHARS = [
  { id: 'sage',  cx: 116, cy: 326, R: 82,  dy: -4,  ex: 23, er: 11.5, pr: 6.2, my: 30, mk: 0.8,  cols: ['#d3e3cc', '#9bb895', '#78987a'], hand: '#86a480', cheek: '#f1c4b7', bd: '-1.2s', bt: '5.2s' },
  { id: 'lav',   cx: 268, cy: 252, R: 128, dy: -10, ex: 36, er: 16,   pr: 8.6, my: 44, mk: 1.2,  cols: ['#e0d5fb', '#b7a5de', '#8c78c0'], hand: '#a190d2', cheek: '#f1c4b7', bd: '-0.4s', bt: '4.6s' },
  { id: 'blush', cx: 424, cy: 368, R: 58,  dy: -3,  ex: 16, er: 8.5,  pr: 4.8, my: 22, mk: 0.62, cols: ['#feded4', '#f1c4b7', '#d79b8c'], hand: '#e2a597', cheek: '#e58f86', bd: '-2s',   bt: '3.8s' },
]
const RING = { cx: 268, cy: 252, rx: 205, ry: 58, rot: -22 }
const RING_TF = `translate(${RING.cx} ${RING.cy}) rotate(${RING.rot})`

const MOUTHS = {
  smile:   { d: 'M-12 0 Q0 10 12 0', open: false },
  grin:    { d: 'M-14 -1 L14 -1 Q12 14 0 14 Q-12 14 -14 -1 Z', open: true },
  o:       { d: 'M-5 0 a5 6.5 0 1 0 10 0 a5 6.5 0 1 0 -10 0 Z', open: true },
  whistle: { d: 'M-3 1 a3 4 0 1 0 6 0 a3 4 0 1 0 -6 0 Z', open: true },
  sad:     { d: 'M-11 7 Q0 -4 11 7', open: false },
  smirk:   { d: 'M-10 3 Q2 9 12 -3', open: false },
}

// look: 'ptr' pointer, 'caret' text caret, 'pw' password field, 'form' form centre,
//       or an [x, y] direction to look away.
// lid:   [left, right]  0 open .. 1 shut.   hands: [left, right]  0 resting .. 1 over the eyes.
const P = (look, lid, hands, mouth) => ({ look, lid, hands, mouth })
const POSE = {
  idle:    { sage: P('ptr', [0, 0], [0, 0], 'smile'),   lav: P('ptr', [0, 0], [0, 0], 'smile'),   blush: P('ptr', [0, 0], [0, 0], 'smile') },
  email:   { sage: P('caret', [0, 0], [0, 0], 'smile'), lav: P('caret', [0, 0], [0, 0], 'grin'),  blush: P('caret', [0, 0], [0, 0], 'grin') },
  pw:      { sage: P([-1, -0.15], [0, 0], [0, 0], 'whistle'), lav: P([-1, -0.5], [0, 0], [1, 1], 'smile'), blush: P('ptr', [1, 1], [0, 0], 'smile') },
  peek:    { sage: P('pw', [0, 0], [0, 0], 'o'),        lav: P('pw', [0, 0], [1, 0], 'smirk'),     blush: P('pw', [1, 0], [0, 0], 'grin') },
  loading: { sage: P('form', [0, 0], [0, 0], 'o'),      lav: P('form', [0, 0], [0, 0], 'o'),       blush: P('form', [0, 0], [0, 0], 'o') },
  error:   { sage: P('ptr', [0, 0], [0, 0], 'sad'),     lav: P('ptr', [0, 0], [0, 0], 'sad'),      blush: P('ptr', [0, 0], [0, 0], 'sad') },
  success: { sage: P('ptr', [0.6, 0.6], [0, 0], 'grin'), lav: P('ptr', [0.6, 0.6], [0, 0], 'grin'), blush: P('ptr', [0.6, 0.6], [0, 0], 'grin') },
}
const CAPTIONS = {
  idle: 'Move your cursor. They are watching it.',
  email: 'Reading along as you type.',
  pw: 'Not looking. Promise.',
  peek: 'It is visible now. Someone is peeking.',
  loading: 'Checking...',
  error: 'Hmm, that did not match.',
  success: 'You are in. Welcome back!',
}

const EMAIL_RE = /^\S+@\S+\.\S+$/
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function demoAuth({ email, password }) {
  await wait(700)
  return email.toLowerCase() === DEMO.email && password === DEMO.password
}

// ---------- Static drawing ----------

function Eye({ c, side }) {
  return (
    <g className="lg-eye" transform={`translate(${side * c.ex} 0)`}>
      <g className="lg-lid">
        <circle className="lg-sclera" r={c.er} />
        <g className="lg-pupil">
          <circle className="lg-iris" r={c.pr} />
          <circle className="lg-glint" r={c.pr * 0.32} cx={-c.pr * 0.32} cy={-c.pr * 0.36} />
        </g>
      </g>
    </g>
  )
}

function Orb({ c, uid }) {
  const cheekX = c.ex * 1.55
  const cheekY = c.my - 4
  const hx = -c.R * 0.36
  const hy = -c.R * 0.52
  return (
    <g className="lg-char" data-id={c.id} transform={`translate(${c.cx} ${c.cy})`}>
      <ellipse className="lg-shadow-blob" cx="0" cy={c.R + 20} rx={c.R * 0.85} ry={c.R * 0.14} />
      <g className="lg-bob" style={{ animationDuration: c.bt, animationDelay: c.bd }}>
        <g className="lg-squish">
          <circle r={c.R} fill={`url(#${uid}-${c.id})`} />
          <ellipse cx={hx} cy={hy} rx={c.R * 0.24} ry={c.R * 0.13} fill={`url(#${uid}-hl)`} transform={`rotate(-32 ${hx} ${hy})`} />
          <g className="lg-face" transform={`translate(0 ${c.dy})`}>
            {[-1, 1].map((s) => (
              <ellipse key={s} cx={s * cheekX} cy={cheekY} rx={8 * c.mk} ry={5 * c.mk} fill={c.cheek} fillOpacity="0.5" />
            ))}
            <Eye c={c} side={-1} />
            <Eye c={c} side={1} />
            <g className="lg-mouth" transform={`translate(0 ${c.my}) scale(${c.mk})`}>
              <path style={{ strokeWidth: 2.6 / c.mk }} d="" />
            </g>
          </g>
          <circle className="lg-hand" r={c.R * 0.17} style={{ fill: c.hand }} />
          <circle className="lg-hand" r={c.R * 0.17} style={{ fill: c.hand }} />
        </g>
      </g>
    </g>
  )
}

function EyeIcon({ slashed }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {slashed && <path d="M4 4l16 16" />}
    </svg>
  )
}

// ---------- The page ----------

export default function Login({
  onSubmit,
  onSuccess,
  onForgot,
  onSignup,
  onGuest,
  brand = 'Soft Compass',
  showDemo = true,
}) {
  const uid = 'lg' + useId().replace(/[^a-zA-Z0-9]/g, '')

  const svgRef = useRef(null)
  const formRef = useRef(null)
  const emailRef = useRef(null)
  const pwRef = useRef(null)
  const captionRef = useRef(null)
  const ringBackRef = useRef(null)
  const ringFrontRef = useRef(null)
  const fxRef = useRef(null)
  const api = useRef(null)
  const successTimer = useRef(0)

  // Values the animation loop reads every frame. Kept in a ref so typing never re-renders the page.
  const S = useRef({
    focused: null, // 'email' | 'password' | null
    pwVisible: false,
    override: null, // 'loading' | 'error' | 'success' | null
    overrideTimer: 0,
    caretOff: 14,
    ptr: null,
  })

  const [pwVisible, setPwVisible] = useState(false)
  const [remember, setRemember] = useState(true)
  const [busy, setBusy] = useState(false)
  const [locked, setLocked] = useState(false)
  const [error, setError] = useState('')
  const [invalid, setInvalid] = useState(null) // 'email' | 'password' | null

  // ---------- Animation loop ----------
  useEffect(() => {
    const root = svgRef.current
    const state = S.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const NS = 'http://www.w3.org/2000/svg'

    const chars = CHARS.map((cfg) => {
      const g = root.querySelector(`.lg-char[data-id="${cfg.id}"]`)
      const lids = g.querySelectorAll('.lg-lid')
      const pupils = g.querySelectorAll('.lg-pupil')
      const hands = g.querySelectorAll('.lg-hand')
      return {
        cfg,
        squish: g.querySelector('.lg-squish'),
        face: g.querySelector('.lg-face'),
        mouth: g.querySelector('.lg-mouth'),
        mouthPath: g.querySelector('.lg-mouth path'),
        lidL: lids[0], lidR: lids[1],
        pupL: pupils[0], pupR: pupils[1],
        handL: hands[0], handR: hands[1],
        cur: { px: 0, py: 0, fx: 0, fy: 0, lidL: 0, lidR: 0, hL: 0, hR: 0 },
        mouthName: '',
        blinkUntil: 0,
        nextBlink: performance.now() + 1200 + Math.random() * 2500,
      }
    })

    const ringBack = ringBackRef.current
    const ringFront = ringFrontRef.current
    const fx = fxRef.current
    const bead = document.createElementNS(NS, 'circle')
    bead.setAttribute('class', 'lg-bead')
    bead.setAttribute('r', '6')
    ringFront.appendChild(bead)
    let beadT = 0.9
    let beadLayer = 'front'

    const measure = document.createElement('canvas').getContext('2d')
    const cap = captionRef.current
    let cur = ''
    let capFor = null
    let hold = 0
    let last = performance.now()
    let raf = 0
    let alive = true

    const setMouth = (c, name) => {
      const m = MOUTHS[name]
      c.mouthPath.setAttribute('d', m.d)
      c.mouth.classList.toggle('is-open', m.open)
      c.mouthName = name
    }

    const nudge = () => {
      if (reduce) return
      chars.forEach((c, i) => {
        c.squish.animate(
          [{ transform: 'scale(1,1)' }, { transform: 'scale(1.045,0.945)' }, { transform: 'scale(0.985,1.03)' }, { transform: 'scale(1,1)' }],
          { duration: 280, delay: i * 55, easing: 'ease-out' },
        )
      })
    }
    const shake = () => {
      if (reduce) return
      chars.forEach((c) => {
        c.squish.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(9px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }],
          { duration: 520, easing: 'ease-in-out' },
        )
      })
    }
    const jump = () => {
      if (reduce) return
      chars.forEach((c, i) => {
        c.squish.animate(
          [{ transform: 'translateY(0)' }, { transform: 'translateY(-32px)', offset: 0.45 }, { transform: 'translateY(0)' }],
          { duration: 640, delay: i * 110, iterations: 2, easing: 'ease-out' },
        )
      })
    }
    const burst = () => {
      if (reduce) return
      const colors = ['#b7a5de', '#9bb895', '#f1c4b7', '#fbf8f2']
      const lav = CHARS[1]
      for (let i = 0; i < 24; i += 1) {
        const p = document.createElementNS(NS, 'circle')
        p.setAttribute('r', (2 + Math.random() * 3).toFixed(1))
        p.setAttribute('cx', lav.cx)
        p.setAttribute('cy', lav.cy - lav.R * 0.55)
        p.setAttribute('fill', colors[i % 4])
        fx.appendChild(p)
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.5
        const v = 90 + Math.random() * 160
        const dx = Math.cos(a) * v
        const dy = Math.sin(a) * v
        const anim = p.animate(
          [{ transform: 'translate(0px,0px)', opacity: 1 }, { transform: `translate(${dx}px,${dy + 130}px)`, opacity: 0 }],
          { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)' },
        )
        anim.onfinish = () => p.remove()
      }
    }

    const updateCaret = () => {
      const el = emailRef.current
      if (!el) return
      const pos = el.selectionStart == null ? el.value.length : el.selectionStart
      const cs = getComputedStyle(el)
      measure.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const w = measure.measureText(el.value.slice(0, pos)).width
      state.caretOff = Math.max(0, Math.min(el.clientWidth, parseFloat(cs.paddingLeft) + w - el.scrollLeft))
    }

    const setOverride = (name, ms) => {
      state.override = name
      clearTimeout(state.overrideTimer)
      if (ms) state.overrideTimer = setTimeout(() => { state.override = null }, ms)
    }

    const flash = (text, ms = 2600) => {
      cap.textContent = text
      hold = performance.now() + ms
      capFor = null
    }

    api.current = { nudge, flash, setOverride, updateCaret }

    const centre = (el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }

    const frame = (now) => {
            if (!alive || !root.isConnected) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const st =
        state.override ||
        (state.focused === 'password' ? (state.pwVisible ? 'peek' : 'pw') : state.focused === 'email' ? 'email' : 'idle')
      if (st !== cur) {
        cur = st
        if (st === 'error') shake()
        if (st === 'success') { jump(); burst() }
      }
      if (now > hold && capFor !== cur) {
        cap.textContent = CAPTIONS[cur]
        capFor = cur
      }

      const r = root.getBoundingClientRect()
      const s = Math.min(r.width / VB.w, r.height / VB.h) || 1
      const ox = r.left + (r.width - VB.w * s) / 2
      const oy = r.top + (r.height - VB.h * s) / 2

      const formPt = centre(formRef.current)
      const pwPt = centre(pwRef.current)
      const er = emailRef.current.getBoundingClientRect()
      const caretPt = { x: er.left + state.caretOff, y: er.top + er.height / 2 }
      const mouseOrForm = state.ptr || formPt

      const kLook = 1 - Math.exp(-dt * (reduce ? 30 : 10))
      const kLid = 1 - Math.exp(-dt * 26)
      const kHand = 1 - Math.exp(-dt * (reduce ? 30 : 9))

      chars.forEach((c) => {
        const cfg = c.cfg
        const pose = POSE[cur][cfg.id]
        const sx = ox + cfg.cx * s
        const sy = oy + cfg.cy * s
        let dirx = 0
        let diry = 0
        let mag = 1

        if (Array.isArray(pose.look)) {
          dirx = pose.look[0]
          diry = pose.look[1]
          const n = Math.hypot(dirx, diry) || 1
          dirx /= n
          diry /= n
        } else {
          const t = pose.look === 'caret' ? caretPt : pose.look === 'pw' ? pwPt : pose.look === 'form' ? formPt : mouseOrForm
          const vx = t.x - sx
          const vy = t.y - sy
          const d = Math.hypot(vx, vy) || 1
          dirx = vx / d
          diry = vy / d
          mag = Math.min(1, d / 230)
        }

        const maxP = cfg.er - cfg.pr - 1.2
        const maxF = cfg.R * 0.12
        const tpx = dirx * mag * maxP
        const tpy = diry * mag * maxP
        const tfx = dirx * mag * maxF
        const tfy = diry * mag * maxF * 0.8

        if (now > c.nextBlink) {
          c.blinkUntil = now + 130
          c.nextBlink = now + 2600 + Math.random() * 3600
        }
        const blink = now < c.blinkUntil ? 1 : 0

        const u = c.cur
        u.px += (tpx - u.px) * kLook
        u.py += (tpy - u.py) * kLook
        u.fx += (tfx - u.fx) * kLook
        u.fy += (tfy - u.fy) * kLook
        u.lidL += (Math.max(pose.lid[0], blink) - u.lidL) * kLid
        u.lidR += (Math.max(pose.lid[1], blink) - u.lidR) * kLid
        u.hL += (pose.hands[0] - u.hL) * kHand
        u.hR += (pose.hands[1] - u.hR) * kHand

        if (c.mouthName !== pose.mouth) setMouth(c, pose.mouth)

        const squeeze = 1 - (0.14 * Math.abs(u.fx) / maxF) * Math.abs(dirx)
        c.face.setAttribute('transform', `translate(${u.fx.toFixed(2)} ${(cfg.dy + u.fy).toFixed(2)}) scale(${squeeze.toFixed(3)} 1)`)
        const pt = `translate(${u.px.toFixed(2)} ${u.py.toFixed(2)})`
        c.pupL.setAttribute('transform', pt)
        c.pupR.setAttribute('transform', pt)
        c.lidL.style.transform = `scale(1,${(1 - 0.9 * u.lidL).toFixed(3)})`
        c.lidR.style.transform = `scale(1,${(1 - 0.9 * u.lidR).toFixed(3)})`

        // hands go from resting at the sides to covering the eyes
        const restX = cfg.R * 0.95
        const restY = cfg.R * 0.3
        const coverY = cfg.dy + u.fy + 1
        const lx = -restX + (-cfg.ex + u.fx + restX) * u.hL
        const ly = restY + (coverY - restY) * u.hL
        const rx = restX + (cfg.ex + u.fx - restX) * u.hR
        const ry = restY + (coverY - restY) * u.hR
        c.handL.setAttribute('transform', `translate(${lx.toFixed(2)} ${ly.toFixed(2)})`)
        c.handR.setAttribute('transform', `translate(${rx.toFixed(2)} ${ry.toFixed(2)})`)
      })

      // the small bead travelling around the compass ring
      if (!reduce) beadT += dt * 0.38
      const bx = RING.rx * Math.cos(beadT)
      const by = RING.ry * Math.sin(beadT)
      bead.setAttribute('cx', bx.toFixed(1))
      bead.setAttribute('cy', by.toFixed(1))
      const want = by > 0 ? 'front' : 'back'
      if (want !== beadLayer) {
        ;(want === 'front' ? ringFront : ringBack).appendChild(bead)
        beadLayer = want
      }

      raf = requestAnimationFrame(frame)
    }

    const onMove = (e) => { state.ptr = { x: e.clientX, y: e.clientY } }
    const onLeave = () => { state.ptr = null }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    updateCaret()
    raf = requestAnimationFrame(frame)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      clearTimeout(state.overrideTimer)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      bead.remove()
      while (fx.firstChild) fx.removeChild(fx.firstChild)
      api.current = null
    }
  }, [])

  useEffect(() => () => clearTimeout(successTimer.current), [])

  // ---------- Handlers ----------
  const fail = (message, field) => {
    setError(message)
    setInvalid(field)
    ;(field === 'email' ? emailRef : pwRef).current?.focus()
    api.current?.setOverride('error', 1700)
  }

  const handleFocus = (e) => {
    const s = S.current
    const t = e.target
    s.focused = t === emailRef.current ? 'email' : t === pwRef.current || t.dataset.role === 'pw-toggle' ? 'password' : null
    if (t === emailRef.current) api.current?.updateCaret()
  }
  const handleBlur = (e) => {
    if (!formRef.current.contains(e.relatedTarget)) S.current.focused = null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (locked || busy) return
    setError('')
    setInvalid(null)
    const email = emailRef.current.value.trim()
    const password = pwRef.current.value
    if (!EMAIL_RE.test(email)) return fail('Enter an email like name@example.com.', 'email')
    if (!password) return fail('Enter your password.', 'password')

    api.current?.setOverride('loading')
    setBusy(true)
    let result
    try {
      result = await (onSubmit ? onSubmit({ email, password, remember }) : demoAuth({ email, password }))
    } catch {
      result = { ok: false, message: 'Something went wrong. Please try again.' }
    }
    const ok = typeof result === 'object' && result !== null ? Boolean(result.ok) : Boolean(result)
    const message = typeof result === 'object' && result !== null ? result.message : ''

    if (ok) {
      setLocked(true)
      api.current?.setOverride('success')
      successTimer.current = setTimeout(() => onSuccess?.(result), 1600)
    } else {
      setBusy(false)
      fail(message || 'That email and password do not match.', 'password')
    }
  }

  const reset = () => {
    clearTimeout(successTimer.current)
    setLocked(false)
    setBusy(false)
    api.current?.setOverride(null)
    emailRef.current.value = ''
    pwRef.current.value = ''
    S.current.pwVisible = false
    setPwVisible(false)
    api.current?.updateCaret()
    emailRef.current.focus()
  }

  const fillDemo = () => {
    emailRef.current.value = DEMO.email
    pwRef.current.value = DEMO.password
    setError('')
    setInvalid(null)
    api.current?.updateCaret()
    api.current?.nudge()
    api.current?.flash('Filled in. Press Sign in.')
  }

  const togglePw = () => {
    const next = !pwVisible
    S.current.pwVisible = next
    S.current.focused = 'password'
    setPwVisible(next)
    pwRef.current.focus()
  }

  const stub = (handler, message) => () => {
    if (handler) handler()
    else api.current?.flash(message)
  }

  const clearInvalid = () => {
    setError('')
    setInvalid(null)
  }

  const label = locked ? 'Signed in' : busy ? 'Checking...' : 'Sign in'

  return (
    <section className="login" aria-label="Sign in">
      <div className="lg-card">
        <div className="lg-stage">
          <div className="lg-brand">
            <svg width="30" height="22" viewBox="0 0 30 22" aria-hidden="true">
              <circle cx="11" cy="11" r="9" fill="#9bb895" />
              <circle cx="19" cy="11" r="9" fill="#b7a5de" fillOpacity="0.92" />
            </svg>
            {brand}
          </div>

          <svg
            ref={svgRef}
            className="lg-art"
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              {CHARS.map((c) => (
                <radialGradient key={c.id} id={`${uid}-${c.id}`} cx="0.36" cy="0.3" r="0.85">
                  <stop offset="0" stopColor={c.cols[0]} />
                  <stop offset="0.55" stopColor={c.cols[1]} />
                  <stop offset="1" stopColor={c.cols[2]} />
                </radialGradient>
              ))}
              <radialGradient id={`${uid}-hl`}>
                <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="lg-shadow-grad">
                <stop offset="0" style={{ stopColor: 'var(--lg-shadow)' }} />
                <stop offset="1" style={{ stopColor: 'var(--lg-shadow)', stopOpacity: 0 }} />
              </radialGradient>
            </defs>

            <Orb c={CHARS[0]} uid={uid} />
            <g ref={ringBackRef} transform={RING_TF}>
              <path className="lg-ring" d={`M${-RING.rx} 0 A${RING.rx} ${RING.ry} 0 0 1 ${RING.rx} 0`} />
            </g>
            <Orb c={CHARS[1]} uid={uid} />
            <g ref={ringFrontRef} transform={RING_TF}>
              <path className="lg-ring" d={`M${RING.rx} 0 A${RING.rx} ${RING.ry} 0 0 1 ${-RING.rx} 0`} />
            </g>
            <Orb c={CHARS[2]} uid={uid} />
            <g ref={fxRef} />
          </svg>

          <div className="lg-caption" aria-live="polite">
            <span className="lg-caption-dot" />
            <span ref={captionRef}>{CAPTIONS.idle}</span>
          </div>
        </div>

        <div className="lg-panel">
          <div>
            <h1 className="lg-title">
              Welcome <em>back</em>.
            </h1>
            <p className="lg-sub">Sign in to pick up your reflections where you left them.</p>
          </div>

          <form ref={formRef} className="lg-form" noValidate onSubmit={handleSubmit} onFocus={handleFocus} onBlur={handleBlur}>
            <div className="lg-field">
              <label className="lg-label" htmlFor="lg-email">Email</label>
              <div className="lg-control">
                <input
                  ref={emailRef}
                  id="lg-email"
                  className="lg-input"
                  name="email"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="you@example.com"
                  disabled={locked}
                  aria-invalid={invalid === 'email' ? 'true' : undefined}
                  onInput={() => {
                    clearInvalid()
                    api.current?.updateCaret()
                    if (!locked) api.current?.nudge()
                  }}
                  onKeyUp={() => api.current?.updateCaret()}
                  onClick={() => api.current?.updateCaret()}
                  onSelect={() => api.current?.updateCaret()}
                />
              </div>
            </div>

            <div className="lg-field">
              <label className="lg-label" htmlFor="lg-password">Password</label>
              <div className="lg-control">
                <input
                  ref={pwRef}
                  id="lg-password"
                  className="lg-input lg-input--pw"
                  name="password"
                  type={pwVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  disabled={locked}
                  aria-invalid={invalid === 'password' ? 'true' : undefined}
                  onInput={clearInvalid}
                />
                <button
                  type="button"
                  className="lg-toggle"
                  data-role="pw-toggle"
                  aria-pressed={pwVisible}
                  aria-label={pwVisible ? 'Hide password' : 'Show password'}
                  disabled={locked}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={togglePw}
                >
                  <EyeIcon slashed={pwVisible} />
                </button>
              </div>
            </div>

            <div className="lg-row">
              <label className="lg-check">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Keep me signed in
              </label>
              <button type="button" className="lg-link" onClick={stub(onForgot, 'Demo only: this link does not go anywhere yet.')}>
                Forgot password?
              </button>
            </div>

            {error && <p className="lg-error" role="alert">{error}</p>}

            <button type="submit" className="lg-btn lg-btn--primary" disabled={busy || locked}>
              <span>{label}</span>
              <svg className="lg-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </form>

          <div className="lg-or">or</div>
          <button
            type="button"
            className="lg-btn lg-btn--ghost"
            onClick={() => {
              api.current?.nudge()
              stub(onGuest, 'This is a demo, so guest mode does not go anywhere yet.')()
            }}
          >
            Continue as a guest
          </button>

          <div className="lg-foot">
            <p>
              New here?{' '}
              <button type="button" className="lg-link" onClick={stub(onSignup, 'Demo only: this link does not go anywhere yet.')}>
                Create an account
              </button>
            </p>
            {showDemo && (
              <p className="lg-demo">
                {locked ? (
                  <button type="button" className="lg-link" onClick={reset}>Sign out and try again</button>
                ) : (
                  <>
                    Demo login: <code>{DEMO.email}</code> <code>{DEMO.password}</code>{' '}
                    <button type="button" className="lg-link" onClick={fillDemo}>Fill it in</button>
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}