import { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Lightbulb, 
  BookOpen,
  Sparkles,
  MinusCircle,
  Trash2,
  Bot
} from 'lucide-react'
import { useAITutor } from '../../hooks/useAITutor'
import { useDispatch } from 'react-redux'
import { setMode } from '../../store/slices/aiTutorSlice'

function AIChatWidget({ context }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const { 
    messages, 
    isLoading, 
    mode,
    sendMessage, 
    getHint,
    getExplanation,
    clearConversation 
  } = useAITutor()
  const dispatch = useDispatch()

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    await sendMessage(input, context)
    setInput('')
  }, [input, sendMessage, context])

  const handleModeChange = useCallback((newMode) => {
    dispatch(setMode(newMode))
  }, [dispatch])

  const modeButtons = useMemo(() => [
    { id: 'socratic', label: 'Guide Me', icon: Lightbulb },
    { id: 'direct', label: 'Direct', icon: BookOpen },
    { id: 'guided', label: 'Hints', icon: Sparkles },
  ], [])

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Tutor"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/10"
          >
            <div className="bg-gradient-to-r from-primary to-primary-dark p-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <h3 className="font-semibold">Vidhya AI Tutor</h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={clearConversation}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Clear conversation"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Minimize"
                  >
                    <MinusCircle size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                {modeButtons.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleModeChange(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      mode === id
                        ? 'bg-white text-primary'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="text-accent-cyan" size={28} />
                  </div>
                  <p className="text-sm font-medium text-gray-300">Hi! I'm your AI tutor.</p>
                  <p className="text-xs mt-1">Ask me anything about your lessons!</p>
                </div>
              )}
              
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-md'
                        : msg.error
                        ? 'bg-red-500/20 text-red-300 rounded-bl-md'
                        : 'bg-gray-800 text-gray-100 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {context && (
              <div className="px-4 pb-3 flex gap-2 flex-wrap">
                <button
                  onClick={() => getHint(context.problemDescription, context.currentProgress)}
                  className="text-xs px-3 py-1.5 bg-accent-cyan/20 text-accent-cyan rounded-lg hover:bg-accent-cyan/30 transition-colors flex items-center gap-1.5"
                >
                  <Lightbulb size={12} />
                  Get Hint
                </button>
                <button
                  onClick={() => getExplanation(context.concept)}
                  className="text-xs px-3 py-1.5 bg-primary/20 text-primary-light rounded-lg hover:bg-primary/30 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen size={12} />
                  Explain This
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

AIChatWidget.propTypes = {
  context: PropTypes.shape({
    lessonId: PropTypes.string,
    concept: PropTypes.string,
    problemDescription: PropTypes.string,
    currentProgress: PropTypes.string,
  }),
}

export default AIChatWidget
