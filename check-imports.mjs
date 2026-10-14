// Finds imports whose capital letters don't match the real file or folder names.
// Windows doesn't care about capitals, but Vercel (Linux) does.
// Run it with:  node check-imports.mjs
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const problems = []

function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)],
    )
}

// Walks the path one piece at a time and compares each piece letter-for-letter.
function checkPath(target) {
  const pieces = path.relative(root, target).split(path.sep)
  let current = root
  for (const piece of pieces) {
    if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) return { ok: false, reason: 'missing' }
    const entries = fs.readdirSync(current)
    if (!entries.includes(piece)) {
      const lookalike = entries.find((name) => name.toLowerCase() === piece.toLowerCase())
      return lookalike ? { ok: false, reason: 'case', wrote: piece, actual: lookalike } : { ok: false, reason: 'missing' }
    }
    current = path.join(current, piece)
  }
  return { ok: true }
}

const importPattern = /(?:from\s+|import\s+|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g

for (const file of walk('src').filter((f) => /\.(js|jsx)$/.test(f))) {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, index) => {
    for (const match of line.matchAll(importPattern)) {
      const target = path.resolve(path.dirname(file), match[1])
      const result = checkPath(target)
      if (!result.ok) {
        const note =
          result.reason === 'case'
            ? `capitals differ: you wrote "${result.wrote}" but the real name is "${result.actual}"`
            : 'file not found'
        problems.push(`${file}:${index + 1}\n    ${match[1]}\n    -> ${note}`)
      }
    }
  })
}

if (problems.length === 0) {
  console.log('All imports match the real file names exactly. Safe for Vercel.')
} else {
  console.log(`Found ${problems.length} problem(s):\n`)
  console.log(problems.join('\n\n'))
  process.exitCode = 1
}