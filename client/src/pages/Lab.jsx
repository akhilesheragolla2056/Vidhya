import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import {
  FlaskConical,
  Zap,
  Flame,
  Gem,
  Play,
  RotateCcw,
  Lightbulb,
  Target,
  CheckCircle,
  X,
} from 'lucide-react'
import { labAPI } from '../services/api'
const LabScene = lazy(() => import('../components/lab/LabScene'))

const defaultInputsFor = id => {
  if (id === 'acid-base') return { baseMl: 0 }
  if (id === 'electrolysis') return { voltage: 6, resistance: 10 }
  if (id === 'combustion') return { oxygenPercent: 50 }
  if (id === 'crystal') return { temperatureC: 60, concentration: 70 }
  if (id === 'pendulum') return { lengthM: 1 }
  if (id === 'optics') return { incidenceDeg: 30, refractiveIndex: 1.5 }
  if (id === 'cell-division') return { stage: 'prophase' }
  if (id === 'photosynthesis') return { lightPercent: 50 }
  return {}
}

const labControls = {
  'acid-base': [{ key: 'baseMl', label: 'Base added', min: 0, max: 50, step: 1, unit: 'mL' }],
  electrolysis: [
    { key: 'voltage', label: 'Supply voltage', min: 0, max: 12, step: 0.5, unit: 'V' },
    { key: 'resistance', label: 'Circuit resistance', min: 1, max: 100, step: 1, unit: 'Ω' },
  ],
  combustion: [{ key: 'oxygenPercent', label: 'Oxygen available', min: 0, max: 100, step: 1, unit: '%' }],
  crystal: [
    { key: 'temperatureC', label: 'Solution temperature', min: 10, max: 90, step: 1, unit: '°C' },
    { key: 'concentration', label: 'Dissolved material', min: 1, max: 100, step: 1, unit: '%' },
  ],
  pendulum: [{ key: 'lengthM', label: 'Pendulum length', min: 0.2, max: 2, step: 0.05, unit: 'm' }],
  optics: [
    { key: 'incidenceDeg', label: 'Incident angle', min: 0, max: 80, step: 1, unit: '°' },
    { key: 'refractiveIndex', label: 'Medium refractive index', min: 1.1, max: 2.4, step: 0.1, unit: '' },
  ],
  'cell-division': [{ key: 'stage', label: 'Mitosis stage', type: 'select', options: ['prophase', 'metaphase', 'anaphase', 'telophase'] }],
  photosynthesis: [{ key: 'lightPercent', label: 'Light intensity', min: 0, max: 100, step: 1, unit: '%' }],
}

const calculateLiveReadout = (id, inputs) => {
  if (id === 'acid-base' && typeof inputs.baseMl === 'number') {
    const remainingAcid = 2.5 - inputs.baseMl * 0.1
    const volume = 25 + inputs.baseMl
    const pH = remainingAcid > 0
      ? -Math.log10((remainingAcid / volume) * 1000)
      : remainingAcid < 0
        ? 14 + Math.log10((-remainingAcid / volume) * 1000)
        : 7
    return { label: 'Estimated pH', value: Math.max(0, Math.min(14, pH)).toFixed(2) }
  }
  if (id === 'electrolysis' && inputs.resistance) return { label: 'Current', value: `${(inputs.voltage / inputs.resistance).toFixed(2)} A` }
  if (id === 'combustion') return { label: 'Modeled reaction', value: inputs.oxygenPercent >= 40 ? 'More complete' : 'Incomplete' }
  if (id === 'crystal') return { label: 'Crystal growth', value: inputs.concentration > 100 - inputs.temperatureC * 0.55 ? 'Supersaturated' : 'Unsaturated' }
  if (id === 'pendulum') return { label: 'Period', value: `${(2 * Math.PI * Math.sqrt(inputs.lengthM / 9.81)).toFixed(2)} s` }
  if (id === 'optics') return { label: 'Refracted angle', value: `${(Math.asin(Math.sin(inputs.incidenceDeg * Math.PI / 180) / inputs.refractiveIndex) * 180 / Math.PI).toFixed(2)}°` }
  if (id === 'cell-division') return { label: 'Selected stage', value: inputs.stage }
  if (id === 'photosynthesis') return { label: 'Relative rate', value: `${((inputs.lightPercent / (inputs.lightPercent + 25)) * 100).toFixed(1)}%` }
  return { label: 'Experiment', value: 'Interactive 3D model' }
}

function Lab() {
  const { id } = useParams()
  const subject = (id || 'chemistry').toLowerCase()
  const [selectedExperiment, setSelectedExperiment] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [parameters, setParameters] = useState({})
  const [progressSaveFailed, setProgressSaveFailed] = useState(false)
  const [runError, setRunError] = useState('')
  const progressLoadedRef = useRef(null)
  const touchedExperimentRef = useRef(null)
  const progressSaveTimerRef = useRef(null)

  const {
    data: experiments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['labs', subject],
    queryFn: async () => {
      const res = await labAPI.getExperiments(subject)
      return res.data?.data || []
    },
  })

  useEffect(() => {
    if (experiments.length && !experiments.some(experiment => experiment.id === selectedExperiment)) {
      setSelectedExperiment(experiments[0].id)
    }
  }, [experiments, selectedExperiment])

  useEffect(() => {
    setSelectedExperiment(null)
    setResults(null)
    setProgressSaveFailed(false)
    setRunError('')
    progressLoadedRef.current = null
    touchedExperimentRef.current = null
    setIsRunning(false)
  }, [subject])

  const resolveIcon = icon => {
    const codePoint = typeof icon === 'string' ? icon.codePointAt(0) : null
    if (codePoint === 0x26a1) return Zap
    if (codePoint === 0x1f525) return Flame
    if (codePoint === 0x1f48e) return Gem
    if (codePoint === 0x1f3af) return Target
    if (codePoint === 0x1f526) return Lightbulb
    return FlaskConical
  }

  const chipColor = difficulty => {
    if (!difficulty) return 'text-accent-cyan'
    const level = difficulty.toLowerCase()
    if (level === 'beginner') return 'text-accent-cyan'
    if (level === 'intermediate') return 'text-accent-yellow'
    return 'text-accent-orange'
  }

  const activeExperiment = experiments.find(exp => exp.id === selectedExperiment)

  const initialInputs = useMemo(() => defaultInputsFor(selectedExperiment), [selectedExperiment])
  const controls = labControls[selectedExperiment] || []
  const progressQuery = useQuery({
    queryKey: ['lab-progress', subject, selectedExperiment],
    queryFn: async () => (await labAPI.getProgress(subject, selectedExperiment)).data?.data || null,
    enabled: Boolean(selectedExperiment),
    retry: false,
  })
  const liveReadout = useMemo(
    () => calculateLiveReadout(selectedExperiment, parameters),
    [selectedExperiment, parameters]
  )

  useEffect(() => {
    if (!selectedExperiment || !progressQuery.isFetched) return
    setParameters({ ...initialInputs, ...(progressQuery.data?.state || {}) })
    setResults(progressQuery.data?.status === 'completed' ? progressQuery.data.results : null)
    setRunError('')
    progressLoadedRef.current = selectedExperiment
  }, [initialInputs, progressQuery.data, progressQuery.isFetched, selectedExperiment])

  useEffect(() => {
    if (
      !selectedExperiment ||
      progressLoadedRef.current !== selectedExperiment ||
      touchedExperimentRef.current !== selectedExperiment
    ) return undefined
    progressSaveTimerRef.current = window.setTimeout(async () => {
      progressSaveTimerRef.current = null
      try {
        await labAPI.saveProgress(subject, selectedExperiment, { state: parameters })
        setProgressSaveFailed(false)
      } catch {
        setProgressSaveFailed(true)
      }
    }, 650)
    return () => {
      if (progressSaveTimerRef.current) window.clearTimeout(progressSaveTimerRef.current)
      progressSaveTimerRef.current = null
    }
  }, [parameters, selectedExperiment, subject])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="space-y-4 text-center">
          <p className="text-lg">Experiments could not be loaded.</p>
          <p className="text-sm text-gray-400">Check your connection and try again.</p>
          <button type="button" onClick={() => refetch()} className="rounded-lg bg-primary px-4 py-2 font-semibold hover:bg-primary-dark">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (experiments.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 px-4 text-center text-white">
        <div className="space-y-4">
          <p className="text-lg">No experiments are available for this subject yet.</p>
          <Link to="/courses" className="inline-flex rounded-lg bg-primary px-4 py-2 font-semibold hover:bg-primary-dark">
            Browse courses
          </Link>
        </div>
      </div>
    )
  }

  const runExperiment = async () => {
    if (!activeExperiment) return
    if (progressSaveTimerRef.current) window.clearTimeout(progressSaveTimerRef.current)
    progressSaveTimerRef.current = null
    setIsRunning(true)
    setResults(null)
    setProgressSaveFailed(false)
    setRunError('')
    try {
      const response = await labAPI.submitResults(subject, activeExperiment.id, { inputs: parameters })
      setResults(response.data?.data || null)
      touchedExperimentRef.current = null
      await progressQuery.refetch()
    } catch (error) {
      setRunError(error.response?.data?.message || 'The experiment could not be saved. Check your connection and try again.')
    } finally {
      setIsRunning(false)
    }
  }

  const resetLab = () => {
    touchedExperimentRef.current = selectedExperiment
    setParameters(initialInputs)
    setResults(null)
    setProgressSaveFailed(false)
    setRunError('')
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
              <p className="text-xs capitalize text-gray-400">{subject} experiments</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Available Experiments
          </h2>
          <div className="space-y-2">
            {experiments.map(exp => {
              const Icon = resolveIcon(exp.icon)
              const color = chipColor(exp.difficulty)
              return (
                <button
                  key={exp.id}
                  onClick={() => {
                    setSelectedExperiment(exp.id)
                    setResults(null)
                    setRunError('')
                    setProgressSaveFailed(false)
                  }}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedExperiment === exp.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedExperiment === exp.id ? 'bg-white/20' : 'bg-gray-600'
                      }`}
                    >
                      <Icon
                        size={20}
                        className={selectedExperiment === exp.id ? 'text-white' : color}
                      />
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
            disabled={isRunning || progressQuery.isLoading}
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
                Record Results
              </>
            )}
          </button>
          <button onClick={resetLab} className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm flex items-center justify-center gap-2">
            <RotateCcw size={16} />
            Reset Lab
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <Suspense fallback={<div className="flex h-full items-center justify-center bg-slate-950 text-white">Loading simulation...</div>}>
          <LabScene subject={subject} experimentId={selectedExperiment} parameters={parameters} />
        </Suspense>

        <div className="absolute right-4 top-4 max-w-[calc(100%-2rem)] rounded-2xl border border-white/40 bg-white/95 px-5 py-3 shadow-lg backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Live measurement</p>
          <p className="mt-1 text-lg font-bold text-text-primary">{liveReadout.label}: {liveReadout.value}</p>
          <p className="mt-1 text-xs text-text-secondary">Updates as you change the experiment controls.</p>
        </div>

        {runError && <p role="alert" className="absolute bottom-4 left-4 right-4 max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-lg">{runError}</p>}

        {results && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-5 shadow-xl max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={24} className="text-accent-cyan" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">Experiment saved</h3>
                <p className="text-sm text-text-secondary mt-1">{results.observation}</p>
                {progressSaveFailed && <p role="alert" className="mt-2 text-sm text-red-700">Your experiment finished, but its progress could not be saved.</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(results.outputs || {}).map(([key, value]) => (
                    <span key={key} className="rounded-lg bg-surface-light px-3 py-1.5 text-sm font-medium text-text-primary">
                      {key.replace(/([A-Z])/g, ' $1')}: {String(value)}
                    </span>
                  ))}
                  <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">Saved to your lab history</span>
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
          <h2 className="font-bold text-lg text-text-primary">{activeExperiment?.name || 'Experiment'} controls</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {progressQuery.isError && <p role="status" className="mb-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Progress could not be loaded. Your simulation is still available.</p>}
          {controls.length > 0 && (
            <section className="mb-7 space-y-5" aria-label="Live experiment inputs">
              {controls.map(control => (
                <div key={control.key}>
                  <label htmlFor={`control-${control.key}`} className="mb-2 flex items-center justify-between gap-2 text-sm font-semibold text-text-primary">
                    <span>{control.label}</span>
                    {control.type !== 'select' && <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs">{parameters[control.key]} {control.unit}</span>}
                  </label>
                  {control.type === 'select' ? (
                    <select
                      id={`control-${control.key}`}
                      value={parameters[control.key] || control.options[0]}
                      disabled={progressQuery.isLoading}
                      onChange={event => {
                        touchedExperimentRef.current = selectedExperiment
                        setParameters(previous => ({ ...previous, [control.key]: event.target.value }))
                        setResults(null)
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm capitalize outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
                    >
                      {control.options.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input
                      id={`control-${control.key}`}
                      type="range"
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      value={parameters[control.key] ?? initialInputs[control.key]}
                      disabled={progressQuery.isLoading}
                      onChange={event => {
                        touchedExperimentRef.current = selectedExperiment
                        setParameters(previous => ({ ...previous, [control.key]: Number(event.target.value) }))
                        setResults(null)
                      }}
                      className="w-full accent-indigo-600 disabled:opacity-50"
                    />
                  )}
                </div>
              ))}
              {progressSaveFailed && <p role="alert" className="text-xs text-red-700">Changes are not saved yet. Check your connection.</p>}
            </section>
          )}
          <div className="space-y-4">
            {[
              'Adjust the inputs and watch the measurement change live',
              'Drag the 3D model to inspect it from different angles',
              'Record results to save this run to your account',
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
              Use the AR or VR controls when the browser and device support WebXR. A secure HTTPS page is required for immersive mode.
            </p>
          </div>
          <p className="mt-4 text-xs leading-5 text-text-muted">
            Results use deterministic classroom models and are saved with your account; they are not measurements from physical equipment.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Lab
