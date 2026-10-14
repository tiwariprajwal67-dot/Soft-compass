// A simple "spider" chart drawn as plain SVG, so no chart library is needed.
// Works for any number of dimensions (5 gives a pentagon, 6 a hexagon...).
const CX = 225
const CY = 162
const RADIUS = 118

function point(index, count, fraction) {
  const angle = (-90 + (360 / count) * index) * (Math.PI / 180)
  return [
    CX + Math.cos(angle) * RADIUS * fraction,
    CY + Math.sin(angle) * RADIUS * fraction,
  ]
}

function toPoints(list) {
  return list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

export default function RadarChart({ scores, label = 'Profile chart' }) {
  const count = scores.length
  const rings = [0.25, 0.5, 0.75, 1]
  const dataPoints = scores.map((score, i) => point(i, count, score.percent / 100))
  const summary = scores.map((s) => `${s.label} ${s.percent} percent`).join(', ')

  return (
    <svg className="radar" viewBox="0 0 450 316" role="img" aria-label={`${label}. ${summary}`}>
      {rings.map((fraction) => (
        <polygon
          key={fraction}
          className="radar__ring"
          points={toPoints(scores.map((_, i) => point(i, count, fraction)))}
        />
      ))}

      {scores.map((score, i) => {
        const [x, y] = point(i, count, 1)
        return <line key={score.key} className="radar__axis" x1={CX} y1={CY} x2={x} y2={y} />
      })}

      <polygon className="radar__shape" points={toPoints(dataPoints)} />

      {dataPoints.map(([x, y], i) => (
        <circle key={scores[i].key} className="radar__dot" cx={x} cy={y} r="4" />
      ))}

      {scores.map((score, i) => {
        const [x, y] = point(i, count, 1.22)
        const side = Math.cos((-90 + (360 / count) * i) * (Math.PI / 180))
        const anchor = side > 0.3 ? 'start' : side < -0.3 ? 'end' : 'middle'
        return (
          <text
            key={score.key}
            className="radar__label"
            x={x + (anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0)}
            y={y}
            textAnchor={anchor}
          >
            {score.label}
          </text>
        )
      })}
    </svg>
  )
}