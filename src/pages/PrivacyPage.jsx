import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../data/contact.js'
import '../styles/legal.css'

export default function PrivacyPage() {
  return (
    <section className="section legal" aria-labelledby="privacy-title">
      <div className="container legal__inner">
        <span className="eyebrow">Privacy</span>
        <h1 id="privacy-title">Privacy Policy</h1>
        <p className="legal__updated">Last updated: 23 October 2026</p>

        <p>
          Soft Compass is a small, independent project. This page explains, in plain language,
          what information the site uses and why. We try to collect as little as possible.
        </p>

        <h2>What we collect</h2>
        <p>You can take both assessments without an account. If you create an account, we store:</p>
        <ul>
          <li>your email address, used to sign you in and to send account emails (such as confirming your address or resetting your password);</li>
          <li>your password, which is handled by our sign-in provider and is never visible to us in readable form;</li>
          <li>your name, only if you choose to give it. It is printed on your downloadable report card;</li>
          <li>a note of when you agreed to this policy, and which version of it you agreed to.</li>
        </ul>

        <h2>What stays on your device</h2>
        <p>
          Your answers and your results are worked out inside your browser. They are not sent to
          our servers or saved to your account. The website stores a few small items on your device
          so it can work properly:
        </p>
        <ul>
          <li>your day or night mode choice;</li>
          <li>your sign-in, and whether you asked to stay signed in on this device;</li>
          <li>
            if you press download before signing in, your scores (not your answers) are kept on
            your device for up to one hour so you do not lose them while signing in. They are
            deleted once your report has been downloaded.
          </li>
        </ul>
        <p>
          These are needed for the site to work, so there is no cookie banner. We do not use
          advertising or tracking, and we do not currently use analytics. If that ever changes, this
          page will say so first.
        </p>

        <h2>Services that help us run the site</h2>
        <ul>
          <li><strong>Vercel</strong> hosts the website, and so receives the technical information any web host receives, such as your IP address, when you visit.</li>
          <li><strong>Supabase</strong> provides sign-in and stores account details.</li>
          <li><strong>Google Fonts</strong> supplies the fonts, so your browser contacts Google to download them.</li>
        </ul>
        <p>
          These providers handle data under their own terms and privacy policies. We do not sell
          your information.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep your account details for as long as your account exists. When you ask us to
          delete your account, we remove it.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask to see, correct or delete the information we hold about you at any time by
          emailing <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Soft Compass privacy request')}`}>{CONTACT_EMAIL}</a>.
          You can also clear this site&rsquo;s data in your browser settings whenever you like,
          which removes everything stored on your device.
        </p>

        <h2>Children</h2>
        <p>
          Soft Compass is not designed for children under 13, and we do not knowingly create
          accounts for them. If you think a child has given us their details, please email us and
          we will remove them.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we change this policy in a meaningful way, we will update the date above and, where
          appropriate, ask for your agreement again.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy? Write to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <p className="legal__note">
          See also the <Link to="/terms">Terms and Conditions</Link>. Soft Compass is a
          reflection tool. It is not a clinical or professionally validated test.
        </p>
      </div>
    </section>
  )
}