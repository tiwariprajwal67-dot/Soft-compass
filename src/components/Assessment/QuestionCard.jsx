// A <fieldset> with a <legend> is the accessible way to group radio buttons
// under one question. Screen readers will read the question before the options.
export default function QuestionCard({ question, number, total, options, selected, onSelect }) {
  return (
    <fieldset className="question">
      <legend className="question__legend">
        <span className="question__count">
          Question {number} of {total}
        </span>
        <span className="question__text">{question.text}</span>
      </legend>

      <div className="question__options">
        {options.map((option) => (
          <label key={option.value} className="option">
            <input
              type="radio"
              name={question.id}
              value={option.value}
              checked={selected === option.value}
              onChange={() => onSelect(option.value)}
            />
            <span className="option__label">
              <span className="option__dot" aria-hidden="true" />
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}