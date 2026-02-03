import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { BookOpen, Check, Eye, EyeOff } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

/**
 * TheoryNotes Component
 * Display formatted theory notes with markdown support
 */
export default function TheoryNotes({ notes, lessonId, courseId, onMarkRead, isRead }) {
  const [showNotes, setShowNotes] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    // Reset when lesson changes
    setShowNotes(false)
    setScrollProgress(0)
  }, [lessonId])

  const handleScroll = e => {
    const element = e.target
    const scrolled = element.scrollTop
    const total = element.scrollHeight - element.clientHeight
    const percentage = total > 0 ? (scrolled / total) * 100 : 0
    setScrollProgress(percentage)

    // Auto-mark as read when scrolled to 80%
    if (percentage >= 80 && !isRead && onMarkRead) {
      onMarkRead(lessonId)
    }
  }

  const toggleNotes = () => {
    setShowNotes(!showNotes)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent-cyan/10 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <BookOpen size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Theory Notes</h3>
              <p className="text-xs text-text-secondary">Study material for this lesson</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRead && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 rounded-full">
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-700 text-xs font-semibold">Read</span>
              </span>
            )}
            <button
              onClick={toggleNotes}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
            >
              {showNotes ? (
                <>
                  <EyeOff size={16} />
                  Hide Notes
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Show Notes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scroll Progress */}
        {showNotes && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
              <span>Reading Progress</span>
              <span className="font-semibold">{Math.round(scrollProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Notes Content */}
      {showNotes && (
        <div
          onScroll={handleScroll}
          className="p-6 max-h-[600px] overflow-y-auto prose prose-slate max-w-none"
          style={{
            scrollBehavior: 'smooth',
          }}
        >
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold text-text-primary mb-4 mt-6" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-bold text-text-primary mb-3 mt-5" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold text-text-primary mb-2 mt-4" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-text-secondary leading-relaxed mb-4" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-inside space-y-2 mb-4 text-text-secondary"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal list-inside space-y-2 mb-4 text-text-secondary"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => <li className="ml-4" {...props} />,
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code
                    className="px-1.5 py-0.5 bg-gray-100 text-primary rounded text-sm font-mono"
                    {...props}
                  />
                ) : (
                  <code
                    className="block p-4 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono overflow-x-auto mb-4"
                    {...props}
                  />
                ),
              pre: ({ node, ...props }) => <pre className="mb-4" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-primary pl-4 italic text-text-secondary my-4"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-text-primary" {...props} />
              ),
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
            }}
          >
            {notes}
          </ReactMarkdown>

          {/* Mark as Read Button at Bottom */}
          {!isRead && onMarkRead && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => onMarkRead(lessonId)}
                className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Check size={20} />
                Mark Notes as Read
              </button>
            </div>
          )}
        </div>
      )}

      {/* Collapsed State */}
      {!showNotes && (
        <div className="p-8 text-center">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-text-secondary">Click "Show Notes" to read the theory material</p>
        </div>
      )}
    </div>
  )
}

TheoryNotes.propTypes = {
  notes: PropTypes.string.isRequired,
  lessonId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  onMarkRead: PropTypes.func,
  isRead: PropTypes.bool,
}
