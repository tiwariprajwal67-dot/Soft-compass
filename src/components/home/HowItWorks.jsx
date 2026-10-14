import './HowItWorks.css'

const steps = [
  {
    title: 'Answer honestly',
    text: 'Choose the response that feels most like you. There are no right or wrong answers, and no one is grading you.',
  },
  {
    title: 'See your pattern',
    text: 'Your answers are turned into scores using a simple, transparent method that we explain on every results page.',
  },
  {
    title: 'Reflect and explore',
    text: 'Read your profile, notice what resonates, and use the suggestions as starting points for your own thinking.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section how" aria-labelledby="how-title">
      <div className="container">
        <span className="eyebrow">Simple by design</span>
        <h2 id="how-title">How it works</h2>

        <ol className="how__list">
          {steps.map((step, index) => (
            <li key={step.title} className="how__step">
              <span className="how__number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}