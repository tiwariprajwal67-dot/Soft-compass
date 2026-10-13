import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>This page wandered off.</h1>
        <p style={{ margin: '1.25rem 0 2rem', color: 'var(--ink-soft)' }}>
          We couldn't find what you were looking for.
        </p>
        <Link className="btn btn--primary" to="/">
          Back to home
        </Link>
      </div>
    </section>
  )
}