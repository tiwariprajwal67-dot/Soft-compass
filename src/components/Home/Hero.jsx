import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__text">
          <span className="eyebrow fade-up">Personality · Interests · Direction</span>
          <h1 className="fade-up" style={{ '--delay': '0.1s' }}>
            Understand yourself, <em>gently</em>.
          </h1>
          <p className="hero__lead fade-up" style={{ '--delay': '0.2s' }}>
            Two thoughtful, original assessments to help you reflect on how you
            see the world and what kinds of work might feel like a good fit.
          </p>
          <div className="hero__actions fade-up" style={{ '--delay': '0.3s' }}>
            <a className="btn btn--primary" href="#assessments">
              Explore the assessments
            </a>
            <a className="btn btn--ghost" href="#how-it-works">
              How it works
            </a>
          </div>
          <p className="hero__disclaimer fade-up" style={{ '--delay': '0.4s' }}>
            For reflection and exploration only. Not a clinical or
            professionally validated test.
          </p>
        </div>

        {/* Decorative overlapping circles (hidden from screen readers) */}
        <div className="hero__art fade-up" style={{ '--delay': '0.25s' }} aria-hidden="true">
          <span className="orb orb--sage" />
          <span className="orb orb--lavender" />
          <span className="orb orb--blush" />
        </div>
      </div>
    </section>
  )
}