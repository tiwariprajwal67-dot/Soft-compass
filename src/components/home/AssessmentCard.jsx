import { Link } from 'react-router-dom'
import './AssessmentCard.css'

export default function AssessmentCard({
  tone,
  eyebrow,
  title,
  description,
  questions,
  minutes,
  to,
  delay = 0,
}) {
  return (
    <article
      className={`card card--${tone} fade-up`}
      style={{ '--delay': `${delay + 0.1}s` }}
    >
      <span className="card__eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p className="card__text">{description}</p>

      <ul className="card__meta" aria-label="Assessment details">
        <li>About {questions} questions</li>
        <li>~{minutes} minutes</li>
      </ul>

      {/* If this card has a page ("to"), show a real link. Otherwise a disabled button. */}
      {to ? (
        <Link className="btn btn--primary" to={to}>
          Begin
        </Link>
      ) : (
        <button type="button" className="btn btn--primary" disabled>
          Opening soon
        </button>
      )}
    </article>
  )
}