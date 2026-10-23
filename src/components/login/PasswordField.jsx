import { useState } from 'react'

// A password box with a show / hide button, using your sign-in page's styles.
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  invalid = false,
  hint,
}) {
  const [visible, setVisible] = useState(false)
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className="lg-field">
      <label className="lg-label" htmlFor={id}>
        {label}
      </label>
      <div className="lg-control">
        <input
          id={id}
          name="password"
          className="lg-input lg-input--pw"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={hintId}
        />
        <button
          type="button"
          className="lg-toggle"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
            {visible && <path d="M3 3l18 18" />}
          </svg>
        </button>
      </div>
      {hint && (
        <p id={hintId} className="lg-hint">
          {hint}
        </p>
      )}
    </div>
  )
}