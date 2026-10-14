const personalityScoring = [
  'You rate each statement from 1 (strongly disagree) to 5 (strongly agree). Each of the five dimensions is measured by six statements.',
  'Some statements are worded in the opposite direction (for example, preferring quiet evenings alone). For those, your rating is flipped before adding up, so that a higher score always means "more of this dimension".',
  'The six adjusted ratings are added together and rescaled to a 0–100 scale. A higher or lower score is not better or worse. It simply describes a tendency.',
]

export default function AssessmentIntro({
  eyebrow,
  title,
  lead,
  questionCount,
  minutes,
  scoring = personalityScoring,
  onStart,
}) {
  return (
    <section className="assess__card" aria-labelledby="intro-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1 id="intro-title">{title}</h1>
      <p className="assess__lead">{lead}</p>

      <ul className="assess__facts" aria-label="Assessment details">
        <li>{questionCount} questions</li>
        <li>About {minutes} minutes</li>
        <li>No right or wrong answers</li>
      </ul>

      <details className="assess__details">
        <summary>How is this scored?</summary>
        <div>
          {scoring.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </details>

      <p className="assess__note">
        This is just a reflection tool written for Soft Compass. It is not clinically
        validated and is not a diagnosis. Nothing you answer is saved to a
        server at this stage.
      </p>

      <button type="button" className="btn btn--primary" onClick={onStart}>
        Start
      </button>
    </section>
  )
}