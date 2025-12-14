import { Suspense, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { FlaskConical, Zap, Flame, Gem, Play, RotateCcw, Glasses, Lightbulb, CheckCircle, X } from 'lucide-react'

function Beaker({ position, color = 'blue', liquid = 0.5 }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.25, 1, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0}
          metalness={0}
          transmission={0.9}
        />
      </mesh>
      <mesh position={[0, -0.5 + liquid * 0.5, 0]}>
        <cylinderGeometry args={[0.28, 0.23, liquid, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

function Molecule({ position, type = 'water' }) {
  const colors = type === 'water' ? ['red', 'white', 'white'] : ['gray', 'white', 'white', 'white']
  
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={colors[0]} />
      </mesh>
      {colors.slice(1).map((color, i) => (
        <mesh key={i} position={[(i - 0.5) * 0.2, 0.15, 0]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

function LabTable() {
  return (
    <mesh position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[4, 0.1, 2]} />
      <meshStandardMaterial color="#5c4033" />
    </mesh>
  )
}

function Lab() {
  const { id } = useParams()
  const [selectedExperiment, setSelectedExperiment] = useState('acid-base')
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState(null)

  const experiments = [
    { id: 'acid-base', name: 'Acid-Base Titration', icon: FlaskConical, difficulty: 'Beginner', color: 'text-accent-cyan' },
    { id: 'electrolysis', name: 'Water Electrolysis', icon: Zap, difficulty: 'Intermediate', color: 'text-accent-yellow' },
    { id: 'combustion', name: 'Combustion Reactions', icon: Flame, difficulty: 'Advanced', color: 'text-accent-orange' },
    { id: 'crystal', name: 'Crystal Growing', icon: Gem, difficulty: 'Beginner', color: 'text-accent-pink' },
  ]

  const runExperiment = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setResults({
        success: true,
        observation: 'The solution changed from colorless to pink, indicating the endpoint of titration.',
        pH: 7.0,
      })
    }, 3000)
  }

  return (
    <div className="h-screen bg-gray-900 flex">
      <div className="w-72 bg-gray-800 text-white flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FlaskConical size={20} />
            </div>
            <div>
              <h1 className="font-bold">Virtual Lab</h1>
              <p className="text-xs text-gray-400">Chemistry Experiments</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Available Experiments
          </h2>
          <div className="space-y-2">
            {experiments.map((exp) => {
              const Icon = exp.icon
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExperiment(exp.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedExperiment === exp.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedExperiment === exp.id ? 'bg-white/20' : 'bg-gray-600'}`}>
                      <Icon size={20} className={selectedExperiment === exp.id ? 'text-white' : exp.color} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{exp.name}</p>
                      <p className="text-xs text-gray-400">{exp.difficulty}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 space-y-3">
          <button
            onClick={runExperiment}
            disabled={isRunning}
            className="w-full py-3 bg-accent-cyan hover:bg-accent-cyan/90 disabled:bg-gray-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Running...
              </>
            ) : (
              <>
                <Play size={18} />
                Run Experiment
              </>
            )}
          </button>
          <button className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm flex items-center justify-center gap-2">
            <RotateCcw size={16} />
            Reset Lab
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [3, 2, 3], fov: 50 }}
          shadows
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} />
            
            <LabTable />
            
            <Beaker position={[-1, 0, 0]} color="#ff6b6b" liquid={0.6} />
            <Beaker position={[0, 0, 0]} color="#4ecdc4" liquid={0.8} />
            <Beaker position={[1, 0, 0]} color="#ffe66d" liquid={0.4} />
            
            <Molecule position={[0, 1, 0]} type="water" />
            
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              minDistance={2}
              maxDistance={10}
            />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>

        <button className="absolute top-4 right-4 px-5 py-2.5 bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-primary-dark transition-colors font-medium">
          <Glasses size={18} />
          Enter VR Mode
        </button>

        {results && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-5 shadow-xl max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={24} className="text-accent-cyan" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">Experiment Complete!</h3>
                <p className="text-sm text-text-secondary mt-1">{results.observation}</p>
                <div className="flex gap-3 mt-3">
                  <span className="px-3 py-1.5 bg-surface-light rounded-lg text-sm font-medium">pH: {results.pH}</span>
                </div>
              </div>
              <button 
                onClick={() => setResults(null)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {isRunning && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FlaskConical size={32} className="text-primary animate-pulse" />
              </div>
              <p className="font-semibold text-text-primary">Running experiment...</p>
              <p className="text-sm text-text-muted mt-1">Please wait</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-80 bg-white flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-lg text-text-primary">Instructions</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {[
              'Select an experiment from the sidebar',
              'Use your mouse to rotate and zoom the 3D view',
              'Click on equipment to interact with it',
              'Click "Run Experiment" to see the results',
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-text-secondary pt-1">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-accent-cyan/10 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={18} className="text-accent-cyan" />
              <h3 className="font-semibold text-text-primary">Pro Tip</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Use VR mode for an immersive experience. Works with any WebXR-compatible headset!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lab
