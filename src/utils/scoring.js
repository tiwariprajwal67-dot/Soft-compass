import { dimensions, questions } from '../data/personalityQuestions.js'

// Turns the answers (for example { q1: 4, q2: 2, ... }) into one score per dimension.
//
// Step 1: Each answer is 1 to 5.
// Step 2: For "reverse" questions we flip it (5 becomes 1, 4 becomes 2, and so on)
//         using: 6 - answer.
// Step 3: Add up the 6 answers for a dimension. The total is between 6 and 30.
// Step 4: Rescale that total to a 0-100 scale so it is easy to read.
export function scorePersonality(answers) {
  return dimensions.map((dimension) => {
    const items = questions.filter((q) => q.dimension === dimension.key)

    const total = items.reduce((sum, q) => {
      const answer = answers[q.id]
      const adjusted = q.reverse ? 6 - answer : answer
      return sum + adjusted
    }, 0)

    const lowest = items.length * 1
    const highest = items.length * 5
    const percent = Math.round(((total - lowest) / (highest - lowest)) * 100)

    return { ...dimension, total, percent }
  })
}