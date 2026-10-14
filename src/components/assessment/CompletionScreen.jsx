import { Link } from 'react-router-dom'

export default function CompletionScreen({ results, onRestart }) {
  return (
    <section className="assess__card" aria-labelledby="complete-title">
      <span className="eyebrow">All done</span>
      <h1 id="complete-title">Thank you for reflecting.</h1>
      <p className="assess__lead">
        You answered every question. Below is a quick preview of how your
        answers add up. A full results page with charts and explanations
        arrives in a later stage.
      </p>

      <p className="assess__badge">Preview · not saved anywhere yet</p>

      <ul className="meters">
        {results.map((result) => (
          <li key={result.key} className="meter">
            <div className="meter__top">
              <span>{result.label}</span>
              <span>{result.percent}%</span>
            </div>
            <div className="meter__track" aria-hidden="true">
              <div className="meter__fill" style={{ width: `${result.percent}%` }} />
            </div>
            <p className="meter__summary">{result.summary}</p>
          </li>
        ))}
      </ul>

      <p className="assess__note">
        These scores describe tendencies, not good or bad outcomes. Soft
        Compass is a reflection tool, not a clinically validated test.
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