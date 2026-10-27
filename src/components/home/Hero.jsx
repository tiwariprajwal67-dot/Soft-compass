import { lazy, Suspense, useEffect, useState } from 'react'
import SceneBoundary from './SceneBoundary.jsx'
import './Hero.css'

// "lazy" means the heavy 3D code loads AFTER the text appears,
// so the page never feels slow.
const HeroScene = lazy(() => import('./HeroScene.jsx'))

// Decide once whether to even try 3D: needs WebGL, and we skip it when the
// visitor has asked their browser to save data or the device reports very little memory.
function canUse3D() {
  try {
    if (navigator.connection?.saveData) return false
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) return false

    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return false
    // Give the test context straight back (browsers only allow a handful).
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

export default function Hero() {
  const [use3D] = useState(canUse3D)
  const [sceneReady, setSceneReady] = useState(false)
  const [sceneLost, setSceneLost] = useState(false)

  const showScene = use3D && !sceneLost

  // The flat circles are only a safety net. They stay hidden while the 3D scene loads,
  // and appear only if it is taking unusually long (3 seconds), so they never flash.
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    if (!showScene || sceneReady) return undefined
    const timer = setTimeout(() => setSlow(true), 3000)
    return () => clearTimeout(timer)
  }, [showScene, sceneReady])

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
              <svg
                className="btn__arrow"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
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

        {/* Decorative artwork: hidden from screen readers.
            Layers, back to front: glow, soft ground shadow, flat circles
            (always there, so the page never looks empty), then the 3D scene. */}
        <div className="hero__stage fade-up" style={{ '--delay': '0.25s' }} aria-hidden="true">
          <div className="hero__halo" />
          <div className="hero__ground" />

          <div className={`hero__flat ${showScene && (sceneReady || !slow) ? 'is-hidden' : ''}`}>
            <div className="orbs">
              <span className="orb orb--sage" />
              <span className="orb orb--lavender" />
              <span className="orb orb--blush" />
            </div>
          </div>

          {showScene && (
            <SceneBoundary fallback={null}>
              <Suspense fallback={null}>
                <HeroScene
                  onReady={() => setSceneReady(true)}
                  onLost={() => {
                    setSceneReady(false)
                    setSceneLost(true)
                  }}
                />
              </Suspense>
            </SceneBoundary>
          )}
        </div>
      </div>
    </section>
  )
}