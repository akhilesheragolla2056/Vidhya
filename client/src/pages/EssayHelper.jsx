import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Sparkles, 
  PenTool, 
  BookOpen,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Zap,
  List,
  MessageSquare,
  Target,
  Scale,
  Palette,
  XCircle
} from 'lucide-react'
import { aiAPI } from '../services/api'

const essayTypes = [
  { id: 'argumentative', label: 'Argumentative', icon: MessageSquare, desc: 'Take a stance and defend it' },
  { id: 'expository', label: 'Expository', icon: BookOpen, desc: 'Explain a topic clearly' },
  { id: 'narrative', label: 'Narrative', icon: PenTool, desc: 'Tell a compelling story' },
  { id: 'descriptive', label: 'Descriptive', icon: Palette, desc: 'Paint a vivid picture' },
  { id: 'compare', label: 'Compare & Contrast', icon: Scale, desc: 'Analyze similarities and differences' },
  { id: 'persuasive', label: 'Persuasive', icon: Target, desc: 'Convince your reader' },
]

function EssayHelper() {
  const { isAuthenticated } = useSelector((state) => state.user)
  const [prompt, setPrompt] = useState('')
  const [essayType, setEssayType] = useState('argumentative')
  const [length, setLength] = useState('medium')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    
    if (!isAuthenticated) {
      setError('Please log in to use the AI Homework Assistants.')
      return
    }
    if (!prompt.trim()) {
      setError('Add a topic or assignment prompt to continue.')
      return
    }
    try {
      setIsLoading(true)
      const selectedType = essayTypes.find(t => t.id === essayType)
      const { data } = await aiAPI.chat({
        message: `Create a comprehensive essay outline for a ${selectedType?.label || 'standard'} essay on: "${prompt}". 
        
Please provide:
1. A strong thesis statement
2. An introduction hook
3. 3-4 main body paragraph topics with supporting points
4. A conclusion summary
5. 2-3 potential sources or research directions

Format the response clearly with sections labeled.`,
        mode: 'guided',
        context: { tool: 'essay-helper', essayType, desiredLength: length },
      })
      setResult(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate an outline right now.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
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
              Essay Writing Assistant
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Generate outlines, thesis statements, and structure for any type of essay.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-300" />
                <span>Multiple Essay Types</span>
              </div>
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-yellow-300" />
                <span>Structured Outlines</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-300" />
                <span>Research Suggestions</span>
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
                <PenTool className="w-5 h-5 text-purple-500" />
                Essay Settings
              </h2>

              <form onSubmit={handleGenerate} className="space-y-5">
                {/* Essay Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Essay Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {essayTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setEssayType(type.id)}
                          className={`p-3 rounded-xl text-left transition-all ${
                            essayType === type.id
                              ? 'bg-purple-50 border-2 border-purple-400'
                              : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1 ${essayType === type.id ? 'text-purple-500' : 'text-gray-400'}`} />
                          <p className={`text-sm font-medium ${essayType === type.id ? 'text-purple-700' : 'text-gray-700'}`}>
                            {type.label}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Essay Topic or Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., The impact of social media on modern communication..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all resize-none"
                  />
                </div>

                {/* Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Essay Length
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['short', 'medium', 'long'].map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setLength(len)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          length === len
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {len}
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
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate Outline
                    </>
                  )}
                </button>
              </form>

              {!isAuthenticated && (
                <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-gray-700 mb-3">
                    Sign in to access AI-powered essay help
                  </p>
                  <Link to="/login" className="block w-full bg-purple-500 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Result Display */}
          <div className="lg:col-span-2">
            {!result ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Write?
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Select an essay type, enter your topic, and generate a comprehensive outline to guide your writing.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    Essay Outline
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => setResult(null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose prose-purple max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {result}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EssayHelper
