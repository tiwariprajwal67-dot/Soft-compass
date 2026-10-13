import { useState, useEffect } from 'react'
import AssessmentIntro from '../components/assessment/AssessmentIntro.jsx'
import ProgressBar from '../components/assessment/ProgressBar.jsx'
import QuestionCard from '../components/assessment/QuestionCard.jsx'
import RiasecResults from '../components/riasec/RiasecResults.jsx'
import { questions, answerOptions } from '../data/riasecQuestions.js'
import { scoreRiasec } from '../utils/riasecScoring.js'
import '../components/assessment/assessment.css'
import '../components/riasec/riasec.css'

const scoringExplanation = [
  'You rate how much you would enjoy 36 everyday activities, from 1 (strongly dislike) to 5 (strongly like). Each of the six interest areas is measured by six activities.',
  'The six ratings for an area are added together and rescaled to a 0–100 scale.',
  'Your three highest areas, in order, form your three-letter interest code. If two areas tie, the standard Holland order (R, I, A, S, E, C) is used to break the tie.',
  'The career ideas are starting points based on common links between interest areas and kinds of work. They are not predictions, and interests are only one part of choosing a path.',
]

export default function RiasecPage() {
  const [stage, setStage] = useState('intro') // 'intro' | 'questions' | 'complete'
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [stage])

  const question = questions[index]
  const answeredCount = Object.keys(answers).length
  const isLast = index === questions.length - 1
  const hasAnswer = answers[question.id] !== undefined

  function handleSelect(value) {
    setAnswers({ ...answers, [question.id]: value })
  }

  function handleNext() {
    if (isLast) {
      setStage('complete')
    } else {
      setIndex(index + 1)
    }
  }

  function handlePrevious() {
    setIndex(index - 1)
  }

  function handleRestart() {
    setAnswers({})
    setIndex(0)
    setStage('intro')
  }

  return (
    <div className="assess">
      {stage === 'intro' && (
        <AssessmentIntro
          eyebrow="Career interests"
          title="Career Interest Explorer"
          lead="Thirty-six everyday activities. For each one, choose how much you would enjoy doing it, setting aside pay, skill, and whether you have ever tried it."
          questionCount={questions.length}
          minutes={6}
          scoring={scoringExplanation}
          onStart={() => setStage('questions')}
        />
      )}

      {stage === 'questions' && (
        <section className="assess__card" aria-label="Career interest questions">
          <ProgressBar answered={answeredCount} total={questions.length} />

          <p className="visually-hidden" aria-live="polite">
            Question {index + 1} of {questions.length}
          </p>

          <QuestionCard
            key={question.id}
            question={question}
            number={index + 1}
            total={questions.length}
            options={answerOptions}
            selected={answers[question.id]}
            onSelect={handleSelect}
          />

          <div className="assess__nav">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handlePrevious}
              disabled={index === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleNext}
              disabled={!hasAnswer}
            >
              {isLast ? 'Finish' : 'Next'}
            </button>
          </div>
        </section>
      )}

      {stage === 'complete' && (
        <RiasecResults results={scoreRiasec(answers)} onRestart={handleRestart} />
      )}
    </div>
  )
}