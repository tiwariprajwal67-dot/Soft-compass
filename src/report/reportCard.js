// ---------------------------------------------------------------
// Draws the report card as a picture, right in the browser (no server, nothing uploaded).
// The picture is 1080 x 1350 "points", saved at double resolution (2160 x 2700 pixels)
// so it stays sharp on phones and in print.
// ---------------------------------------------------------------

const W = 1080
const H = 1350
const SCALE = 2

const C = {
  ivory: '#f7f2e9',
  paper: '#fffcf6',
  ink: '#1f1e26',
  soft: '#55535e',
  line: 'rgba(31, 30, 38, 0.14)',
  sage: '#9bb895',
  sageSoft: '#e3eadd',
  sageDeep: '#3f5c46',
  lavender: '#b7a5de',
  lavenderSoft: '#ebe5f5',
  lavenderDeep: '#5a4a86',
  blush: '#f1c4b7',
  blushSoft: '#fbeee8',
  blushDeep: '#9c5443',
}
const DISPLAY = "'Fraunces', Georgia, 'Times New Roman', serif"
const BODY = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif"
const LEFT = 100
const RIGHT = W - 100

async function loadFonts() {
  if (!document.fonts || !document.fonts.load) return
  try {
    await Promise.all([
      document.fonts.load('500 64px Fraunces'),
      document.fonts.load('400 24px Inter'),
      document.fonts.load('500 24px Inter'),
      document.fonts.load('600 24px Inter'),
    ])
  } catch {
    /* if the fonts cannot load, the system fonts above are used instead */
  }
}

// ----- small drawing helpers -----
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function glow(ctx, x, y, radius, [r, g, b], alpha) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
  ctx.fillStyle = gradient
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
}

// Text with extra space between letters (used for small capital labels).
function spaced(ctx, text, x, y, spacing) {
  let cursor = x
  const previousAlign = ctx.textAlign
  ctx.textAlign = 'left'
  for (const ch of Array.from(text)) {
    ctx.fillText(ch, cursor, y)
    cursor += ctx.measureText(ch).width + spacing
  }
  ctx.textAlign = previousAlign
}

// Finds the biggest font size (down to a minimum) at which the text fits the width.
function fitSize(ctx, text, weight, family, maxWidth, start, min) {
  let size = start
  ctx.font = `${weight} ${size}px ${family}`
  while (size > min && ctx.measureText(text).width > maxWidth) {
    size -= 2
    ctx.font = `${weight} ${size}px ${family}`
  }
  return size
}

function wrapLines(ctx, text, maxWidth) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    const attempt = line ? `${line} ${word}` : word
    if (!line || ctx.measureText(attempt).width <= maxWidth) {
      line = attempt
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

// Cuts text so that it fits the width, ending with "…".
function ellipsize(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text
  let shorter = text
  while (shorter.length > 1 && ctx.measureText(`${shorter}…`).width > maxWidth) shorter = shorter.slice(0, -1)
  return `${shorter.trimEnd()}…`
}

// Lays out a list of short items separated by " · ", wrapping between whole items
// (so a line never starts or ends with a separator).
function wrapItems(ctx, items, maxWidth) {
  const separator = '  ·  '
  const lines = []
  let line = ''
  for (const item of items) {
    const attempt = line ? `${line}${separator}${item}` : item
    if (!line || ctx.measureText(attempt).width <= maxWidth) {
      line = attempt
    } else {
      lines.push(line)
      line = item
    }
  }
  if (line) lines.push(line)
  return lines
}

// ----- the pieces of the card -----
function drawBackground(ctx) {
  ctx.fillStyle = C.ivory
  ctx.fillRect(0, 0, W, H)

  ctx.save()
  ctx.shadowColor = 'rgba(60, 40, 110, 0.16)'
  ctx.shadowBlur = 50
  ctx.shadowOffsetY = 18
  roundedRect(ctx, 40, 40, W - 80, H - 80, 40)
  ctx.fillStyle = C.paper
  ctx.fill()
  ctx.restore()

  ctx.save()
  roundedRect(ctx, 40, 40, W - 80, H - 80, 40)
  ctx.clip()
  glow(ctx, 900, 130, 520, [183, 165, 222], 0.5)
  glow(ctx, 90, 640, 460, [155, 184, 149], 0.32)
  glow(ctx, 960, 1180, 500, [241, 196, 183], 0.5)
  ctx.restore()

  roundedRect(ctx, 40, 40, W - 80, H - 80, 40)
  ctx.lineWidth = 2
  ctx.strokeStyle = C.line
  ctx.stroke()
}

function drawHeader(ctx, spec) {
  // the Soft Compass mark: two overlapping circles
  ctx.beginPath()
  ctx.arc(LEFT + 15, 118, 15, 0, Math.PI * 2)
  ctx.fillStyle = C.sage
  ctx.fill()
  ctx.beginPath()
  ctx.arc(LEFT + 33, 118, 15, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(183, 165, 222, 0.9)'
  ctx.fill()

  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillStyle = C.ink
  ctx.font = `500 34px ${DISPLAY}`
  ctx.fillText('Soft Compass', LEFT + 62, 119)

  ctx.textAlign = 'right'
  ctx.fillStyle = C.soft
  ctx.font = `400 24px ${BODY}`
  ctx.fillText(spec.dateText, RIGHT, 119)
}

function drawTitleBlock(ctx, spec) {
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.fillStyle = C.sageDeep
  ctx.font = `600 22px ${BODY}`
  spaced(ctx, spec.title.toUpperCase(), LEFT, 214, 4)

  if (spec.name) {
    ctx.fillStyle = C.soft
    ctx.font = `400 26px ${BODY}`
    ctx.fillText('Prepared for', LEFT, 278)
    const maxWidth = RIGHT - LEFT
    let size = fitSize(ctx, spec.name, 500, DISPLAY, maxWidth, 92, 44)
    let lines = [spec.name]
    if (ctx.measureText(spec.name).width > maxWidth) {
      // still too long at the smallest size: use up to two lines
      size = 44
      ctx.font = `500 ${size}px ${DISPLAY}`
      lines = wrapLines(ctx, spec.name, maxWidth).slice(0, 2)
      if (wrapLines(ctx, spec.name, maxWidth).length > 2) lines[1] = `${lines[1]}…`
      lines = lines.map((line) => ellipsize(ctx, line, maxWidth))
    }
    ctx.fillStyle = C.ink
    ctx.font = `500 ${size}px ${DISPLAY}`
    lines.forEach((line, i) => ctx.fillText(line, LEFT, 278 + 24 + size * 0.78 + i * size * 1.12))
  } else {
    const size = fitSize(ctx, spec.heading, 500, DISPLAY, RIGHT - LEFT, 88, 44)
    ctx.fillStyle = C.ink
    ctx.font = `500 ${size}px ${DISPLAY}`
    ctx.fillText(spec.heading, LEFT, 214 + 30 + size * 0.8)
  }
}

function drawRadar(ctx, cx, cy, radius, axes, labelFactor) {
  const count = axes.length
  const point = (index, fraction) => {
    const angle = ((-90 + (360 / count) * index) * Math.PI) / 180
    return [cx + Math.cos(angle) * radius * fraction, cy + Math.sin(angle) * radius * fraction, Math.cos(angle)]
  }

  ctx.lineJoin = 'round'
  ctx.lineWidth = 2
  ctx.strokeStyle = C.line
  for (const fraction of [0.25, 0.5, 0.75, 1]) {
    ctx.beginPath()
    axes.forEach((_, i) => {
      const [x, y] = point(i, fraction)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.stroke()
  }
  axes.forEach((_, i) => {
    const [x, y] = point(i, 1)
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(x, y)
    ctx.stroke()
  })

  ctx.beginPath()
  axes.forEach((axis, i) => {
    const [x, y] = point(i, axis.percent / 100)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = 'rgba(155, 184, 149, 0.42)'
  ctx.fill()
  ctx.lineWidth = 4
  ctx.strokeStyle = C.sageDeep
  ctx.stroke()

  axes.forEach((axis, i) => {
    const [x, y] = point(i, axis.percent / 100)
    ctx.beginPath()
    ctx.arc(x, y, 7, 0, Math.PI * 2)
    ctx.fillStyle = C.sageDeep
    ctx.fill()
  })

  ctx.font = `500 25px ${BODY}`
  ctx.fillStyle = C.ink
  ctx.textBaseline = 'middle'
  axes.forEach((axis, i) => {
    const [x, y, side] = point(i, labelFactor)
    ctx.textAlign = side > 0.3 ? 'left' : side < -0.3 ? 'right' : 'center'
    const nudge = side > 0.3 ? 6 : side < -0.3 ? -6 : 0
    ctx.fillText(axis.label, x + nudge, y)
  })
}

function drawPersonality(ctx, spec) {
  drawRadar(ctx, W / 2, 690, 160, spec.axes, 1.24)

  const top = 928
  const step = 58
  spec.axes.forEach((axis, i) => {
    const y = top + i * step
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillStyle = C.ink
    ctx.font = `600 27px ${BODY}`
    ctx.fillText(axis.label, LEFT, y)

    const barX = 390
    const barW = 330
    roundedRect(ctx, barX, y - 7, barW, 14, 7)
    ctx.fillStyle = C.lavenderSoft
    ctx.fill()
    roundedRect(ctx, barX, y - 7, Math.max(14, (barW * axis.percent) / 100), 14, 7)
    ctx.fillStyle = C.lavenderDeep
    ctx.fill()

    ctx.textAlign = 'right'
    ctx.fillStyle = C.ink
    ctx.font = `600 27px ${BODY}`
    ctx.fillText(`${axis.percent}%`, 805, y)
    ctx.fillStyle = C.soft
    ctx.font = `400 22px ${BODY}`
    ctx.fillText(axis.bandLabel, RIGHT, y)
  })
}

function drawRiasec(ctx, spec) {
  drawRadar(ctx, W / 2, 646, 140, spec.axes, 1.28)

  const pillColors = [
    [C.sageSoft, C.sageDeep],
    [C.lavenderSoft, C.lavenderDeep],
    [C.blushSoft, C.blushDeep],
  ]
  const letters = Array.from(spec.code)
  const centres = [W / 2 - 200, W / 2, W / 2 + 200]
  letters.forEach((letter, i) => {
    const x = centres[i]
    const area = spec.top[i]
    ctx.beginPath()
    ctx.arc(x, 925, 54, 0, Math.PI * 2)
    ctx.fillStyle = pillColors[i][0]
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = C.line
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = pillColors[i][1]
    ctx.font = `500 58px ${DISPLAY}`
    ctx.fillText(letter, x, 930)

    ctx.fillStyle = C.ink
    ctx.font = `600 25px ${BODY}`
    ctx.fillText(area.name, x, 1011)
    ctx.fillStyle = C.soft
    ctx.font = `400 22px ${BODY}`
    ctx.fillText(`${area.percent}%`, x, 1042)
  })

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = C.ink
  ctx.font = `500 32px ${DISPLAY}`
  ctx.fillText('Careers to explore', LEFT, 1105)

  ctx.font = `400 24px ${BODY}`
  const pick = (perArea) => spec.top.flatMap((t) => t.careers.slice(0, perArea))
  let lines = wrapItems(ctx, pick(2), RIGHT - LEFT)
  if (lines.length > 2) lines = wrapItems(ctx, pick(1), RIGHT - LEFT)
  ctx.fillStyle = C.soft
  lines.slice(0, 2).forEach((line, i) => ctx.fillText(line, LEFT, 1145 + i * 34))

  if (spec.isFlat) {
    ctx.font = `400 italic 21px ${BODY}`
    ctx.fillText('Your scores are close together, so treat this code as a gentle hint.', LEFT, 1218)
  }
}

function drawFooter(ctx) {
  ctx.beginPath()
  ctx.moveTo(LEFT, 1236)
  ctx.lineTo(RIGHT, 1236)
  ctx.lineWidth = 2
  ctx.strokeStyle = C.line
  ctx.stroke()

  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.fillStyle = C.soft
  ctx.font = `400 21px ${BODY}`
  const note = 'A reflection tool, not clinically validated and not a diagnosis. Scores describe tendencies, not good or bad outcomes.'
  wrapLines(ctx, note, 880).slice(0, 2).forEach((line, i) => ctx.fillText(line, LEFT, 1270 + i * 28))

  const host = window.location.host
  if (host && !/localhost|127\.0\.0\.1/.test(host)) {
    ctx.textAlign = 'right'
    ctx.fillStyle = C.lavenderDeep
    ctx.font = `500 21px ${BODY}`
    ctx.fillText(host, RIGHT, 1270 + 28)
  }
}

// ----- the things other files use -----
export async function renderReportCard(spec) {
  await loadFonts()
  const canvas = document.createElement('canvas')
  canvas.width = W * SCALE
  canvas.height = H * SCALE
  const ctx = canvas.getContext('2d')
  ctx.scale(SCALE, SCALE)

  drawBackground(ctx)
  drawHeader(ctx, spec)
  drawTitleBlock(ctx, spec)
  if (spec.kind === 'riasec') drawRiasec(ctx, spec)
  else drawPersonality(ctx, spec)
  drawFooter(ctx)
  return canvas
}

export function fileNameFor(spec) {
  const slug = (spec.name || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `soft-compass-${spec.kind}${slug ? `-${slug}` : ''}.jpg`
}

export async function downloadReportCard(spec) {
  const canvas = await renderReportCard(spec)
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('The image could not be created'))), 'image/jpeg', 0.92)
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileNameFor(spec)
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}