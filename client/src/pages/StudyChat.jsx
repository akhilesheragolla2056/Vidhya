import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Send, 
  Sparkles,
  Bot,
  User,
  Trash2,
  Brain,
  BookOpen,
  Lightbulb,
  HelpCircle,
  RefreshCw,
  XCircle
} from 'lucide-react'
import { aiAPI } from '../services/api'

const chatModes = [
  { id: 'socratic', label: 'Socratic', icon: HelpCircle, desc: 'Learn through questions', color: 'blue' },
  { id: 'direct', label: 'Direct', icon: BookOpen, desc: 'Get clear answers', color: 'green' },
  { id: 'guided', label: 'Guided', icon: Lightbulb, desc: 'Hints and nudges', color: 'purple' },
]

const suggestedQuestions = [
  "Explain photosynthesis in simple terms",
  "How do I solve quadratic equations?",
  "What caused World War I?",
  "Help me understand recursion in programming",
  "Explain the water cycle",
]

function StudyChat() {
  const { isAuthenticated } = useSelector((state) => state.user)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('socratic')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e, customMessage = null) => {
    e?.preventDefault()
    setError('')
    
    const messageToSend = customMessage || input
    if (!messageToSend.trim()) return
    
    if (!isAuthenticated) {
      setError('Please log in to use the AI Homework Assistants.')
      return
    }

    const userMessage = { role: 'user', content: messageToSend }
    const newHistory = [...messages, userMessage]
    setMessages(newHistory)
    setInput('')

    try {
      setIsLoading(true)
      const { data } = await aiAPI.chat({
        message: messageToSend,
        mode: mode,
        history: newHistory.slice(-10),
        context: { tool: 'study-chat', mode },
      })
      setMessages([...newHistory, { role: 'assistant', content: data.message }])
    } catch (err) {
      setError(err.response?.data?.message || 'Chat is temporarily unavailable.')
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (question) => {
    handleSend(null, question)
  }

  const clearChat = () => {
    setMessages([])
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">AI Study Assistant</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Study Chat
            </h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Ask any question and learn through conversation with your AI tutor.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Mode Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2">
            {chatModes.map((m) => {
              const Icon = m.icon
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    mode === m.id
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start a Conversation
                </h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Ask any study question or try one of these suggestions:
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(q)}
                      disabled={!isAuthenticated}
                      className="px-4 py-2 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-full text-sm text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="px-6 pb-2">
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-2">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            {messages.length > 0 && (
              <div className="flex justify-center mb-3">
                <button
                  onClick={clearChat}
                  className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear conversation
                </button>
              </div>
            )}
            
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isAuthenticated ? "Ask any study question..." : "Sign in to start chatting"}
                disabled={!isAuthenticated || isLoading}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!isAuthenticated || isLoading || !input.trim()}
                className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {!isAuthenticated && (
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-indigo-600 hover:underline">
                  Sign in to start chatting
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyChat
