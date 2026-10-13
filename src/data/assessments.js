// The text shown on the homepage assessment cards.
// "to" is the page the card opens. A card without "to" shows as "Opening soon".

export const assessments = [
  {
    id: 'personality',
    tone: 'sage',
    eyebrow: 'Self-reflection',
    title: 'Personality Reflection',
    description:
      'An original set of questions about how you connect with others, think, plan, feel and cope. You will see a gentle profile across five personality dimensions.',
    questions: 30,
    minutes: 6,
    to: '/personality',
  },
  {
    id: 'riasec',
    tone: 'lavender',
    eyebrow: 'Career interests',
    title: 'Career Interest Explorer',
    description:
      'Explore six interest areas (Realistic, Investigative, Artistic, Social, Enterprising and Conventional) and discover careers that may fit what you enjoy.',
    questions: 36,
    minutes: 6,
    to: '/career-interests',
  },
]