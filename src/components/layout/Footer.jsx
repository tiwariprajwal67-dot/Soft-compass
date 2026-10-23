import { Link } from 'react-router-dom'
import './Footer.css'
import '../../styles/legal.css'

export default function Footer() {
  return (
    <footer className="footer" id="privacy">
      <div className="container footer__inner">
        <div>
          <p className="footer__brand">Soft Compass</p>
          <p className="footer__note">
            Soft Compass offers tools for self-reflection and curiosity. They are
            not clinically validated and are not a diagnosis or a substitute for
            professional psychological or career advice.
          </p>
        </div>
        <div>
          <p className="footer__heading">Privacy</p>
          <p className="footer__note">
            You can use both assessments without an account. Your answers and
            results stay in your browser. If you create an account, we store only
            your email address and, if you choose, your name.
          </p>
          <nav className="footer__links" aria-label="Legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms and Conditions</Link>
          </nav>
        </div>
      </div>
      <p className="container footer__legal">© {new Date().getFullYear()} Soft Compass</p>
    </footer>
  )
}