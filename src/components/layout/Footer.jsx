import './Footer.css'

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
            Nothing is collected yet. When we add saving of results, you will see
            a full privacy notice and be asked for clear consent before any
            personal information is stored.
          </p>
        </div>
      </div>
      <p className="container footer__legal">© {new Date().getFullYear()} Soft Compass</p>
    </footer>
  )
}