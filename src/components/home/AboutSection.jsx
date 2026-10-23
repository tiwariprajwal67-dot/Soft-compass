import './AboutSection.css'

const principles = [
  {
    title: 'Written from scratch',
    text: 'Every question, score and explanation here is original. Nothing is copied from other tests.',
  },
  {
    title: 'Honest about its limits',
    text: 'These are reflection tools, not clinical or professionally validated tests. They describe tendencies. They do not diagnose anything or predict your future.',
  },
  {
    title: 'Scoring you can read',
    text: 'Each test explains how its scores are calculated, so you can see exactly where your results come from.',
  },
  {
    title: 'Your choice, always',
    text: 'You can take both tests without an account. Creating one, and saving or downloading your results, is optional.',
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__intro">
          <span className="eyebrow">About</span>
          <h2 id="about-title">
            A quiet place to <em>reflect</em>.
          </h2>
          <p className="about__lead">
            Soft Compass is a small, independent project for people who want to understand
            themselves a little better: how they connect with others, what holds their attention,
            and what kind of work might feel like a good fit.
          </p>
          <p>
            There are two short assessments. The Personality Reflection looks at five everyday
            tendencies: social energy, curiosity, structure, warmth and steadiness. The Career
            Interest Explorer uses the familiar idea that interests fall into six broad areas
            (Realistic, Investigative, Artistic, Social, Enterprising and Conventional) and
            suggests kinds of work worth exploring.
          </p>
        </div>

        <ul className="about__list">
          {principles.map((item) => (
            <li key={item.title} className="about__item">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}