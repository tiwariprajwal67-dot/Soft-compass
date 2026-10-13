// ---------------------------------------------------------------
// Original activity statements written for Soft Compass.
// R = Realistic, I = Investigative, A = Artistic,
// S = Social, E = Enterprising, C = Conventional
// Each type has exactly 6 activities. They are mixed so that every
// block of six questions contains one of each type.
// ---------------------------------------------------------------

export const answerOptions = [
  { value: 1, label: 'Strongly dislike' },
  { value: 2, label: 'Dislike' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Like' },
  { value: 5, label: 'Strongly like' },
]

// Listed in standard "Holland hexagon" order. The chart uses this order too.
export const riasecTypes = [
  {
    key: 'R',
    name: 'Realistic',
    description:
      'You tend to enjoy working with tools, machines, materials, plants or animals, and seeing a concrete result at the end. Practical problem-solving and being active often suit you.',
    careers: [
      'Electrician',
      'Mechanical or civil engineer',
      'Agricultural technician',
      'Carpenter or furniture maker',
      'Land surveyor',
      'Automotive technician',
    ],
  },
  {
    key: 'I',
    name: 'Investigative',
    description:
      'You tend to enjoy figuring things out: asking questions, analysing information and understanding how and why things work. Depth, logic and independent thinking often appeal to you.',
    careers: [
      'Research scientist',
      'Data analyst',
      'Software developer',
      'Doctor or pharmacist',
      'Laboratory technologist',
      'Economist',
    ],
  },
  {
    key: 'A',
    name: 'Artistic',
    description:
      'You tend to enjoy creating and expressing ideas through words, visuals, sound or performance. Originality and the freedom to do things your own way often matter to you.',
    careers: [
      'Graphic or UI designer',
      'Writer or editor',
      'Architect',
      'Photographer or filmmaker',
      'Musician or sound producer',
      'Art director',
    ],
  },
  {
    key: 'S',
    name: 'Social',
    description:
      'You tend to enjoy working with people: teaching, supporting, advising or helping them grow. Cooperation and making a difference to others often matter to you.',
    careers: [
      'Teacher or trainer',
      'Counsellor or social worker',
      'Nurse',
      'Community development officer',
      'Human resources specialist',
      'Occupational therapist',
    ],
  },
  {
    key: 'E',
    name: 'Enterprising',
    description:
      'You tend to enjoy leading, persuading and taking initiative: starting ventures, influencing decisions and pursuing ambitious goals. Energy and visible results often motivate you.',
    careers: [
      'Entrepreneur',
      'Sales or business development manager',
      'Marketing strategist',
      'Project or product manager',
      'Lawyer',
      'Campaign or public affairs manager',
    ],
  },
  {
    key: 'C',
    name: 'Conventional',
    description:
      'You tend to enjoy clear structure: organising information, following procedures and getting the details right. Reliability and order often feel natural to you.',
    careers: [
      'Accountant',
      'Operations or logistics coordinator',
      'Records or data manager',
      'Bank or insurance officer',
      'Administrative manager',
      'Quality control specialist',
    ],
  },
]

// [type, activity]. Each question reads: "How much would you enjoy <activity>?"
const items = [
  // Block 1
  ['R', 'repairing a bicycle or a small household appliance'],
  ['A', 'writing a short story, poem or song lyrics'],
  ['S', 'tutoring someone who is learning something new'],
  ['I', 'running a small experiment to test an idea'],
  ['C', 'organising files or spreadsheets so everything is easy to find'],
  ['E', 'persuading others to support an idea you believe in'],
  // Block 2
  ['E', 'starting a small business or side project'],
  ['I', 'analysing data to find the pattern behind a surprising result'],
  ['R', 'building a shelf or a piece of furniture from raw materials'],
  ['S', 'listening to a friend talk through a personal problem'],
  ['A', 'designing a poster, a logo or the layout of a room'],
  ['C', 'keeping accurate records of a budget or accounts'],
  // Block 3
  ['C', 'following clear step-by-step procedures to get a task exactly right'],
  ['S', 'volunteering on a community or charity project'],
  ['E', 'leading a team toward a challenging goal'],
  ['A', 'performing music, dance or drama for an audience'],
  ['I', 'reading about how the human body or brain works'],
  ['R', 'working outdoors with plants, animals or the land'],
  // Block 4
  ['I', 'solving a tricky logic puzzle or mathematics problem'],
  ['R', 'operating or maintaining machinery or vehicles'],
  ['C', 'proofreading documents to catch small errors'],
  ['E', 'negotiating to get a better deal'],
  ['S', 'helping people resolve a disagreement'],
  ['A', 'taking and editing photographs or short films'],
  // Block 5
  ['A', 'sketching or painting something from your imagination'],
  ['E', 'presenting a pitch to win support or funding'],
  ['I', 'researching a question in depth until you fully understand it'],
  ['C', 'scheduling and coordinating the details of an event'],
  ['R', 'wiring a lamp or fixing a leaking tap'],
  ['S', 'caring for someone who is unwell or needs support'],
  // Block 6
  ['S', 'coaching a group to build their skills and confidence'],
  ['C', 'keeping a stock list or tracking system tidy and up to date'],
  ['A', 'decorating a space so that it feels expressive and distinctive'],
  ['R', 'assembling equipment by following a technical diagram'],
  ['E', 'planning a campaign to promote a product or cause'],
  ['I', 'studying the night sky, fossils or wildlife with a scientific eye'],
]

export const questions = items.map(([type, activity], index) => ({
  id: `riasec-${index + 1}`,
  type,
  text: `How much would you enjoy ${activity}?`,
}))