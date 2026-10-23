import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../data/contact.js'
import '../styles/legal.css'

export default function TermsPage() {
  return (
    <section className="section legal" aria-labelledby="terms-title">
      <div className="container legal__inner">
        <span className="eyebrow">Terms</span>
        <h1 id="terms-title">Terms and Conditions</h1>
        <p className="legal__updated">Last updated: 23 October 2026</p>

        <p>
          By using Soft Compass you agree to these terms. If you do not agree with them, please do
          not use the site.
        </p>

        <h2>What Soft Compass is</h2>
        <p>
          Soft Compass offers self-reflection tools: a personality reflection and a career
          interest explorer. They are written for this site and are meant to help you think. They
          are <strong>not</strong> clinical or professionally validated tests, and they are not a
          diagnosis, medical advice, psychological advice or professional career advice. Please do
          not use them to make important decisions on their own. If you are worried about how you
          feel, talk to a professional you trust.
        </p>

        <h2>Using the site</h2>
        <ul>
          <li>You can use the assessments without an account.</li>
          <li>Please do not try to break, overload or probe the security of the site, or use automated tools to collect its content.</li>
          <li>Please do not use the site for anything unlawful or harmful to other people.</li>
        </ul>

        <h2>Accounts</h2>
        <p>
          If you create an account, please give a real email address you control and keep your
          password private. You are responsible for what happens under your account. We may
          suspend or remove accounts that are misused. You can ask us to delete your account at
          any time (see the <Link to="/privacy">Privacy Policy</Link>).
        </p>

        <h2>Our content</h2>
        <p>
          The questions, scoring, explanations and design of Soft Compass belong to the project.
          You may download your own report card and keep or share it for personal use. Please do
          not copy the rest of the content to republish it or to sell it.
        </p>

        <h2>No guarantees</h2>
        <p>
          The site and its results are provided &ldquo;as is&rdquo;. We do our best, but we cannot
          promise that the site will always be available, error-free, or that its results will
          suit your situation. To the extent the law allows, we are not responsible for losses
          that arise from using the site or relying on its results.
        </p>

        <h2>Changes</h2>
        <p>
          We may update the site or these terms from time to time. When we make a meaningful
          change, we will update the date above. Continuing to use the site afterwards means you
          accept the updated terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Write to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </section>
  )
}