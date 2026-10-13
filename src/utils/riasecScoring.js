import { riasecTypes, questions } from '../data/riasecQuestions.js'

// Turns answers like { 'riasec-1': 4, 'riasec-2': 2, ... } into results.
//
// 1. For each type, add up its 6 answers (lowest possible 6, highest 30).
// 2. Rescale that total to 0-100.
// 3. Rank the types from highest to lowest. JavaScript's sort keeps the
//    original order for ties, so ties are broken in R, I, A, S, E, C order.
// 4. The top three letters, in order, are the interest code.
export function scoreRiasec(answers) {
  const scores = riasecTypes.map((type) => {
    const items = questions.filter((q) => q.type === type.key)
    const total = items.reduce((sum, q) => sum + answers[q.id], 0)
    const lowest = items.length * 1
    const highest = items.length * 5
    const percent = Math.round(((total - lowest) / (highest - lowest)) * 100)
    return { ...type, total, percent }
  })

  const ranked = [...scores].sort((a, b) => b.total - a.total)
  const top = ranked.slice(0, 3)
  const code = top.map((type) => type.key).join('')

  // If every area scored about the same, the code says very little.
  const spread = ranked[0].percent - ranked[ranked.length - 1].percent
  const isFlat = spread < 20

  return { scores, ranked, top, code, isFlat }
}