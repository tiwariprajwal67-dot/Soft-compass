import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE = 'Soft Compass'
const HOME_DESCRIPTION =
  'Soft Compass: thoughtful, original self-reflection tools for exploring your personality and career interests.'

const pages = {
  '/': { title: `${SITE} · Personality & Career Interest Explorer`, description: HOME_DESCRIPTION },
  '/personality': {
    title: `Personality Reflection · ${SITE}`,
    description:
      'Thirty short statements about how you connect, think, plan, feel and cope. A gentle self-reflection tool, not a clinical test.',
  },
  '/career-interests': {
    title: `Career Interest Explorer · ${SITE}`,
    description:
      'Find which of six broad interest areas fits you best and discover kinds of work worth exploring. For reflection, not a prediction.',
  },
  '/privacy': {
    title: `Privacy Policy · ${SITE}`,
    description: 'What information Soft Compass uses, what stays on your device, and your choices.',
  },
  '/terms': { title: `Terms and Conditions · ${SITE}`, description: 'The terms for using Soft Compass.' },
  '/login': { title: `Sign in · ${SITE}`, noindex: true },
  '/signup': { title: `Create account · ${SITE}`, noindex: true },
  '/forgot-password': { title: `Reset your password · ${SITE}`, noindex: true },
  '/reset-password': { title: `Choose a new password · ${SITE}`, noindex: true },
  '/account': { title: `Your account · ${SITE}`, noindex: true },
  '/report': { title: `Your report · ${SITE}`, noindex: true },
}

const NOT_FOUND = { title: `Page not found · ${SITE}`, noindex: true }

function setMeta(name, content) {
  let tag = document.head.querySelector(`meta[name="${name}"]`)
  if (!content) {
    tag?.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export default function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/'
    const page = pages[path] ?? NOT_FOUND
    document.title = page.title
    setMeta('description', page.description ?? HOME_DESCRIPTION)
    setMeta('robots', page.noindex ? 'noindex, nofollow' : '')
  }, [pathname])

  return null
}