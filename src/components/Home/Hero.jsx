import { lazy, Suspense, useState } from 'react'
import SceneBoundary from './SceneBoundary.jsx'
import './Hero.css'

// "lazy" means the heavy 3D code loads AFTER the text appears,
// so the page never feels slow.
const HeroScene = lazy(() => import('./HeroScene.jsx'))

// The simple flat version, shown while 3D loads, or if 3D can't run.
function FlatOrbs() {
  return (
    <div className="hero__scene hero__flat">
      <div className="orbs">
        <span className="orb orb--sage" />
        <span className="orb orb--lavender" />
        <span className="orb orb--blush" />
      </div>
    </div>
  )
}

function deviceSupportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function Hero() {
  const [webgl] = useState(deviceSupportsWebGL)

  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__text">
          <span className="eyebrow fade-up">Personality · Interests · Direction</span>
          <h1 className="fade-up" style={{ '--delay': '0.1s' }}>
            Understand yourself, <em>gently</em>.
          </h1>
          <p className="hero__lead fade-up" style={{ '--delay': '0.2s' }}>
            Two thoughtful, original assessments to help you reflect on how you
            see the world and what kinds of work might feel like a good fit.
          </p>
          <div className="hero__actions fade-up" style={{ '--delay': '0.3s' }}>
            <a className="btn btn--primary" href="#assessments">
              Explore the assessments
            </a>
            <a className="btn btn--ghost" href="#how-it-works">
              How it works
            </a>
          </div>
          <p className="hero__disclaimer fade-up" style={{ '--delay': '0.4s' }}>
            For reflection and exploration only. Not a clinical or
            professionally validated test.
          </p>
        </div>

        {/* Decorative scene: hidden from screen readers */}
        <div className="hero__stage fade-up" style={{ '--delay': '0.25s' }} aria-hidden="true">
          <div className="hero__halo" />
          {webgl ? (
            <SceneBoundary fallback={<FlatOrbs />}>
              <Suspense fallback={<FlatOrbs />}>
                <div className="hero__scene">
                  <HeroScene />
                </div>
              </Suspense>
            </SceneBoundary>
          ) : (
            <FlatOrbs />
          )}
        </div>
      </div>
    </section>
  )
}