import { bandFor, bandLabels } from '../data/personalityInsights.js'

const TITLES = { personality: 'Personality Reflection', riasec: 'Career Interest Explorer' }

// Turns a test's results into the plain description the card-drawing code needs.
export function buildSpec({ kind, results, name = '' }) {
  const dateText = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })

  if (kind === 'riasec') {
    return {
      kind,
      name,
      dateText,
      title: TITLES.riasec,
      heading: 'Your interest code',
      code: results.code,
      isFlat: Boolean(results.isFlat),
      axes: results.scores.map((s) => ({ key: s.key, label: s.name, percent: s.percent })),
      top: results.top.map((t) => ({ key: t.key, name: t.name, percent: t.percent, careers: t.careers })),
    }
  }

  return {
    kind: 'personality',
    name,
    dateText,
    title: TITLES.personality,
    heading: 'Your personality profile',
    axes: results.map((r) => ({
      key: r.key,
      label: r.label,
      percent: r.percent,
      bandLabel: bandLabels[bandFor(r.percent)],
    })),
  }
}