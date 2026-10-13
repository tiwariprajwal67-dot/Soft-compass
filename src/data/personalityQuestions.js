// ---------------------------------------------------------------
// Original questions written for Soft Compass.
// Each question belongs to ONE dimension.
// "reverse: true" means agreeing with the sentence points toward the LOWER end
// of that dimension, so its score is flipped when we calculate results.
// ---------------------------------------------------------------

export const answerOptions = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
]

export const dimensions = [
  {
    key: 'energy',
    label: 'Social energy',
    summary: 'How much you are drawn to company, conversation and lively settings.',
  },
  {
    key: 'curiosity',
    label: 'Curiosity',
    summary: 'Your appetite for new ideas, experiences and imaginative thinking.',
  },
  {
    key: 'structure',
    label: 'Structure',
    summary: 'How much you lean on planning, order and follow-through.',
  },
  {
    key: 'warmth',
    label: 'Warmth',
    summary: 'Your tendency toward empathy, kindness and trust in others.',
  },
  {
    key: 'steadiness',
    label: 'Steadiness',
    summary: 'How calmly you tend to handle stress, change and setbacks.',
  },
]

// 30 questions: 6 per dimension, 2 of those 6 reverse-scored.
// The order mixes the dimensions so it doesn't feel repetitive.
export const questions = [
  { id: 'q1', dimension: 'energy', text: 'I feel energised after spending an evening with a lively group of people.' },
  { id: 'q2', dimension: 'curiosity', text: 'I enjoy exploring ideas just to see where they lead.' },
  { id: 'q3', dimension: 'structure', text: 'I plan my week in advance and usually stick to the plan.' },
  { id: 'q4', dimension: 'warmth', text: 'I notice quickly when someone nearby is feeling upset.' },
  { id: 'q5', dimension: 'steadiness', text: 'I stay fairly calm when plans change unexpectedly.' },

  { id: 'q6', dimension: 'energy', reverse: true, text: 'I often prefer a quiet evening alone to a social event.' },
  { id: 'q7', dimension: 'curiosity', text: 'I like trying unfamiliar foods, places or hobbies.' },
  { id: 'q8', dimension: 'structure', text: 'I keep my belongings and workspace tidy.' },
  { id: 'q9', dimension: 'warmth', text: "I find it natural to put myself in another person's shoes." },
  { id: 'q10', dimension: 'steadiness', reverse: true, text: 'I often worry about things that might go wrong.' },

  { id: 'q11', dimension: 'energy', text: 'I start conversations easily with people I have just met.' },
  { id: 'q12', dimension: 'curiosity', reverse: true, text: 'I would rather follow a familiar routine than experiment.' },
  { id: 'q13', dimension: 'structure', text: 'I double-check my work before calling it finished.' },
  { id: 'q14', dimension: 'warmth', reverse: true, text: 'I am usually more interested in facts than in how people feel.' },
  { id: 'q15', dimension: 'steadiness', text: 'I recover quickly after a disappointing day.' },

  { id: 'q16', dimension: 'energy', text: 'I enjoy being the one who brings people together.' },
  { id: 'q17', dimension: 'curiosity', text: 'Art, music or stories can move me deeply.' },
  { id: 'q18', dimension: 'structure', reverse: true, text: 'I tend to leave tasks until the last minute.' },
  { id: 'q19', dimension: 'warmth', text: 'Helping others brings me real satisfaction.' },
  { id: 'q20', dimension: 'steadiness', text: 'I can usually keep my composure under pressure.' },

  { id: 'q21', dimension: 'energy', reverse: true, text: 'In group discussions I tend to wait until others have spoken.' },
  { id: 'q22', dimension: 'curiosity', text: 'I often wonder how things work beneath the surface.' },
  { id: 'q23', dimension: 'structure', text: 'I feel uneasy until a task I started is finished.' },
  { id: 'q24', dimension: 'warmth', reverse: true, text: 'I find it hard to forgive people who let me down.' },
  { id: 'q25', dimension: 'steadiness', reverse: true, text: 'My mood changes a lot from one day to the next.' },

  { id: 'q26', dimension: 'energy', text: 'I feel at ease speaking up in front of a crowd.' },
  { id: 'q27', dimension: 'curiosity', reverse: true, text: 'Abstract or philosophical questions feel like a waste of time.' },
  { id: 'q28', dimension: 'structure', reverse: true, text: 'I often lose track of things I meant to do.' },
  { id: 'q29', dimension: 'warmth', text: 'I assume people mean well until I have a reason to think otherwise.' },
  { id: 'q30', dimension: 'steadiness', text: 'Setbacks rarely stay on my mind for long.' },
]