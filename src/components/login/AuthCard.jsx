import './Login.css'
import './auth.css'

// A single-column card in the same style as your sign-in page, for the
// sign-up, forgot-password, reset-password and account screens.
export default function AuthCard({ title, subtitle, children }) {
  return (
    <section className="login login--auth">
      <div className="lg-card">
        <div className="lg-panel">
          <div>
            <h1 className="lg-title">{title}</h1>
            {subtitle && <p className="lg-sub">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}