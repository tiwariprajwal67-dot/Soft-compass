export default function ProgressBar({ answered, total }) {
  const percent = Math.round((answered / total) * 100)

  return (
    <div className="progress">
      <div
        className="progress__track"
        role="progressbar"
        aria-label="Assessment progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
        aria-valuetext={`${answered} of ${total} questions answered`}
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}