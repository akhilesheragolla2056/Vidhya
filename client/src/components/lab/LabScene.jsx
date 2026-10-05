import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'

function Beaker({ position, color, liquid = 0.6 }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.25, 1, 32, 1, true]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.25} roughness={0.05} transmission={0.85} />
      </mesh>
      <mesh position={[0, -0.5 + liquid * 0.5, 0]}>
        <cylinderGeometry args={[0.28, 0.23, liquid, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.82} />
      </mesh>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.025, 8, 32]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.25} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Pendulum({ length = 1 }) {
  const swing = useRef()
  useFrame(({ clock }) => {
    if (!swing.current) return
    const period = 2 * Math.PI * Math.sqrt(length / 9.81)
    swing.current.rotation.z = Math.sin((clock.elapsedTime * 2 * Math.PI) / period) * 0.45
  })
  return (
    <group ref={swing} position={[0, 1.5, 0]}>
      <mesh position={[0, -length / 2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, length, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
      </mesh>
      <mesh position={[0, -length, 0]} castShadow>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 24]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  )
}

function CellModel({ stage }) {
  const chromosomeColors = ['#f43f5e', '#fb7185', '#fda4af']
  return (
    <group position={[0, 0.25, 0]} rotation={[0.15, 0.2, 0]}>
      <mesh scale={[1.35, 0.8, 0.9]}>
        <sphereGeometry args={[0.75, 40, 32]} />
        <meshPhysicalMaterial color="#bfdbfe" transparent opacity={0.26} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
      {chromosomeColors.map((color, index) => (
        <mesh
          key={color}
          position={[
            stage === 'anaphase' ? (index - 1) * 0.38 : (index - 1) * 0.12,
            stage === 'metaphase' ? (index - 1) * 0.12 : 0.04,
            (index % 2) * 0.12,
          ]}
          rotation={[0, 0, Math.PI / 4]}
        >
          <capsuleGeometry args={[0.045, 0.28, 6, 10]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {['#22c55e', '#86efac'].map((color, index) => (
        <mesh key={color} position={[index ? 0.62 : -0.62, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.07, 0.28, 8, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

function PlantModel({ lightPercent = 50 }) {
  const leaves = useRef()
  useFrame(({ clock }) => {
    if (leaves.current) leaves.current.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.04
  })
  const scale = 0.65 + lightPercent / 250
  return (
    <group ref={leaves} position={[0, -0.4, 0]}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.045, 0.07, 1.2, 16]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      <mesh position={[-0.3, 0.7, 0]} rotation={[0, 0, 0.55]} scale={scale}>
        <sphereGeometry args={[0.3, 24, 16]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      <mesh position={[0.3, 1.05, 0]} rotation={[0, 0, -0.55]} scale={scale}>
        <sphereGeometry args={[0.3, 24, 16]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[0, 1.35, 0]} scale={scale * 0.85}>
        <sphereGeometry args={[0.24, 24, 16]} />
        <meshStandardMaterial color="#86efac" />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.45, 0.52, 0.24, 32]} />
        <meshStandardMaterial color="#7c4a2d" />
      </mesh>
    </group>
  )
}

function BubblingSolution({ intensity = 1 }) {
  const bubbles = useRef([])
  useFrame(({ clock }) => {
    bubbles.current.forEach((bubble, index) => {
      if (!bubble) return
      bubble.position.y = -0.2 + ((clock.elapsedTime * (0.18 + intensity * 0.16) + index * 0.23) % 0.9)
      bubble.position.x = Math.sin(clock.elapsedTime + index) * 0.11
    })
  })
  return (
    <>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} ref={element => { bubbles.current[index] = element }} position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.035 + (index % 3) * 0.008, 16, 16]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.8} />
        </mesh>
      ))}
    </>
  )
}

function ChemistryModel({ experimentId, parameters }) {
  if (experimentId === 'acid-base') {
    const baseMl = Number(parameters.baseMl) || 0
    const phColor = `hsl(${Math.max(0, Math.min(130, 8 + baseMl * 2.4))}, 78%, 54%)`
    return <Beaker position={[0, 0, 0]} color={phColor} liquid={Math.min(0.78, 0.38 + baseMl / 125)} />
  }
  if (experimentId === 'electrolysis') {
    const current = (Number(parameters.voltage) || 0) / (Number(parameters.resistance) || 1)
    return <><Beaker position={[0, 0, 0]} color="#38bdf8" liquid={0.68} /><BubblingSolution intensity={current} /></>
  }
  if (experimentId === 'combustion') {
    const oxygen = Number(parameters.oxygenPercent) || 0
    const color = oxygen >= 40 ? '#fb923c' : '#94a3b8'
    return <>
      <mesh position={[0, -0.08, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.42, 1.25, 32]} />
        <meshStandardMaterial color={color} emissive={oxygen >= 40 ? '#ea580c' : '#475569'} emissiveIntensity={0.7} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, -0.65, 0]}><cylinderGeometry args={[0.36, 0.4, 0.2, 32]} /><meshStandardMaterial color="#334155" /></mesh>
    </>
  }
  if (experimentId === 'crystal') {
    const saturation = Number(parameters.concentration) || 1
    const temperature = Number(parameters.temperatureC) || 10
    const scale = 0.35 + Math.max(0.1, (saturation - (100 - temperature * 0.55)) / 55)
    return <>
      <Beaker position={[0, -0.12, 0]} color="#a78bfa" liquid={0.56} />
      <mesh position={[0, -0.15, 0]} scale={scale} rotation={[0.2, 0.45, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial color="#c4b5fd" metalness={0.2} roughness={0.1} transmission={0.2} />
      </mesh>
    </>
  }
  return <><Beaker position={[-0.6, 0, 0]} color="#38bdf8" /><Beaker position={[0.6, 0, 0]} color="#f472b6" /></>
}

function PhysicsModel({ experimentId, parameters }) {
  if (experimentId === 'pendulum') return <Pendulum length={Number(parameters.lengthM) || 1} />
  if (experimentId === 'optics') {
    const angle = ((Number(parameters.incidenceDeg) || 30) * Math.PI) / 180
    const refracted = Math.asin(Math.sin(angle) / (Number(parameters.refractiveIndex) || 1.5))
    return <>
      <mesh position={[0, -0.35, 0]} rotation={[0, 0, 0]}><boxGeometry args={[2.7, 0.45, 1.3]} /><meshStandardMaterial color="#bae6fd" transparent opacity={0.55} /></mesh>
      <mesh position={[-0.7, 0.4, 0]} rotation={[0, 0, -angle]}><cylinderGeometry args={[0.035, 0.035, 1.6, 12]} /><meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.7} /></mesh>
      <mesh position={[0.55, -0.15, 0]} rotation={[0, 0, -refracted]}><cylinderGeometry args={[0.035, 0.035, 1.5, 12]} /><meshStandardMaterial color="#fb7185" emissive="#e11d48" emissiveIntensity={0.6} /></mesh>
    </>
  }
  return <><mesh rotation={[0.4, 0.5, 0]}><dodecahedronGeometry args={[0.8, 1]} /><meshStandardMaterial color="#60a5fa" roughness={0.4} wireframe /></mesh></>
}

function LabTable() {
  return <mesh position={[0, -0.5, 0]} receiveShadow><boxGeometry args={[4, 0.1, 2]} /><meshStandardMaterial color="#5c4033" /></mesh>
}

export default function LabScene({ subject = 'chemistry', experimentId, parameters = {} }) {
  return (
    <Canvas camera={{ position: [3, 2, 3], fov: 50 }} shadows>
      <color attach="background" args={['#e6f0ff']} />
      <Suspense fallback={null}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        <LabTable />
        {subject === 'chemistry' && <ChemistryModel experimentId={experimentId} parameters={parameters} />}
        {subject === 'physics' && <PhysicsModel experimentId={experimentId} parameters={parameters} />}
        {subject === 'biology' && (experimentId === 'cell-division'
          ? <CellModel stage={parameters.stage || 'prophase'} />
          : <PlantModel lightPercent={Number(parameters.lightPercent) || 50} />)}
        <OrbitControls enablePan enableZoom minDistance={2} maxDistance={10} />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}
