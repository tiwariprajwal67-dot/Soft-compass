import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Runs every time the page address changes.
// If the address has a #section, scroll to it. Otherwise jump to the top.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null // it draws nothing; it only does a job
}