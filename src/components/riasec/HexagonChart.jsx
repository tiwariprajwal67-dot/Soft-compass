const CENTER = 150
const RADIUS = 100

// Position of corner number "index" (0 = top), at "fraction" of the way out.
function point(index, fraction) {
  const angle = (-90 + index * 60) * (Math.PI / 180)
  return [
    CENTER + Math.cos(angle) * RADIUS * fraction,
    CENTER + Math.sin(angle) * RADIUS * fraction,
  ]
}

function toPoints(list) {
  return list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

export default function HexagonChart({ scores }) {
  const rings = [0.25, 0.5, 0.75, 1]
  const dataPoints = scores.map((score, i) => point(i, score.percent / 100))
  const summary = scores.map((s) => `${s.name} ${s.percent} percent`).join(', ')

  return (
    <svg
      className="hex"
      viewBox="0 0 300 300"
      role="img"
      aria-label={`Interest hexagon. ${summary}`}
    >
      {rings.map((fraction) => (
        <polygon
          key={fraction}
          className="hex__ring"
          points={toPoints(scores.map((_, i) => point(i, fraction)))}
        />
      ))}

      {scores.map((score, i) => {
        const [x, y] = point(i, 1)
        return <line key={score.key} className="hex__axis" x1={CENTER} y1={CENTER} x2={x} y2={y} />
      })}

      <polygon className="hex__shape" points={toPoints(dataPoints)} />

      {dataPoints.map(([x, y], i) => (
        <circle key={scores[i].key} className="hex__dot" cx={x} cy={y} r="4" />
      ))}

      {scores.map((score, i) => {
        const [x, y] = point(i, 1.24)
        return (
          <text key={score.key} className="hex__label" x={x} y={y}>
            {score.key}
          </text>
        )
      })}
    </svg>
  )
}