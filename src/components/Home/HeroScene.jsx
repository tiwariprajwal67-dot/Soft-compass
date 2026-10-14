import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, Lightformer } from '@react-three/drei'
// How far the canvas overhangs each side of its box (fraction of box width).

// Gives the spheres room to swing sideways with the mouse without hitting the canvas edge.
const OVERHANG = 0.22
const WIDEN = 1 + OVERHANG * 2
// ---------------------------------------------------------------
// The scene: three satin-ceramic spheres (sage, lavender, blush) and one
// thin "compass" ring with a small bead travelling along it.
//   - Lavender is the largest and sits in the middle: the focal point.
//   - Sage sits behind and to the left, blush sits in front and to the right,
//     so the three sizes and depths give the picture real dimension.
//   - The ring nods to the "Soft Compass" name and ties the spheres together.
// Positions are in "scene units"; the whole group is scaled to fit its box.
// ---------------------------------------------------------------

const ORBS = [
  { id: 'lavender', color: '#b7a5de', sheen: '#e6dcff', position: [0.3, 0.05, 0], scale: 1.45, speed: 1.1, range: 0.14 },
  { id: 'sage', color: '#9bb895', sheen: '#e2f0dc', position: [-1.65, 0.95, -1.3], scale: 0.9, speed: 1.35, range: 0.12 },
  { id: 'blush', color: '#f1c4b7', sheen: '#ffe8df', position: [1.55, -1.1, 1.0], scale: 0.6, speed: 1.6, range: 0.1 },
]

const RING_RADIUS = 2.3
const RING_TILT = [1.12, 0.28, -0.35] // checked so the ring clears every sphere
const BEAD_START = 0.9

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const list = window.matchMedia(query)
    const update = () => setMatches(list.matches)
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [query])

  return matches
}

function Orb({ color, sheen, position, scale, speed, range, animate }) {
  return (
    <Float
      enabled={animate}
      speed={speed}
      rotationIntensity={0.12}
      floatIntensity={0.9}
      floatingRange={[-range, range]}
    >
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        {/* Satin ceramic: soft clear-coat, a velvety sheen at the edges and a
            faint iridescent shift. No transparency or refraction, so it is
            cheap to draw and looks the same on light and dark pages. */}
        <meshPhysicalMaterial
          color={color}
          roughness={0.42}
          metalness={0}
          clearcoat={0.55}
          clearcoatRoughness={0.2}
          sheen={0.7}
          sheenRoughness={0.45}
          sheenColor={sheen}
          iridescence={0.35}
          iridescenceIOR={1.25}
          iridescenceThicknessRange={[120, 420]}
        />
      </mesh>
    </Float>
  )
}

function CompassRing({ animate }) {
  const bead = useRef(null)
  const angle = useRef(BEAD_START)

  useFrame((_, delta) => {
    if (!animate || !bead.current) return
    angle.current += delta * 0.22
    bead.current.position.set(
      Math.cos(angle.current) * RING_RADIUS,
      Math.sin(angle.current) * RING_RADIUS,
      0,
    )
  })

  return (
    <group rotation={RING_TILT}>
      <mesh>
        <torusGeometry args={[RING_RADIUS, 0.016, 12, 180]} />
        {/* A mid-tone that stays visible on both the light and the night page */}
        <meshStandardMaterial color="#9a92b4" roughness={0.6} metalness={0} />
      </mesh>
      <mesh
        ref={bead}
        position={[Math.cos(BEAD_START) * RING_RADIUS, Math.sin(BEAD_START) * RING_RADIUS, 0]}
      >
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshPhysicalMaterial color="#fffaf1" roughness={0.2} clearcoat={1} />
      </mesh>
    </group>
  )
}

function Composition({ animate, finePointer }) {
  const tilt = useRef(null)
  const viewport = useThree((state) => state.viewport)

  // Scale the whole composition to fit its box, whatever shape the box is.
  const fit = Math.min(viewport.width / WIDEN / 5.1, viewport.height / 4.6, 1.3)
  // Gently turn the group toward the mouse. Because the spheres sit at
  // different depths, this makes them shift against each other (parallax).
  // Touch screens skip it: nothing to follow, and it saves battery.
  useFrame((state, delta) => {
    if (!animate || !finePointer || !tilt.current) return
    const { x, y } = state.pointer
    tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, x * 0.32, 3, delta)
    tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, -y * 0.18, 3, delta)
  })

  return (
    <group scale={fit}>
      <group ref={tilt}>
        {ORBS.map((orb) => (
          <Orb key={orb.id} {...orb} animate={animate} />
        ))}
        <CompassRing animate={animate} />
      </group>
    </group>
  )
}

// Tells the page "the first real frame has been drawn", so the flat
// placeholder can fade out without ever leaving an empty gap.
function ReadySignal({ onReady }) {
  const invalidate = useThree((state) => state.invalidate)
  const frames = useRef(0)

  useFrame(() => {
    frames.current += 1
    if (frames.current === 1) invalidate() // make sure a second frame happens
    if (frames.current === 2) onReady()
  })

  return null
}

export default function HeroScene({ onReady, onLost }) {
  const wrapper = useRef(null)
  const [visible, setVisible] = useState(true)
  const [ready, setReady] = useState(false)

  const calm = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const small = useMediaQuery('(max-width: 700px)')
  const animate = !calm

  // Stop drawing frames while the hero is scrolled out of view.
  useEffect(() => {
    const element = wrapper.current
    if (!element || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '80px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  function handleReady() {
    setReady(true)
    onReady?.()
  }

  return (
    <div
  ref={wrapper}
  className={`hero-canvas ${ready ? 'is-ready' : ''}`}
  style={{ left: `${-OVERHANG * 100}%`, right: `${-OVERHANG * 100}%` }}
>
      <Canvas
        // Reduced motion (or scrolled away) means: draw only when something changes.
        frameloop={animate && visible ? 'always' : 'demand'}
        camera={{ position: [0, 0, 10.5], fov: 30, near: 1, far: 40 }}
        dpr={[1, small ? 1.25 : 1.75]}
        gl={{ antialias: true, alpha: true }}
        // Listening on the whole page lets the spheres follow the mouse anywhere,
        // and means the canvas never blocks clicks or scrolling.
        eventSource={document.getElementById('root') ?? undefined}
        eventPrefix="client"
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping // keeps pastel colours true
          gl.toneMappingExposure = 1.05
          // If the browser drops the graphics context, hand control back to the page.
          gl.domElement.addEventListener('webglcontextlost', () => onLost?.(), { once: true })
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[-3.5, 4, 6]} intensity={1.7} color="#fff3e6" />

        {/* Soft studio lights that give the surfaces their reflections.
            Built in code, so it needs no download. Rendered once. */}
        <Environment resolution={256}>
          {/* the "room" colour: without it, reflections at the edges go black and look like an outline */}
          <color attach="background" args={['#a9a1b8']} />
          <Lightformer form="rect" intensity={2.4} position={[0, 5, 4]} scale={[10, 3, 1]} color="#ffffff" />
          <Lightformer form="circle" intensity={1.6} position={[-5, 0.5, 3]} scale={4} color="#ffe5d9" />
          <Lightformer form="circle" intensity={1.4} position={[5, -1, 3]} scale={4} color="#e0d6ff" />
          <Lightformer form="rect" intensity={1.2} position={[0, -3, -4]} scale={[8, 2, 1]} color="#d9ead3" />
        </Environment>

        <Composition animate={animate} finePointer={finePointer} />
        <ReadySignal onReady={handleReady} />
      </Canvas>
    </div>
  )
}