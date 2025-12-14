import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, 
  Sparkles, 
  Brain, 
  Target, 
  Lightbulb,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  BookOpen,
  Ruler,
  TrendingUp,
  PieChart,
  Triangle,
  Grid3X3
} from 'lucide-react'
import { aiAPI } from '../services/api'

const suggestedTopics = [
  { label: 'Algebra', icon: Grid3X3 },
  { label: 'Calculus', icon: TrendingUp },
  { label: 'Geometry', icon: Triangle },
  { label: 'Statistics', icon: PieChart },
  { label: 'Trigonometry', icon: Ruler },
  { label: 'Linear Algebra', icon: Grid3X3 },
]

function MathHelper() {
  const { isAuthenticated } = useSelector((state) => state.user)
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [problems, setProblems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAnswers, setShowAnswers] = useState({})

  const handleGenerate = async (e) => {
    e.preventDefault()
    setError('')
    setShowAnswers({})
    
    if (!isAuthenticated) {
      setError('Please log in to use the AI Homework Assistants.')
      return
    }
    if (!topic.trim()) {
      setError('Add a topic to generate practice questions.')
      return
    }
    try {
      setIsLoading(true)
      const { data } = await aiAPI.generatePractice(topic, difficulty, 5)
      setProblems(data.problems || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate practice right now.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAnswer = (idx) => {
    setShowAnswers(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Powered by Gemini AI</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Math Problem Solver
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Generate practice problems, get step-by-step solutions, and master any math concept.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-yellow-300" />
                <span>Adaptive Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-300" />
                <span>Targeted Practice</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-300" />
                <span>Step-by-Step Solutions</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Generate Problems
              </h2>

              <form onSubmit={handleGenerate} className="space-y-4">
                {/* Quick Topics */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Topics
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTopics.map((t) => {
                      const Icon = t.icon
                      return (
                        <button
                          key={t.label}
                          type="button"
                          onClick={() => setTopic(t.label)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                            topic === t.label
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {t.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Topic Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic or Concept
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Quadratic equations"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          difficulty === level
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate Problems
                    </>
                  )}
                </button>
              </form>

              {!isAuthenticated && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-700 mb-3">
                    Sign in to access AI-powered math help
                  </p>
                  <Link to="/login" className="btn-primary w-full text-center py-2 text-sm">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Problems Display */}
          <div className="lg:col-span-2">
            {problems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Practice?
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Select a topic and difficulty level, then generate problems to start practicing.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Practice Problems
                  </h2>
                  <button
                    onClick={() => setProblems([])}
                    className="text-sm text-gray-500 hover:text-primary flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear
                  </button>
                </div>

                <AnimatePresence mode="popLayout">
                  {problems.map((problem, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-primary">{idx + 1}</span>
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium">
                                {problem.question}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-6">
                        <button
                          onClick={() => toggleAnswer(idx)}
                          className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1"
                        >
                          {showAnswers[idx] ? 'Hide Solution' : 'Show Solution'}
                          <ChevronRight className={`w-4 h-4 transition-transform ${showAnswers[idx] ? 'rotate-90' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {showAnswers[idx] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100"
                            >
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-green-800 mb-1">Solution</p>
                                  <p className="text-green-700 whitespace-pre-wrap">
                                    {problem.answer || problem.solution}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MathHelper
