import { Link } from 'react-router-dom'
import HexagonChart from './HexagonChart.jsx'

const rankLabels = ['Strongest area', 'Second area', 'Third area']

export default function RiasecResults({ results, onRestart }) {
  const { scores, ranked, top, code, isFlat } = results
  const letters = code.split('')

  return (
    <section className="assess__card" aria-labelledby="riasec-title">
      <span className="eyebrow">Your results</span>
      <h1 id="riasec-title">Your interest code</h1>

      <div
        className="rcode"
        role="img"
        aria-label={`Your three-letter interest code is ${letters.join(', ')}`}
      >
        {letters.map((letter) => (
          <span key={letter} className="rcode__letter" aria-hidden="true">
            {letter}
          </span>
        ))}
      </div>

      <p className="assess__lead">
        Your strongest interest areas are {top[0].name}, {top[1].name} and{' '}
        {top[2].name}. The letters show them in order, strongest first.
      </p>

      <p className="assess__badge">Preview · not saved anywhere yet</p>

      {isFlat && (
        <p className="assess__note rflat">
          Your scores are fairly close together, which means your interests are
          spread across several areas. That is perfectly normal, but it also
          means the three-letter code tells you less than it would for a more
          peaked profile. Treat the ranking as a gentle hint.
        </p>
      )}

      <div className="rgrid">
        <HexagonChart scores={scores} />

        <ul className="meters">
          {ranked.map((score) => (
            <li key={score.key} className="meter">
              <div className="meter__top">
                <span>
                  {score.key} · {score.name}
                </span>
                <span>{score.percent}%</span>
              </div>
              <div className="meter__track" aria-hidden="true">
                <div className="meter__fill" style={{ width: `${score.percent}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <h2>Your top areas and careers to explore</h2>

      <div className="rtypes">
        {top.map((type, i) => (
          <article key={type.key} className="rtype">
            <span className="rtype__rank">{rankLabels[i]}</span>
            <h3>
              {type.key} · {type.name}
            </h3>
            <p>{type.description}</p>
            <ul className="rtype__careers" aria-label={`Career ideas for ${type.name}`}>
              {type.careers.map((career) => (
                <li key={career}>{career}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="assess__note">
        These career ideas are starting points based on common links between
        interest areas and kinds of work. They are not predictions, and
        interests are only one part of choosing a path, alongside skills,
        values and circumstances. Soft Compass is a reflection tool and is not
        clinically validated.
      </p>

      <div className="assess__actions">
        <button type="button" className="btn btn--ghost" onClick={onRestart}>
          Retake
        </button>
        <Link className="btn btn--primary" to="/">
          Back to home
        </Link>
      </div>
    </section>
  )
}