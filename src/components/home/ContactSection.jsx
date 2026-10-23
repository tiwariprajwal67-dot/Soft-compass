import { CONTACT_EMAIL } from '../../data/contact.js'
import './ContactSection.css'

const topics = [
  {
    title: 'Questions and feedback',
    text: 'Tell us what worked, what confused you, or what you would like to see next.',
    subject: 'Soft Compass feedback',
  },
  {
    title: 'Report a problem',
    text: 'Found a bug or a broken page? Tell us what you were doing and which device you used.',
    subject: 'Soft Compass problem',
  },
  {
    title: 'Privacy and your data',
    text: 'Ask a question about your information, or request that your account and saved results be removed.',
    subject: 'Soft Compass privacy request',
  },
]

export default function ContactSection() {
  const hasEmail = Boolean(CONTACT_EMAIL)

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <span className="eyebrow">Contact</span>
        <h2 id="contact-title">
          Get in <em>touch</em>.
        </h2>
        <p className="contact__lead">
          Have a question about a test, an idea to make the site better, or something that looks
          wrong? We would love to hear from you.
        </p>

        <div className="contact__cards">
          {topics.map((topic) => (
            <article key={topic.title} className="contact__card">
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
              {hasEmail && (
                <a
                  className="btn btn--ghost"
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(topic.subject)}`}
                >
                  Email us
                </a>
              )}
            </article>
          ))}
        </div>

        {!hasEmail && (
          <p className="contact__soon">
            {import.meta.env.DEV
              ? 'Developer note: set CONTACT_EMAIL in src/data/contact.js to show the email buttons.'
              : 'Contact details are coming soon.'}
          </p>
        )}

        <p className="contact__note">
          Please do not send passwords or private medical details by email. Soft Compass cannot give
          medical, clinical or career-placement advice. If you are struggling, please talk to a
          professional or someone you trust.
        </p>
      </div>
    </section>
  )
}