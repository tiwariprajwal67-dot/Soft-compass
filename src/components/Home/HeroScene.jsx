jsx

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Lightformer } from '@react-three/drei'

const spheres = [
  {
    color: '#a9c0a4',
    position: [-0.8, 0.55, 0.2],
    scale: 1.05,
    speed: 1.2,
  },
  {
    color: '#b9a8dc',
    position: [0.8, 0.05, -0.4],
    scale: 0.95,
    speed: 1.6,
  },
  {
    color: '#f2c7ba',
    position: [0.05, -0.8, 0.3],
    scale: 0.82,
    speed: 1.4,
  },
]

function Spheres({ animate }) {
  const group = useRef()

  useFrame((state, delta) => {
    if (!animate || !group.current) return

    const ease = Math.min(1, delta * 2)
    const { x, y } = state.pointer

    group.current.rotation.y +=
      (x * 0.2 - group.current.rotation.y) * ease

    group.current.rotation.x +=
      (-y * 0.12 - group.current.rotation.x) * ease
  })

  return (
    <group ref={group} scale={0.92}>
      {spheres.map((sphere) => (
        <Float
          key={sphere.color}
          speed={animate ? sphere.speed : 0}
          rotationIntensity={animate ? 0.15 : 0}
          floatIntensity={animate ? 0.35 : 0}
        >
          <mesh position={sphere.position} scale={sphere.scale}>
            <sphereGeometry args={[1, 64, 64]} />

            <meshPhysicalMaterial
              color={sphere.color}
              transparent
              opacity={0.93}
              roughness={0.12}
              metalness={0.05}
              clearcoat={1}
              clearcoatRoughness={0.08}
              iridescence={0.5}
              iridescenceIOR={1.3}
              envMapIntensity={1.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export default function HeroScene() {
  const animate =
    typeof window !== 'undefined' &&
    !window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

  return (
    <Canvas
      camera={{
        position: [0, 0, 6.5],
        fov: 38,
        near: 0.1,
        far: 100,
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
      eventSource={
        typeof document !== 'undefined'
          ? document.getElementById('root') || undefined
          : undefined
      }
      eventPrefix="client"
    >
      <ambientLight intensity={0.55} />

      <directionalLight
        position={[3, 4, 5]}
        intensity={1.1}
      />

      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[0, 4, 3]}
          scale={[8, 3, 1]}
          color="#ffffff"
        />

        <Lightformer
          form="circle"
          intensity={1.5}
          position={[-4, 0, 2]}
          scale={3}
          color="#ffe6dc"
        />

        <Lightformer
          form="circle"
          intensity={1.3}
          position={[4, -1, 2]}
          scale={3}
          color="#e2d9ff"
        />
      </Environment>

      <Spheres animate={animate} />
    </Canvas>
  )
}