import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Code, 
  Sparkles, 
  Terminal,
  Bug,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Zap,
  FileCode,
  Braces,
  XCircle,
  Coffee,
  Cpu,
  Database,
  Globe,
  Hash,
  Settings
} from 'lucide-react'
import { aiAPI } from '../services/api'

const languages = [
  { id: 'javascript', label: 'JavaScript', icon: Braces, color: 'yellow' },
  { id: 'python', label: 'Python', icon: Terminal, color: 'blue' },
  { id: 'java', label: 'Java', icon: Coffee, color: 'orange' },
  { id: 'cpp', label: 'C++', icon: Settings, color: 'purple' },
  { id: 'typescript', label: 'TypeScript', icon: Hash, color: 'blue' },
  { id: 'react', label: 'React', icon: Cpu, color: 'cyan' },
  { id: 'sql', label: 'SQL', icon: Database, color: 'green' },
  { id: 'html', label: 'HTML/CSS', icon: Globe, color: 'orange' },
]

const helpTypes = [
  { id: 'debug', label: 'Debug Code', icon: Bug, desc: 'Find and fix errors' },
  { id: 'explain', label: 'Explain Code', icon: Lightbulb, desc: 'Understand how it works' },
  { id: 'optimize', label: 'Optimize', icon: Zap, desc: 'Improve performance' },
  { id: 'convert', label: 'Convert', icon: RefreshCw, desc: 'Translate to another language' },
]

function CodeHelper() {
  const { isAuthenticated } = useSelector((state) => state.user)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [helpType, setHelpType] = useState('debug')
  const [additionalContext, setAdditionalContext] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    
    if (!isAuthenticated) {
      setError('Please log in to use the AI Homework Assistants.')
      return
    }
    if (!code.trim()) {
      setError('Paste your code or describe your coding problem.')
      return
    }
    
    try {
      setIsLoading(true)
      const selectedLang = languages.find(l => l.id === language)
      const selectedHelp = helpTypes.find(h => h.id === helpType)
      
      const { data } = await aiAPI.chat({
        message: `Language: ${selectedLang?.label || language}
Task: ${selectedHelp?.label || helpType} - ${selectedHelp?.desc || ''}
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Code:
\`\`\`${language}
${code}
\`\`\`

Please provide a detailed response with:
1. Analysis of the code
2. ${helpType === 'debug' ? 'Identified issues and fixes' : 
     helpType === 'explain' ? 'Clear explanation of what the code does' :
     helpType === 'optimize' ? 'Optimized version with explanations' :
     'Converted code with notes on differences'}
3. Best practices and recommendations`,
        mode: 'direct',
        context: { tool: 'code-helper', language, helpType },
      })
      setResult(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not process your request.')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-slate-700">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Powered by Gemini AI</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Code Helper
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Debug, explain, optimize, or convert your code with AI assistance.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-emerald-400" />
                <span>Debug Errors</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-400" />
                <span>Explain Code</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>Optimize Performance</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                Your Code
              </h2>

              {/* Language Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Language
                </label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => {
                    const Icon = lang.icon
                    return (
                      <button
                        key={lang.id}
                        onClick={() => setLanguage(lang.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                          language === lang.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {lang.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Help Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  What do you need?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {helpTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setHelpType(type.id)}
                        className={`p-3 rounded-xl text-left transition-all ${
                          helpType === type.id
                            ? 'bg-emerald-500/20 border-2 border-emerald-500'
                            : 'bg-slate-700/50 border-2 border-transparent hover:border-slate-600'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${helpType === type.id ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <p className={`text-sm font-medium ${helpType === type.id ? 'text-emerald-300' : 'text-slate-300'}`}>
                          {type.label}
                        </p>
                        <p className="text-xs text-slate-500">{type.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Code Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Paste your code
                </label>
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 rounded-t-xl flex items-center px-4 gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="// Paste your code here..."
                    rows={10}
                    className="w-full pt-10 px-4 pb-4 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all resize-none font-mono text-sm text-slate-200 placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Additional Context */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Additional context (optional)
                </label>
                <input
                  type="text"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="e.g., I'm getting a TypeError on line 5"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-slate-200 placeholder-slate-500"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-300 flex items-center gap-2 mb-4">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze Code
                  </>
                )}
              </button>

              {!isAuthenticated && (
                <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-sm text-slate-300 mb-3">
                    Sign in to access AI-powered code help
                  </p>
                  <Link to="/login" className="block w-full bg-emerald-500 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Result Panel */}
          <div>
            {!result ? (
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Ready to Help
                </h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Paste your code, select the language and help type, then let AI analyze and assist you.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-emerald-400" />
                    Analysis Result
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-sm"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => setResult(null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear
                    </button>
                  </div>
                </div>
                <div className="p-6 max-h-[600px] overflow-y-auto">
                  <div className="prose prose-invert prose-emerald max-w-none">
                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-mono text-sm">
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

export default CodeHelper
