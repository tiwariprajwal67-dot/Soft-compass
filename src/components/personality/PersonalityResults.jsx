import { Link } from 'react-router-dom'
import RadarChart from './RadarChart.jsx'
import { insights, bandFor, bandLabels } from '../../data/personalityInsights.js'

export default function PersonalityResults({ results, onRestart }) {
  const rows = results.map((result) => {
    const band = bandFor(result.percent)
    return { ...result, band, insight: insights[result.key] }
  })

  // Sorting a copy: the highest and lowest dimensions drive the "where to go" section.
  const ranked = [...rows].sort((a, b) => b.percent - a.percent)
  const highest = ranked[0]
  const lowest = ranked[ranked.length - 1]
  const isBalanced = highest.percent - lowest.percent < 20

  return (
    <section className="assess__card pres" aria-labelledby="pres-title">
      <span className="eyebrow">Your results</span>
      <h1 id="pres-title">Your personality profile</h1>
      <p className="assess__lead">
        Here is how your answers add up across five dimensions. A higher or
        lower score is not better or worse. It describes a tendency, and
        tendencies can look different from one situation to the next.
      </p>

      <p className="assess__badge">Preview · not saved anywhere yet</p>

      <div className="pres__grid">
        <RadarChart scores={rows} label="Personality profile" />

        <ul className="meters">
          {rows.map((row) => (
            <li key={row.key} className="meter">
              <div className="meter__top">
                <span>{row.label}</span>
                <span>{row.percent}%</span>
              </div>
              <div className="meter__track" aria-hidden="true">
                <div className="meter__fill" style={{ width: `${row.percent}%` }} />
              </div>
              <p className="meter__summary">{bandLabels[row.band]}</p>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="pres__heading">Dimension by dimension</h2>
      <div className="pdims">
        {rows.map((row) => {
          const item = row.insight[row.band]
          return (
            <article key={row.key} className="pdim" data-band={row.band}>
              <div className="pdim__head">
                <h3>{row.label}</h3>
                <span className="pdim__level">{bandLabels[row.band]}</span>
              </div>
              <p className="pdim__title">{item.title}</p>
              <p>{item.text}</p>
              <p className="pdim__tip">
                <strong>To reflect on:</strong> {item.tip}
              </p>
            </article>
          )
        })}
      </div>

      <h2 className="pres__heading">Where to go from here</h2>
      {isBalanced ? (
        <p className="pres__balanced">
          Your five scores are quite close together, so no single dimension
          stands out. A balanced profile like this can mean you adapt easily to
          different situations. The explanations above are the most useful
          place to start. Pick the one that feels most true, and notice
          when it shows up this week.
        </p>
      ) : (
        <div className="pnext">
          <article className="pnext__card">
            <span className="pnext__tag">A strength to lean on</span>
            <h3>{highest.label}</h3>
            <p>{highest.insight.lean}</p>
          </article>
          <article className="pnext__card">
            <span className="pnext__tag">Something to stretch</span>
            <h3>{lowest.label}</h3>
            <p>{lowest.insight.grow}</p>
          </article>
        </div>
      )}

      <details className="assess__details">
        <summary>How these scores were calculated</summary>
        <div>
          <p>
            Each dimension is measured by six statements, rated from 1 to 5.
            Statements worded in the opposite direction are flipped before
            adding up. The six adjusted ratings are added together and
            rescaled to 0–100. Scores up to 33 are shown as lower, 34 to 66
            as in the middle, and 67 or more as higher.
          </p>
        </div>
      </details>

      <p className="assess__note">
        Soft Compass is a reflection tool written for this site. It is not
        clinically validated and is not a diagnosis. The steadiness dimension
        describes everyday tendencies, not mental health. If you are worried
        about how you feel, please talk to a professional you trust.
      </p>

      <div className="assess__actions">
        <button type="button" className="btn btn--ghost" onClick={onRestart}>
          Retake
        </button>
        <Link className="btn btn--ghost" to="/career-interests">
          Explore career interests
        </Link>
        <Link className="btn btn--primary" to="/">
          Back to home
        </Link>
      </div>
    </section>
  )
}