import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import './Header.css'


const links = [
  { to: '/#assessments', label: 'Assessments' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#privacy', label: 'Privacy' },
  { to: '/login', label: 'Sign in' }

]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__brand" onClick={() => setOpen(false)}>
          <span className="header__mark" aria-hidden="true" />
          Soft Compass
        </Link>

        <div className="header__right">
          <nav
            id="primary-nav"
            className={`header__nav ${open ? 'is-open' : ''}`}
            aria-label="Primary"
          >
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            className="header__toggle"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
    </header>
  )
}
