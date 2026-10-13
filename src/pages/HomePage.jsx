import Hero from '../components/home/Hero.jsx'
import AssessmentCard from '../components/home/AssessmentCard.jsx'
import HowItWorks from '../components/home/HowItWorks.jsx'
import { assessments } from '../data/assessments.js'

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="assessments" className="section" aria-labelledby="assessments-title">
        <div className="container">
          <span className="eyebrow">Begin here</span>
          <h2 id="assessments-title">Choose a place to start</h2>
          <div className="assessment-grid">
            {assessments.map((item, index) => (
              <AssessmentCard key={item.id} {...item} delay={0.1 * index} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
    </>
  )
}