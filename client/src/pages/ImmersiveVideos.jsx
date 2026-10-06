import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Atom, BookOpen, Camera, FlaskConical, Globe2, Glasses, HeartPulse, Landmark, Microscope, Orbit, Rotate3D, Sparkles, Video, X } from 'lucide-react'

const COURSE_PATH = '/course/arvr-science-foundations'
const courseLessonPath = experience => `${COURSE_PATH}?lesson=${encodeURIComponent(experience.lessonId)}`

const experiences = [
  {
    id: 'body-vr', lessonId: 'arvr-101-body-vr', type: 'body', title: 'Human Body: VR Anatomy', category: 'Biology / VR',
    description: 'Explore the heart, lungs, brain, bones, muscles, and digestive system in 3D. Rotate and zoom to see how organs work together.',
    videoId: '-FyN5_-njAU', videoTitle: 'What happens inside your body?', channel: 'Life Noggin', format: '360-degree science video', mode: 'vr', Icon: HeartPulse,
  },
  {
    id: 'solar-vr', lessonId: 'arvr-101-solar-vr', type: 'solar', title: 'Solar System: VR Space Exploration', category: 'Astronomy / VR',
    description: 'Travel among the Sun, planets, and moons. Compare planetary order and learn why this visual model compresses real distances.',
    videoId: '6c6k57ZZh9o', videoTitle: 'Explore the solar system', channel: 'Stargaze', format: '360-degree space journey', mode: 'vr', Icon: Orbit,
  },
  {
    id: 'chemistry-vr', lessonId: 'arvr-101-chemistry-vr', type: 'chemistry', title: '3D Chemistry Laboratory', category: 'Chemistry / VR',
    description: 'Build a molecule from atoms, inspect chemical bonds, and visualize how particles rearrange during a basic reaction.',
    videoId: 'YNc97Cp-wGM', videoTitle: 'Molecules: 3D animated explanation', channel: 'Visual Learning', format: '3D chemistry lesson', mode: 'vr', Icon: Atom,
  },
  {
    id: 'physics-vr', lessonId: 'arvr-101-physics-vr', type: 'physics', title: 'Virtual Physics Laboratory', category: 'Physics / VR',
    description: 'Observe forces and motion with a safe virtual experiment. Change your viewing angle and follow how a push changes movement.',
    videoId: 'bzwnWvuyvS0', videoTitle: 'PhET: Forces and Motion introduction', channel: 'WCLN', format: 'Interactive simulation lesson', mode: 'vr', Icon: FlaskConical,
  },
  {
    id: 'body-ar', lessonId: 'arvr-101-classroom-ar', type: 'ar-body', title: 'Human Anatomy: AR Learning', category: 'Biology / AR',
    description: 'Bring a 3D body model into your surroundings. Use a compatible phone or tablet to inspect organ systems from different angles.',
    videoId: '3sIcDgZlgMU', videoTitle: 'Augmented reality in the classroom', channel: 'Google for Education', format: 'AR classroom example', mode: 'ar', Icon: Camera,
  },
  {
    id: 'earth-arvr', lessonId: 'arvr-101-earth-arvr', type: 'earth', title: 'Geography & Earth Science', category: 'Earth Science / AR + VR',
    description: 'Explore a 3D Earth, continents, oceans, mountains, and reef ecosystems. Observe how land and water shape habitats.',
    videoId: 'VVaYEnZUNHI', videoTitle: "Grandpa's Reef - 360", channel: 'National Geographic', format: '360-degree Earth science field trip', mode: 'vr', Icon: Globe2,
  },
  {
    id: 'history-vr', lessonId: 'arvr-101-history-vr', type: 'history', title: 'History: Virtual Historical Exploration', category: 'History / VR',
    description: 'Step into a reconstructed Ancient Rome and examine its streets, monuments, artifacts, and the way people used public spaces.',
    videoId: '-IqkKRscoIc', videoTitle: 'A 3D tour of Ancient Rome', channel: 'Generali Group', format: '360-degree historical tour', mode: 'vr', Icon: Landmark,
  },
  {
    id: 'cell-vr', lessonId: 'arvr-101-cell-vr', type: 'cell', title: 'Biology: 3D Cell Explorer', category: 'Biology / VR',
    description: 'Explore a cell from the inside. Locate the nucleus, mitochondria, membrane, and other structures and connect each part to its role.',
    videoId: 'RrS2uROUjK4', videoTitle: 'Powering the Cell: Mitochondria Animation', channel: 'XVIVO Scientific Animation', format: '3D cell biology animation', mode: 'vr', Icon: Microscope,
  },
]

function ExperienceArtwork({ type }) {
  return (
    <svg viewBox="0 0 360 190" role="img" aria-label="Illustration of the learning model" className="h-full w-full">
      <defs>
        <linearGradient id={`art-bg-${type}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#eef2ff" /><stop offset="1" stopColor="#e0f2fe" /></linearGradient>
        <linearGradient id={`art-object-${type}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#818cf8" /><stop offset="1" stopColor="#06b6d4" /></linearGradient>
        <radialGradient id={`art-glow-${type}`}><stop stopColor="#fff" stopOpacity=".95" /><stop offset="1" stopColor="#c4b5fd" stopOpacity=".15" /></radialGradient>
      </defs>
      <rect width="360" height="190" rx="22" fill={`url(#art-bg-${type})`} />
      <circle cx="185" cy="94" r="70" fill={`url(#art-glow-${type})`} />
      <g fill="none" stroke="#818cf8" strokeOpacity=".35" strokeWidth="1.5"><ellipse cx="180" cy="96" rx="106" ry="31" transform="rotate(-22 180 96)"/><ellipse cx="180" cy="96" rx="104" ry="31" transform="rotate(28 180 96)"/></g>
      {type === 'body' && <g transform="translate(0 2)"><path d="M177 51c-10-19-38-7-27 13l30 34 30-34c11-20-17-32-28-13l-2 4z" fill="#f43f5e"/><path d="M159 91c-17 3-22 20-16 39m57-39c17 3 22 20 16 39m-42-22v39m-20-14 15 28m36-28-15 28" fill="none" stroke="#6366f1" strokeWidth="8" strokeLinecap="round"/><circle cx="180" cy="37" r="14" fill="#fbbf24"/></g>}
      {type === 'solar' && <g><circle cx="180" cy="95" r="21" fill="#f59e0b"/><circle cx="180" cy="95" r="42" fill="none" stroke="#818cf8"/><circle cx="222" cy="95" r="6" fill="#38bdf8"/><circle cx="180" cy="95" r="57" fill="none" stroke="#818cf8"/><circle cx="123" cy="95" r="9" fill="#fb7185"/><circle cx="180" cy="95" r="75" fill="none" stroke="#818cf8"/><circle cx="180" cy="20" r="12" fill="#6366f1"/><circle cx="180" cy="95" r="91" fill="none" stroke="#818cf8" strokeDasharray="3 5"/></g>}
      {type === 'chemistry' && <g stroke="#475569" strokeWidth="7" strokeLinecap="round"><path d="m140 105 46-37 44 34-43 42z"/><circle cx="140" cy="105" r="20" fill="#38bdf8" stroke="white" strokeWidth="3"/><circle cx="186" cy="68" r="22" fill="#fb7185" stroke="white" strokeWidth="3"/><circle cx="230" cy="102" r="17" fill="#a78bfa" stroke="white" strokeWidth="3"/><circle cx="187" cy="144" r="18" fill="#34d399" stroke="white" strokeWidth="3"/></g>}
      {type === 'physics' && <g fill="none" strokeLinecap="round"><path d="M115 135q34-81 68 0t68 0" stroke="#6366f1" strokeWidth="6"/><path d="M123 148h114" stroke="#64748b" strokeWidth="2"/><path d="M180 38v58" stroke="#334155" strokeWidth="3"/><circle cx="180" cy="103" r="15" fill="#f59e0b" stroke="white" strokeWidth="3"/><path d="M133 48h94" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round"/></g>}
      {type === 'ar-body' && <g><circle cx="180" cy="48" r="16" fill="#a5b4fc"/><path d="M156 70q24-12 48 0l10 56q-3 9-12 7l-5-25-2 48h-12l-3-30-4 30h-12l-1-48-8 25q-9 1-12-7z" fill="#818cf8" fillOpacity=".72"/><circle cx="180" cy="91" r="8" fill="#fb7185"/><circle cx="168" cy="99" r="7" fill="#fda4af"/><circle cx="192" cy="99" r="7" fill="#fda4af"/><path d="M127 68h23m60 0h23M126 118h23m62 0h23" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4"/></g>}
      {type === 'earth' && <g><circle cx="180" cy="96" r="57" fill="#38bdf8"/><path d="M141 64q18-22 34-11l8 13-11 10 2 15-19 3-8 18-12-8-9-22zM194 105l14-7 20 6 7 19-20 20-15-9-7-16z" fill="#22c55e"/><path d="M131 135q49 32 98-2" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="3"/></g>}
      {type === 'history' && <g><path d="m119 76 61-34 61 34z" fill="#fbbf24"/><path d="M123 79h114v9H123z" fill="#a78bfa"/><path d="M132 91h13v47h-13zm31 0h13v47h-13zm31 0h13v47h-13zm31 0h13v47h-13z" fill="#f8fafc" stroke="#818cf8" strokeWidth="3"/><path d="M121 141h118v11H121z" fill="#6366f1"/></g>}
      {type === 'cell' && <g><ellipse cx="181" cy="96" rx="68" ry="49" fill="#67e8f9" fillOpacity=".48" stroke="#0891b2" strokeWidth="4"/><circle cx="172" cy="96" r="20" fill="#818cf8"/><circle cx="172" cy="96" r="9" fill="#4f46e5"/><ellipse cx="220" cy="78" rx="13" ry="7" fill="#fb7185"/><ellipse cx="217" cy="114" rx="15" ry="7" fill="#fb7185"/><circle cx="139" cy="100" r="7" fill="#f59e0b"/><circle cx="189" cy="63" r="6" fill="#a78bfa"/><circle cx="200" cy="129" r="5" fill="#34d399"/></g>}
      <circle cx="285" cy="40" r="4" fill="#f59e0b"/><circle cx="72" cy="133" r="3" fill="#06b6d4"/><circle cx="253" cy="152" r="3" fill="#818cf8"/>
    </svg>
  )
}

function Bond({ start, end, color = '#cbd5e1' }) {
  const a = new THREE.Vector3(...start)
  const b = new THREE.Vector3(...end)
  const direction = b.clone().sub(a)
  return <mesh position={a.clone().add(b).multiplyScalar(0.5).toArray()} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())}><cylinderGeometry args={[0.035, 0.035, direction.length(), 16]} /><meshStandardMaterial color={color} /></mesh>
}

function LearningModel({ type, experimentLevel = 50 }) {
  const swingingBob = useRef(null)
  useFrame(({ clock }) => {
    if (type === 'physics' && swingingBob.current) {
      const push = Math.max(0, Math.min(100, experimentLevel)) / 100
      swingingBob.current.rotation.z = Math.sin(clock.elapsedTime * (0.7 + push * 2.4)) * (0.16 + push * 0.68)
    }
  })

  if (type === 'solar') {
    return <group>
      <mesh><sphereGeometry args={[0.48, 40, 40]} /><meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.7} /></mesh>
      {[0.8, 1.2, 1.6, 2.05].map((radius, index) => <group key={radius}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius, 0.008, 8, 120]} /><meshBasicMaterial color="#94a3b8" /></mesh><mesh position={[radius, 0, 0]}><sphereGeometry args={[0.1 + index * 0.035, 24, 24]} /><meshStandardMaterial color={['#60a5fa', '#f97316', '#22c55e', '#a78bfa'][index]} roughness={0.35} /></mesh></group>)}
    </group>
  }

  if (type === 'chemistry') {
    const atoms = [[0, 0.65, 0], [-0.75, 0.15, 0.2], [0.75, 0.15, 0.2], [-0.4, -0.7, -0.1], [0.55, -0.7, -0.15]]
    return <group>{atoms.slice(1).map((point, index) => <Bond key={`bond-${index}`} start={atoms[0]} end={point} />)}{atoms.map((point, index) => <mesh key={`atom-${index}`} position={point}><sphereGeometry args={[index === 0 ? 0.32 : 0.23, 32, 32]} /><meshStandardMaterial color={['#f43f5e', '#60a5fa', '#60a5fa', '#a78bfa', '#34d399'][index]} metalness={0.15} roughness={0.25} /></mesh>)}</group>
  }

  if (type === 'physics') {
    return <group>
      <mesh position={[0, 0.9, 0]}><boxGeometry args={[2.4, 0.09, 0.35]} /><meshStandardMaterial color="#475569" /></mesh>
      {[-0.72, -0.24, 0.24, 0.72].map((x, index) => <group key={x} ref={index === 0 ? swingingBob : undefined} position={[x, 0.88, 0]}><mesh position={[0, -0.42, 0]}><cylinderGeometry args={[0.018, 0.018, 0.86, 12]} /><meshStandardMaterial color="#94a3b8" /></mesh><mesh position={[0, -0.88, 0]}><sphereGeometry args={[0.16, 24, 24]} /><meshStandardMaterial color={index === 0 ? '#f59e0b' : '#64748b'} metalness={0.7} roughness={0.2} /></mesh></group>)}
      <mesh position={[0, -1.45, 0]}><torusGeometry args={[0.75, 0.025, 12, 80]} /><meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} /></mesh>
    </group>
  }

  if (type === 'body' || type === 'ar-body') {
    const opacity = type === 'ar-body' ? 0.32 : 1
    return <group>
      <mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.46, 1.2, 8, 20]} /><meshStandardMaterial color="#93c5fd" transparent opacity={opacity} roughness={0.4} /></mesh>
      <mesh position={[0, 1.05, 0]}><sphereGeometry args={[0.33, 32, 32]} /><meshStandardMaterial color="#fbbf24" transparent opacity={type === 'ar-body' ? 0.4 : 1} /></mesh>
      <mesh position={[0, 0.35, 0.38]} rotation={[0.1, 0, -0.2]}><sphereGeometry args={[0.28, 32, 32]} /><meshStandardMaterial color="#ef4444" emissive="#be123c" emissiveIntensity={0.2} /></mesh>
      <mesh position={[-0.33, 0.5, 0.14]} scale={[0.45, 0.68, 0.55]}><sphereGeometry args={[0.46, 28, 28]} /><meshStandardMaterial color="#fda4af" transparent opacity={0.9} /></mesh>
      <mesh position={[0.33, 0.5, 0.14]} scale={[0.45, 0.68, 0.55]}><sphereGeometry args={[0.46, 28, 28]} /><meshStandardMaterial color="#fda4af" transparent opacity={0.9} /></mesh>
      <mesh position={[0, -0.38, 0.1]}><torusGeometry args={[0.24, 0.07, 16, 48]} /><meshStandardMaterial color="#f59e0b" /></mesh>
      {[-0.75, 0.75].map(x => <mesh key={x} position={[x, 0.18, 0]} rotation={[0, 0, x * 0.18]}><capsuleGeometry args={[0.12, 0.78, 6, 12]} /><meshStandardMaterial color="#818cf8" transparent opacity={opacity} /></mesh>)}
    </group>
  }

  if (type === 'earth') {
    return <group rotation={[0.25, -0.3, 0]}>
      <mesh><sphereGeometry args={[1.15, 64, 64]} /><meshStandardMaterial color="#38bdf8" roughness={0.7} /></mesh>
      {[[-0.5, 0.4, 0.92], [0.35, 0.6, 0.92], [0.05, -0.45, 0.98], [0.72, -0.15, 0.77], [-0.82, -0.1, 0.6]].map(([x, y, z], index) => <mesh key={index} position={[x, y, z]} scale={[0.34, 0.22, 0.09]}><sphereGeometry args={[1, 24, 24]} /><meshStandardMaterial color="#22c55e" /></mesh>)}
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.24, 0.015, 8, 100]} /><meshBasicMaterial color="#a5f3fc" /></mesh>
    </group>
  }

  if (type === 'history') {
    return <group position={[0, -0.65, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[2.2, 0.24, 1.2]} /><meshStandardMaterial color="#d6a96c" /></mesh>
      {[-0.78, -0.26, 0.26, 0.78].map(x => <mesh key={x} position={[x, 0.68, 0]}><cylinderGeometry args={[0.11, 0.15, 1.1, 20]} /><meshStandardMaterial color="#f1e6d2" /></mesh>)}
      <mesh position={[0, 1.3, 0]}><boxGeometry args={[2.25, 0.15, 1.35]} /><meshStandardMaterial color="#f8fafc" /></mesh>
      <mesh position={[0, 1.52, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.45, 0.55, 4]} /><meshStandardMaterial color="#c4b5fd" /></mesh>
    </group>
  }

  if (type === 'cell') {
    return <group>
      <mesh scale={[1.3, 0.92, 0.9]}><sphereGeometry args={[1, 48, 48]} /><meshStandardMaterial color="#67e8f9" transparent opacity={0.28} roughness={0.2} /></mesh>
      <mesh position={[-0.15, 0.12, 0.35]}><sphereGeometry args={[0.42, 32, 32]} /><meshStandardMaterial color="#818cf8" /></mesh>
      <mesh position={[-0.15, 0.12, 0.35]}><sphereGeometry args={[0.19, 32, 32]} /><meshStandardMaterial color="#4f46e5" /></mesh>
      {[[-0.75, 0.38, 0.15], [0.55, 0.56, 0.12], [0.66, -0.35, 0.2], [-0.62, -0.42, 0.28]].map((point, index) => <group key={index} position={point}><mesh scale={[0.34, 0.17, 0.18]}><sphereGeometry args={[1, 24, 24]} /><meshStandardMaterial color="#fb7185" /></mesh><mesh scale={[0.25, 0.1, 0.1]}><torusGeometry args={[0.6, 0.04, 8, 32]} /><meshStandardMaterial color="#fecdd3" /></mesh></group>)}
      {[[0.22, 0.08, 0.7], [-0.35, 0.58, 0.28], [0.18, -0.5, 0.35]].map((point, index) => <mesh key={`vesicle-${index}`} position={point}><sphereGeometry args={[0.1, 18, 18]} /><meshStandardMaterial color="#fbbf24" /></mesh>)}
    </group>
  }

  return <group><mesh><sphereGeometry args={[0.7, 32, 32]} /><meshStandardMaterial color="#a78bfa" /></mesh><mesh position={[0.8, 0.4, 0]}><sphereGeometry args={[0.22, 20, 20]} /><meshStandardMaterial color="#22d3ee" /></mesh></group>
}

function ExperienceModal({ experience, onClose }) {
  const [renderer, setRenderer] = useState(null)
  const [message, setMessage] = useState('')
  const [xrActive, setXrActive] = useState(false)
  const [experimentLevel, setExperimentLevel] = useState(50)
  const sessionRef = useRef(null)
  const Icon = experience.Icon

  useEffect(() => {
    const onKeyDown = event => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (sessionRef.current) void sessionRef.current.end()
    }
  }, [onClose])

  const startImmersive = async mode => {
    if (!navigator.xr || !renderer) {
      setMessage(mode === 'immersive-ar'
        ? 'AR camera mode needs a supported phone or tablet browser. You can still rotate and zoom the 3D model here.'
        : 'VR mode needs a WebXR-compatible browser and headset. You can still rotate and zoom the 3D model here.')
      return
    }
    try {
      const supported = await navigator.xr.isSessionSupported(mode)
      if (!supported) throw new Error('unsupported')
      renderer.xr.enabled = true
      renderer.xr.setReferenceSpaceType('local-floor')
      renderer.setClearColor(mode === 'immersive-ar' ? '#000000' : '#081226', mode === 'immersive-ar' ? 0 : 1)
      const session = await navigator.xr.requestSession(mode, { optionalFeatures: mode === 'immersive-ar' ? ['local-floor', 'hit-test'] : ['local-floor', 'bounded-floor'] })
      sessionRef.current = session
      session.addEventListener('end', () => {
        sessionRef.current = null
        setXrActive(false)
        setMessage('')
        renderer.setClearColor('#081226', 1)
      }, { once: true })
      await renderer.xr.setSession(session)
      setXrActive(true)
      setMessage(mode === 'immersive-ar' ? 'AR camera view is on. Move your device to inspect the model.' : 'VR view is on. Look around the learning model.')
    } catch {
      renderer.setClearColor('#081226', 1)
      setMessage('Immersive mode could not start on this device. The interactive 3D model is ready to explore below.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm md:p-6" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" aria-labelledby="experience-title" className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 md:p-7">
          <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Icon size={23} /></span><div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-700">Interactive 3D learning model</p><h2 id="experience-title" className="text-xl font-bold text-slate-900 md:text-2xl">{experience.title}</h2><p className="mt-1 text-sm text-slate-500">Drag to rotate, scroll or pinch to zoom.</p></div></div>
          <button type="button" aria-label="Close model" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><X size={21} /></button>
        </header>
        <div className="grid lg:grid-cols-[1.4fr_0.8fr]">
          <div className="relative min-h-[350px] bg-[#081226] md:min-h-[500px]" style={{ background: xrActive && experience.mode === 'ar' ? 'transparent' : '#081226' }}>
            <Canvas camera={{ position: [0, 0.3, 4.8], fov: 43 }} onCreated={({ gl }) => { gl.setClearColor('#081226', 1); setRenderer(gl) }}>
              <ambientLight intensity={1.45} /><directionalLight position={[4, 5, 5]} intensity={2.4} /><pointLight position={[-4, 1, 2]} color="#818cf8" intensity={8} />
              <LearningModel type={experience.type} experimentLevel={experimentLevel} />
              <OrbitControls makeDefault enableDamping minDistance={2.4} maxDistance={8} />
            </Canvas>
            <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-white"><Rotate3D size={15} /> Move around the model</div>
          </div>
          <aside className="space-y-5 p-5 md:p-7">
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">{experience.category}</span>
            <p className="text-sm leading-6 text-slate-600">{experience.description}</p>
            <div className="rounded-2xl bg-slate-50 p-4"><h3 className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><Sparkles size={17} className="text-amber-500" /> Look for</h3><p className="text-sm leading-6 text-slate-600">Rotate and zoom the model. Identify its main parts, then explain how their positions or connections help you understand the concept.</p></div>
            {experience.type === 'physics' && <div className="rounded-2xl border border-indigo-100 p-4"><div className="mb-2 flex items-center justify-between"><label htmlFor="virtual-force" className="text-sm font-semibold text-slate-900">Virtual push</label><span className="text-xs font-semibold text-indigo-700">{experimentLevel}%</span></div><input id="virtual-force" type="range" min="0" max="100" value={experimentLevel} onChange={event => setExperimentLevel(Number(event.target.value))} className="w-full accent-indigo-700"/><p className="mt-2 text-xs leading-5 text-slate-500">Increase the applied push and observe the pendulum swing more widely and quickly.</p></div>}
            <div className="space-y-2">
              <button type="button" onClick={() => startImmersive(experience.mode === 'ar' ? 'immersive-ar' : 'immersive-vr')} disabled={xrActive} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-60">{experience.mode === 'ar' ? <Camera size={18} /> : <Glasses size={18} />}{experience.mode === 'ar' ? 'View in AR' : 'Explore in VR'}</button>
              <Link to={courseLessonPath(experience)} onClick={onClose} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><BookOpen size={17} /> Watch lesson, read notes &amp; take MCQ</Link>
            </div>
            {message && <p role="status" className="rounded-xl bg-cyan-50 px-3 py-2 text-xs leading-5 text-cyan-900">{message}</p>}
          </aside>
        </div>
      </section>
    </div>
  )
}

function ExperienceCard({ experience, onExplore }) {
  const Icon = experience.Icon
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden"><ExperienceArtwork type={experience.type} /><span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-bold text-indigo-800 shadow-sm"><Icon size={14} /> {experience.mode === 'ar' ? 'AR model' : 'VR model'}</span></div>
      <div className="p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">{experience.category}</p>
        <h2 className="mb-2 text-lg font-bold leading-snug text-slate-900">{experience.title}</h2>
        <p className="mb-4 min-h-[72px] text-sm leading-6 text-slate-600">{experience.description}</p>
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500"><Video size={15} className="shrink-0 text-indigo-700" /><span className="truncate">Video lesson: {experience.videoTitle}</span></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onExplore(experience)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800">{experience.mode === 'ar' ? 'View in AR' : 'Explore in VR'} <Rotate3D size={16} /></button>
          <Link to={courseLessonPath(experience)} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700">Course <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </article>
  )
}

export default function ImmersiveVideos() {
  const [selectedExperience, setSelectedExperience] = useState(null)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 text-white">
        <div className="container-custom py-12 md:py-16">
          <Link to="/courses" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"><ArrowLeft size={16} /> Courses</Link>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl"><p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200"><Glasses size={18} /> Interactive learning library</p><h1 className="mb-4 text-3xl font-bold md:text-5xl">Learn Beyond the Classroom with AR &amp; VR</h1><p className="text-base leading-7 text-white/80 md:text-lg">Explore, interact, and understand complex concepts through immersive 3D learning experiences.</p></div>
            <div className="flex items-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium md:self-auto"><Video size={18} /> {experiences.length} academic experiences</div>
          </div>
        </div>
      </section>
      <section className="container-custom py-8 md:py-12">
        <div className="mb-8 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm md:flex md:items-center md:justify-between md:gap-6 md:p-6"><div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-700">Virtual interactive classroom</p><h2 className="text-xl font-bold text-slate-900">Students do more than read about a concept</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">They can see it, explore it, and interact with it in AR/VR. Open a 3D model below, then continue to its video, study notes, and knowledge check in the course.</p></div><Link to={COURSE_PATH} className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-800 md:mt-0"><BookOpen size={17} /> Open all lesson materials</Link></div>
        <div className="mb-5"><p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-700">Explore by subject</p><h2 className="text-2xl font-bold text-slate-900">Academic concepts you can see in 3D</h2></div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{experiences.map(experience => <ExperienceCard key={experience.id} experience={experience} onExplore={setSelectedExperience} />)}</div>
        <p className="mt-7 text-xs leading-5 text-slate-500">Some immersive modes require a WebXR-capable browser, a compatible headset, or an AR-capable mobile device. The 3D model and course materials can still be explored on a regular screen. Video lessons are hosted by their educational YouTube channels.</p>
      </section>
      {selectedExperience && <ExperienceModal experience={selectedExperience} onClose={() => setSelectedExperience(null)} />}
    </main>
  )
}
