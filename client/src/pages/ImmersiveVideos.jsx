import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Atom, BookOpen, Camera, FlaskConical, Globe2, Glasses, HeartPulse, Landmark, Microscope, Orbit, Rotate3D, Sparkles, Video, X } from 'lucide-react'
import LearningModel from '../components/immersive/LearningModels'
import ExperienceArtwork from '../components/immersive/ExperienceArtwork'

const COURSE_PATH = '/course/arvr-science-foundations'
const courseLessonPath = experience => `${COURSE_PATH}?lesson=${encodeURIComponent(experience.lessonId)}`

const experiences = [
  {
    id: 'body-vr', lessonId: 'arvr-101-body-vr', type: 'body', title: 'Human Body: VR Anatomy', category: 'Biology / VR',
    description: 'Inspect the brain, rib cage, trachea, lobed lungs, heart, liver, stomach, and intestinal tract in a translucent torso.',
    videoId: '-FyN5_-njAU', videoTitle: 'What happens inside your body?', channel: 'Life Noggin', format: '360-degree science video', mode: 'vr', Icon: HeartPulse,
  },
  {
    id: 'solar-vr', lessonId: 'arvr-101-solar-vr', type: 'solar', title: 'Solar System: VR Space Exploration', category: 'Astronomy / VR',
    description: 'Travel among the Sun, planets, and moons. Compare planetary order and learn why this visual model compresses real distances.',
    videoId: '6c6k57ZZh9o', videoTitle: 'Explore the solar system', channel: 'Stargaze', format: '360-degree space journey', mode: 'vr', Icon: Orbit,
  },
  {
    id: 'chemistry-vr', lessonId: 'arvr-101-chemistry-vr', type: 'chemistry', title: '3D Chemistry Laboratory', category: 'Chemistry / VR',
    description: 'Inspect a water molecule’s two O–H bonds, approximate 104.5° bond angle, and bent molecular shape.',
    videoId: 'YNc97Cp-wGM', videoTitle: 'Molecules: 3D animated explanation', channel: 'Visual Learning', format: '3D chemistry lesson', mode: 'vr', Icon: Atom,
  },
  {
    id: 'physics-vr', lessonId: 'arvr-101-physics-vr', type: 'physics', title: 'Virtual Physics Laboratory', category: 'Physics / VR',
    description: 'Explore a pendulum apparatus and see how its release angle changes the swing amplitude.',
    videoId: 'bzwnWvuyvS0', videoTitle: 'PhET: Forces and Motion introduction', channel: 'WCLN', format: 'Interactive simulation lesson', mode: 'vr', Icon: FlaskConical,
  },
  {
    id: 'body-ar', lessonId: 'arvr-101-classroom-ar', type: 'ar-body', title: 'Human Anatomy: AR Learning', category: 'Biology / AR',
    description: 'Place a translucent anatomical cutaway in your surroundings and inspect the brain, lungs, heart, and digestive organs from different angles.',
    videoId: '3sIcDgZlgMU', videoTitle: 'Augmented reality in the classroom', channel: 'Google for Education', format: 'AR classroom example', mode: 'ar', Icon: Camera,
  },
  {
    id: 'earth-arvr', lessonId: 'arvr-101-earth-arvr', type: 'earth', title: 'Geography & Earth Science', category: 'Earth Science / AR + VR',
    description: 'Explore a 3D Earth, continents, oceans, mountains, and reef ecosystems. Observe how land and water shape habitats.',
    videoId: 'VVaYEnZUNHI', videoTitle: "Grandpa's Reef - 360", channel: 'National Geographic', format: '360-degree Earth science field trip', mode: 'vr', Icon: Globe2,
  },
  {
    id: 'history-vr', lessonId: 'arvr-101-history-vr', type: 'history', title: 'History: Virtual Historical Exploration', category: 'History / VR',
    description: 'Inspect an educational reconstruction of the Colosseum’s elliptical arena, arcades, and seating tiers.',
    videoId: '-IqkKRscoIc', videoTitle: 'A 3D tour of Ancient Rome', channel: 'Generali Group', format: '360-degree historical tour', mode: 'vr', Icon: Landmark,
  },
  {
    id: 'cell-vr', lessonId: 'arvr-101-cell-vr', type: 'cell', title: 'Biology: 3D Cell Explorer', category: 'Biology / VR',
    description: 'Explore a cell from the inside. Locate the nucleus, mitochondria, membrane, and other structures and connect each part to its role.',
    videoId: 'RrS2uROUjK4', videoTitle: 'Powering the Cell: Mitochondria Animation', channel: 'XVIVO Scientific Animation', format: '3D cell biology animation', mode: 'vr', Icon: Microscope,
  },
]

const modelGuidance = {
  body: 'Follow the trachea into the main bronchi. The anatomical right lung has three lobes; the left has two and a cardiac notch. The ribs surround both lungs, with the heart between them and slightly left of center.',
  'ar-body': 'Follow the trachea into the main bronchi. Compare the three lobes of the anatomical right lung with the two lobes and cardiac notch of the left lung. The heart sits between the lungs.',
  solar: 'Compare the orbits shown. Planet sizes and distances are compressed so the system can fit in view.',
  chemistry: 'Oxygen is the larger red atom; the two smaller pale atoms are hydrogen. The bent H–O–H angle is about 104.5° in a water molecule.',
  physics: 'The bob swings around a fixed pivot. A larger release angle creates a wider arc; the swing rate is kept approximately constant for this small-angle model.',
  earth: 'Compare the major continents, ocean basins, and broad mountain belts. Coastlines and terrain are simplified for this educational globe.',
  history: 'Notice the elliptical arena, repeated exterior arches, stacked levels, and rising seating. This is a simplified reconstruction, not a measured archaeological model.',
  cell: 'Locate the nucleus and nucleolus, folded endoplasmic reticulum, Golgi stacks, mitochondria with inner folds, vesicles, ribosomes, and the cell membrane.',
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
            <div className="rounded-2xl bg-slate-50 p-4"><h3 className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><Sparkles size={17} className="text-amber-500" /> Look for</h3><p className="text-sm leading-6 text-slate-600">{modelGuidance[experience.type] || 'Rotate and zoom the model. Identify its main parts and explain how their positions or connections help you understand the concept.'}</p></div>
            {experience.type === 'physics' && <div className="rounded-2xl border border-indigo-100 p-4"><div className="mb-2 flex items-center justify-between"><label htmlFor="pendulum-angle" className="text-sm font-semibold text-slate-900">Release angle</label><span className="text-xs font-semibold text-indigo-700">{Math.round(2 + experimentLevel * 0.24)}°</span></div><input id="pendulum-angle" type="range" min="0" max="100" value={experimentLevel} onChange={event => setExperimentLevel(Number(event.target.value))} className="w-full accent-indigo-700"/><p className="mt-2 text-xs leading-5 text-slate-500">Choose the angle from which the pendulum is released. A larger angle gives a wider swing.</p></div>}
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
