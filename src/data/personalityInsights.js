// ---------------------------------------------------------------
// Original wording written for Soft Compass.
// Each dimension has three "bands" (lower / in the middle / higher),
// chosen from the 0-100 score:  0-33 lower,  34-66 middle,  67-100 higher.
// "lean" and "grow" are shown only for your highest and lowest dimension.
// Nothing here is a diagnosis: these are everyday tendencies.
// ---------------------------------------------------------------

export function bandFor(percent) {
  if (percent <= 33) return 'low'
  if (percent <= 66) return 'mid'
  return 'high'
}

export const bandLabels = {
  low: 'Lower',
  mid: 'In the middle',
  high: 'Higher',
}

export const insights = {
  energy: {
    low: {
      title: 'Quietly energised',
      text: 'You tend to recharge in calm, low-key settings and may prefer a few close conversations to big gatherings. Many people with this pattern do their best thinking when they have space to themselves.',
      tip: 'Notice which small settings leave you feeling most at ease, and protect time for them.',
    },
    mid: {
      title: 'Flexible with company',
      text: 'You move comfortably between lively company and quiet time, adapting to what each situation calls for.',
      tip: 'Pay attention to when you need more people around and when you need more space.',
    },
    high: {
      title: 'Drawn to company',
      text: 'You tend to gain energy from people, conversation and activity, and you may often be the one who brings a group together.',
      tip: 'Build in some quiet time too, so busy stretches do not crowd out reflection.',
    },
    lean: 'Your ease around people can help you build networks, speak up for ideas and keep groups connected.',
    grow: 'You might practise sharing ideas out loud in small, friendly groups. It can make your quieter strengths easier for others to see.',
  },
  curiosity: {
    low: {
      title: 'Grounded and practical',
      text: 'You tend to prefer what is familiar, tested and concrete, and you may value routines that work. You are likely to trust what has been proven.',
      tip: 'Try one small new experience this month and notice how it feels.',
    },
    mid: {
      title: 'Selectively curious',
      text: 'You enjoy new ideas and experiences when they interest you, while still valuing what is familiar.',
      tip: 'Notice which kinds of new things pull you in, because they point to what you care about.',
    },
    high: {
      title: 'Explorer of ideas',
      text: 'You tend to be drawn to new ideas, art, questions and experiences, and you enjoy wondering how and why things work.',
      tip: 'Choose one idea to follow all the way through, so your curiosity turns into something finished.',
    },
    lean: 'Your appetite for ideas can help you learn quickly, spot connections and enjoy changing circumstances.',
    grow: 'Borrowing a little curiosity, such as asking one "what if?" question a day, can open options you might otherwise skip.',
  },
  structure: {
    low: {
      title: 'Spontaneous and flexible',
      text: 'You tend to keep plans loose and adapt as you go, which can make you resourceful when things change.',
      tip: 'A simple weekly list of three priorities can add a little structure without costing you flexibility.',
    },
    mid: {
      title: 'Balanced planner',
      text: 'You plan when it helps and improvise when it does not, using structure as a tool rather than a rule.',
      tip: 'Notice which tasks go better with a plan, and which go better without one.',
    },
    high: {
      title: 'Organised and steady',
      text: 'You tend to plan ahead, follow through and like to know where things stand. Others may rely on you to finish what you start.',
      tip: 'Leave some unscheduled space, so surprises feel like room rather than disruption.',
    },
    lean: 'Your follow-through can make you dependable, and it helps long projects reach the finish line.',
    grow: 'Small habits such as a short end-of-day list can give you more control over your time without making life rigid.',
  },
  warmth: {
    low: {
      title: 'Direct and analytical',
      text: 'You tend to lead with facts and logic and may be comfortable with honest disagreement. Careful, objective thinking can be a real strength.',
      tip: 'When it matters, say out loud the care behind your directness so others can hear it.',
    },
    mid: {
      title: 'Warm when it counts',
      text: 'You balance care for other people with your own needs and judgement.',
      tip: 'Notice where you give most freely, and where you hold back.',
    },
    high: {
      title: 'Caring and trusting',
      text: 'You tend to notice how others feel, give people the benefit of the doubt and find meaning in helping.',
      tip: 'Supporting yourself is part of supporting others, so it is fine to set limits.',
    },
    lean: 'Your care for others can help you build trust quickly, and it is a strength in teaching, teamwork and support roles.',
    grow: 'Asking one curious question about how someone is feeling can build closeness without changing who you are.',
  },
  steadiness: {
    low: {
      title: 'Sensitive to ups and downs',
      text: 'You may feel stress and change quite strongly and notice small shifts in your mood. The same sensitivity can make you attentive and thorough.',
      tip: 'Small routines such as sleep, movement and time outdoors often help. If stress feels heavy or constant, talking to someone you trust, or a professional, is a good idea.',
    },
    mid: {
      title: 'Generally even',
      text: 'You handle most pressures reasonably well, with some days harder than others.',
      tip: 'Notice what helps you reset after a hard day and make it easy to repeat.',
    },
    high: {
      title: 'Calm under pressure',
      text: 'You tend to stay composed when plans change or things go wrong, and you recover fairly quickly from setbacks.',
      tip: 'Check in on people who feel pressure more strongly than you. Your calm can help them.',
    },
    lean: 'Your composure can be a steadying presence for others, especially when plans change or pressure rises.',
    grow: 'Small calming habits, such as a short walk or a few slow breaths before a stressful moment, can help you feel more settled.',
  },
}