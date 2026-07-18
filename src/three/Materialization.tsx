import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const COUNT = 800
const dummy = new THREE.Object3D()

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function Particles({ durationMs }: { durationMs: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const start = useRef<number | null>(null)

  // scattered start + grid target for each particle (deterministic — no Math.random at module init)
  const { scatter, target } = useMemo(() => {
    const scatter = new Float32Array(COUNT * 3)
    const target = new Float32Array(COUNT * 3)
    const cols = Math.ceil(Math.sqrt(COUNT))
    for (let i = 0; i < COUNT; i++) {
      const a = i * 12.9898
      const r = (Math.sin(a) * 43758.5453) % 1
      const r2 = (Math.sin(a * 1.7) * 12543.13) % 1
      const r3 = (Math.sin(a * 2.3) * 98765.43) % 1
      scatter[i * 3] = (r - 0.5) * 14
      scatter[i * 3 + 1] = (r2 - 0.5) * 14
      scatter[i * 3 + 2] = (r3 - 0.5) * 8
      const gx = (i % cols) - cols / 2
      const gy = Math.floor(i / cols) - cols / 2
      target[i * 3] = gx * 0.28
      target[i * 3 + 1] = gy * 0.28
      target[i * 3 + 2] = 0
    }
    return { scatter, target }
  }, [])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    if (start.current === null) start.current = state.clock.elapsedTime
    const t = Math.min((state.clock.elapsedTime - start.current) / (durationMs / 1000), 1)
    const ease = 1 - Math.pow(1 - t, 3) // easeOutCubic
    for (let i = 0; i < COUNT; i++) {
      dummy.position.set(
        THREE.MathUtils.lerp(scatter[i * 3], target[i * 3], ease),
        THREE.MathUtils.lerp(scatter[i * 3 + 1], target[i * 3 + 1], ease),
        THREE.MathUtils.lerp(scatter[i * 3 + 2], target[i * 3 + 2], ease),
      )
      const s = 0.04 + 0.03 * (1 - ease)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6EE7F9" emissive="#A78BFA" emissiveIntensity={2} toneMapped={false} />
    </instancedMesh>
  )
}

export function Materialization({
  onComplete,
  durationMs = 2500,
}: {
  imageUrl?: string
  onComplete: () => void
  durationMs?: number
}) {
  const reduced = prefersReducedMotion()

  useEffect(() => {
    const id = setTimeout(onComplete, durationMs)
    return () => clearTimeout(id)
  }, [onComplete, durationMs])

  if (reduced) {
    return (
      <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center animate-pulse">
        <span className="font-display text-accent text-lg">Forging your app…</span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={2} />
        <Particles durationMs={durationMs} />
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.1} mipmapBlur />
        </EffectComposer>
      </Canvas>
      <div className="absolute inset-x-0 bottom-16 text-center font-display text-accent/80 tracking-wide">
        Forging your app…
      </div>
    </div>
  )
}
