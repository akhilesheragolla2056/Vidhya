import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PlayCircle, PauseCircle, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Load A-Frame once for AR/VR experiments
function useAFrame() {
  useEffect(() => {
    if (!window.AFRAME) {
      const script = document.createElement('script')
      script.src = 'https://aframe.io/releases/1.5.0/aframe.min.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])
}

function AnatomyVR() {
  useAFrame()
  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <div className="aspect-video">
        <a-scene embedded vr-mode-ui="enabled: true">
          <a-entity position="0 1.6 0">
            <a-entity camera look-controls wasd-controls></a-entity>
          </a-entity>
          {/* Torso */}
          <a-box position="0 1 -3" depth="0.5" height="1.8" width="0.8" color="#DDD"></a-box>
          {/* Heart */}
          <a-sphere position="0 1.2 -2.5" radius="0.2" color="#e11d48"></a-sphere>
          {/* Lungs */}
          <a-sphere position="-0.3 1.2 -2.5" radius="0.25" color="#60a5fa"></a-sphere>
          <a-sphere position="0.3 1.2 -2.5" radius="0.25" color="#60a5fa"></a-sphere>
          <a-plane rotation="-90 0 0" width="10" height="10" color="#f0f0f0"></a-plane>
        </a-scene>
      </div>
    </div>
  )
}

function CirculationVR() {
  useAFrame()
  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <div className="aspect-video">
        <a-scene embedded>
          <a-entity position="0 1.6 0">
            <a-entity camera look-controls wasd-controls></a-entity>
          </a-entity>
          <a-torus position="0 1 -3" radius="1" radius-tubular="0.05" color="#ef4444"></a-torus>
          <a-sphere position="1 1 -3" radius="0.08" color="#b91c1c"></a-sphere>
          <a-plane rotation="-90 0 0" width="10" height="10" color="#f0f0f0"></a-plane>
        </a-scene>
      </div>
    </div>
  )
}

function RespirationVR() {
  useAFrame()
  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <div className="aspect-video">
        <a-scene embedded>
          <a-entity position="0 1.6 0">
            <a-entity camera look-controls wasd-controls></a-entity>
          </a-entity>
          <a-sphere position="-0.4 1 -3" radius="0.3" color="#60a5fa"></a-sphere>
          <a-sphere position="0.4 1 -3" radius="0.3" color="#60a5fa"></a-sphere>
          <a-plane rotation="-90 0 0" width="10" height="10" color="#f0f0f0"></a-plane>
        </a-scene>
      </div>
    </div>
  )
}

// Ohm's Law Simulation Component
function OhmsLawSimulation() {
  const [voltage, setVoltage] = useState(3)
  const [resistance, setResistance] = useState(10)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Draw circuit diagram
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2

    // Battery
    ctx.fillStyle = '#ff6b6b'
    ctx.fillRect(50, height / 2 - 30, 40, 60)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('V', 70, height / 2 + 5)

    // Resistor (zigzag)
    ctx.strokeStyle = '#3B5BDB'
    ctx.lineWidth = 3
    const resistorX = 200
    const resistorY = height / 2
    ctx.beginPath()
    ctx.moveTo(resistorX, resistorY)
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(resistorX + (i + 0.5) * 10, resistorY + (i % 2 === 0 ? -10 : 10))
    }
    ctx.lineTo(resistorX + 60, resistorY)
    ctx.stroke()

    // Wires
    ctx.strokeStyle = '#555'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(90, height / 2)
    ctx.lineTo(resistorX, height / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(resistorX + 60, height / 2)
    ctx.lineTo(width - 50, height / 2)
    ctx.stroke()

    // Ammeter circle
    ctx.strokeStyle = '#27ae60'
    ctx.fillStyle = '#e8f8f5'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(width - 70, height / 2, 25, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#27ae60'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('A', width - 70, height / 2 + 5)

    // Values display
    const current = (voltage / resistance).toFixed(2)
    ctx.fillStyle = '#1A1A2E'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`Voltage (V): ${voltage}V`, 50, 40)
    ctx.fillText(`Resistance (R): ${resistance}Ω`, 50, 70)
    ctx.fillText(`Current (I): ${current}A`, 50, 100)

    // Formula
    ctx.fillStyle = '#3B5BDB'
    ctx.font = 'italic 14px Arial'
    ctx.fillText(`V = I × R`, 50, height - 30)
    ctx.fillText(`I = V ÷ R = ${voltage} ÷ ${resistance} = ${current}A`, 50, height - 5)
  }, [voltage, resistance])

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">
            Voltage (V): <span className="text-primary">{voltage}V</span>
          </label>
          <input
            type="range"
            min="0"
            max="12"
            value={voltage}
            onChange={e => setVoltage(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">
            Resistance (Ω): <span className="text-primary">{resistance}Ω</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={resistance}
            onChange={e => setResistance(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        className="w-full bg-white border-2 border-gray-200 rounded-xl"
      />
      <p className="text-sm text-text-secondary bg-blue-50 p-4 rounded-lg">
        Adjust the voltage and resistance sliders to see how current changes. Current is calculated
        as I = V ÷ R.
      </p>
    </div>
  )
}

// Plant Cell Structure Component
function PlantCellSimulation() {
  const [selectedOrganelle, setSelectedOrganelle] = useState('nucleus')
  const canvasRef = useRef(null)

  const organelles = {
    nucleus: {
      name: 'Nucleus',
      description: 'Contains genetic material (DNA) and controls cell activities',
      color: '#8B4513',
      x: 250,
      y: 150,
      size: 40,
    },
    cellWall: {
      name: 'Cell Wall',
      description: 'Rigid outer layer that provides structure and support',
      color: '#FF6B6B',
      x: 250,
      y: 250,
      size: 120,
    },
    chloroplast: {
      name: 'Chloroplast',
      description: 'Produces energy through photosynthesis',
      color: '#51CF66',
      x: 180,
      y: 200,
      size: 25,
    },
    mitochondria: {
      name: 'Mitochondria',
      description: 'Powerhouse of the cell, produces ATP',
      color: '#FFD93D',
      x: 300,
      y: 200,
      size: 20,
    },
    vacuole: {
      name: 'Vacuole',
      description: 'Stores water and nutrients',
      color: '#7DD3E8',
      x: 200,
      y: 150,
      size: 30,
    },
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fffacd'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw cell membrane
    ctx.strokeStyle = '#FFA500'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(250, 200, 150, 120, 0, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw organelles
    Object.entries(organelles).forEach(([key, org]) => {
      ctx.fillStyle = selectedOrganelle === key ? '#FFD700' : org.color
      ctx.globalAlpha = selectedOrganelle === key ? 1 : 0.8
      if (key === 'cellWall') {
        ctx.beginPath()
        ctx.ellipse(org.x, org.y, org.size, org.size * 0.7, 0, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.globalAlpha = 1
      } else {
        ctx.beginPath()
        ctx.arc(org.x, org.y, org.size, 0, 2 * Math.PI)
        ctx.fill()
      }
    })

    ctx.globalAlpha = 1
    ctx.fillStyle = '#1A1A2E'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Plant Cell Structure', 250, 30)
  }, [selectedOrganelle])

  return (
    <div className="space-y-6">
      <canvas
        ref={canvasRef}
        width={500}
        height={450}
        className="w-full bg-white border-2 border-gray-200 rounded-xl"
      />

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(organelles).map(([key, org]) => (
          <button
            key={key}
            onClick={() => setSelectedOrganelle(key)}
            className={`p-4 rounded-lg text-left transition-all ${
              selectedOrganelle === key
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-text-primary hover:bg-gray-200'
            }`}
          >
            <p className="font-semibold">{org.name}</p>
            <p className="text-sm mt-1">{org.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// Acid-Base Neutralization Component
function AcidBaseSimulation() {
  const [progress, setProgress] = useState(0)
  const canvasRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsAnimating(false)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isAnimating])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Beaker
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(100, 400)
    ctx.lineTo(150, 100)
    ctx.lineTo(350, 100)
    ctx.lineTo(400, 400)
    ctx.stroke()

    // Liquid
    const liquidHeight = 300 * (progress / 100)
    const hue = 120 - progress * 1.2 // Red (0) to Green (120)
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
    ctx.fillRect(105, 400 - liquidHeight, 290, liquidHeight)

    // Liquid level indicator
    ctx.strokeStyle = '#999'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(80, 400 - liquidHeight)
    ctx.lineTo(420, 400 - liquidHeight)
    ctx.stroke()
    ctx.setLineDash([])

    // Labels
    ctx.fillStyle = '#1A1A2E'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('Acid (HCl)', 50, 450)
    ctx.fillText('pH: ' + (7 - progress / 10).toFixed(1), 50, 480)

    ctx.textAlign = 'right'
    ctx.fillText('+ Base (NaOH)', 450, 450)
    ctx.fillText('Neutralization: ' + progress.toFixed(0) + '%', 450, 480)

    // Title
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Acid-Base Neutralization', 250, 50)
  }, [progress])

  const handleReset = () => {
    setProgress(0)
    setIsAnimating(false)
  }

  const handleStart = () => {
    setIsAnimating(true)
  }

  return (
    <div className="space-y-6">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full bg-white border-2 border-gray-200 rounded-xl"
      />

      <div className="flex gap-4">
        <button
          onClick={handleStart}
          disabled={isAnimating || progress >= 100}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-all"
        >
          <PlayCircle size={20} />
          {progress >= 100 ? 'Complete' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-text-primary rounded-lg font-semibold hover:bg-gray-300 transition-all"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-text-secondary">
          <span className="font-semibold">Observations:</span> As base is added to acid, the color
          changes from red (acidic) toward green (neutral). The pH increases from acidic values
          toward 7 (neutral).
        </p>
      </div>
    </div>
  )
}

// Main Science Lab Component
function ScienceLab() {
  const [selectedExperiment, setSelectedExperiment] = useState('ohms-law')

  const { data: experimentsData, isLoading } = useQuery({
    queryKey: ['experiments'],
    queryFn: async () => {
      const res = await api.get('/labs')
      return res.data.data || []
    },
  })

  if (isLoading) return <LoadingSpinner />

  const experiments = [
    {
      id: 'ohms-law',
      title: "Ohm's Law",
      category: 'Physics',
      description: 'Verify the relationship between voltage, current, and resistance',
      difficulty: 'Medium',
      component: OhmsLawSimulation,
    },
    {
      id: 'plant-cell',
      title: 'Plant Cell Structure',
      category: 'Biology',
      description: 'Explore the structure and functions of plant cells',
      difficulty: 'Easy',
      component: PlantCellSimulation,
    },
    {
      id: 'acid-base',
      title: 'Acid-Base Neutralization',
      category: 'Chemistry',
      description: 'Observe neutralization reactions between acids and bases',
      difficulty: 'Medium',
      component: AcidBaseSimulation,
    },
    {
      id: 'anatomy-vr',
      title: '3D Human Anatomy',
      category: 'Health (AR/VR)',
      description: 'Explore simplified anatomy in an interactive 3D scene',
      difficulty: 'Medium',
      component: AnatomyVR,
    },
    {
      id: 'circulation-vr',
      title: 'Heartbeat & Circulation',
      category: 'Health (AR/VR)',
      description: 'Visualize blood flow around a loop and the heartbeat concept',
      difficulty: 'Medium',
      component: CirculationVR,
    },
    {
      id: 'respiration-vr',
      title: 'Lung Function & Respiration',
      category: 'Health (AR/VR)',
      description: 'Observe inhalation/exhalation with expanding/contracting lung primitives',
      difficulty: 'Easy',
      component: RespirationVR,
    },
  ]

  const currentExp = experiments.find(e => e.id === selectedExperiment)
  const CurrentComponent = currentExp?.component

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-text-primary mb-4">Advanced Science Lab</h1>
          <p className="text-xl text-text-secondary">
            Interactive simulations for hands-on learning
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Experiment Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-text-primary mb-6">Experiments</h2>
              <div className="space-y-3">
                {experiments.map(exp => (
                  <button
                    key={exp.id}
                    onClick={() => setSelectedExperiment(exp.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedExperiment === exp.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-50 text-text-primary hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-semibold text-sm">{exp.title}</p>
                    <p
                      className={`text-xs mt-1 ${
                        selectedExperiment === exp.id ? 'text-white/80' : 'text-text-secondary'
                      }`}
                    >
                      {exp.category}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Experiment Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Experiment Header */}
              <div className="mb-8">
                <div className="inline-block px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-semibold mb-3">
                  {currentExp?.category}
                </div>
                <h2 className="text-3xl font-bold text-text-primary mb-2">{currentExp?.title}</h2>
                <p className="text-text-secondary mb-4">{currentExp?.description}</p>
                <div className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold">
                  Difficulty: {currentExp?.difficulty}
                </div>
              </div>

              {/* Interactive Simulation */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-8">
                {CurrentComponent && <CurrentComponent />}
              </div>

              {/* Theory and Procedure */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-text-primary mb-3">Theory</h3>
                  <p className="text-sm text-text-secondary">
                    {currentExp?.id === 'ohms-law' &&
                      "Ohm's Law states that the current flowing through a conductor is directly proportional to the voltage and inversely proportional to the resistance. Mathematically: V = IR"}
                    {currentExp?.id === 'plant-cell' &&
                      'Plant cells are eukaryotic cells containing a nucleus and various organelles. Unlike animal cells, they have a cell wall and chloroplasts for photosynthesis.'}
                    {currentExp?.id === 'acid-base' &&
                      'Neutralization is a reaction between an acid and a base that produces a salt and water. The pH of the solution changes as these substances mix.'}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-bold text-text-primary mb-3">Key Observations</h3>
                  <ul className="text-sm text-text-secondary space-y-2">
                    {currentExp?.id === 'ohms-law' && (
                      <>
                        <li>• Current increases with voltage</li>
                        <li>• Current decreases with resistance</li>
                        <li>• V, I, and R follow V = IR</li>
                      </>
                    )}
                    {currentExp?.id === 'plant-cell' && (
                      <>
                        <li>• Nucleus controls cell activities</li>
                        <li>• Chloroplasts conduct photosynthesis</li>
                        <li>• Cell wall provides structure</li>
                      </>
                    )}
                    {currentExp?.id === 'acid-base' && (
                      <>
                        <li>• Acid starts red, base is colorless</li>
                        <li>• Color changes with pH</li>
                        <li>• Neutral solution is green</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScienceLab
