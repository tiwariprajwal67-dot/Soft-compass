import { useState, useEffect } from 'react'
import AssessmentIntro from '../components/assessment/AssessmentIntro.jsx'
import ProgressBar from '../components/assessment/ProgressBar.jsx'
import QuestionCard from '../components/assessment/QuestionCard.jsx'
import PersonalityResults from '../components/personality/PersonalityResults.jsx'
import '../components/personality/personality.css'
import { questions, answerOptions } from '../data/personalityQuestions.js'
import { scorePersonality } from '../utils/scoring.js'
import '../components/assessment/assessment.css'

export default function PersonalityPage() {
  // "State" = things this page needs to remember.
  const [stage, setStage] = useState('intro') // 'intro' | 'questions' | 'complete'
  const [index, setIndex] = useState(0) // which question we're on (0 = the first)
  const [answers, setAnswers] = useState({}) // for example { q1: 4, q2: 2 }

  // Jump to the top whenever we switch screens.
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
          eyebrow="Self-reflection"
          title="Personality Reflection"
          lead="Thirty short statements about how you connect, think, plan, feel and cope. Answer quickly and honestly. Your first instinct is usually the best guide."
          questionCount={questions.length}
          minutes={6}
          onStart={() => setStage('questions')}
        />
      )}

      {stage === 'questions' && (
        <section className="assess__card" aria-label="Personality questions">
          <ProgressBar answered={answeredCount} total={questions.length} />

          {/* Announces the new question to screen readers */}
          <p className="visually-hidden" aria-live="polite">
            Question {index + 1} of {questions.length}
          </p>

          {/* key={question.id} makes React treat each question as brand new, which replays the fade-in */}
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
        <PersonalityResults results={scorePersonality(answers)} onRestart={handleRestart} />
      )}
    </div>
  )
}