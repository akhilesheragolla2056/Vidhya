import { useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Check, Play, Lock, FileText, Video, HelpCircle } from 'lucide-react'

const contentTypeIcons = {
  video: Video,
  text: FileText,
  quiz: HelpCircle,
  interactive: Play,
}

function CourseModules({ modules, progress = {}, onLessonClick, isEnrolled }) {
  const [expandedModules, setExpandedModules] = useState([0]) // First module expanded by default

  const toggleModule = (index) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const isLessonComplete = (lessonId) => {
    return progress.completedLessons?.includes(lessonId)
  }

  const isLessonLocked = (moduleIndex, lessonIndex) => {
    if (!isEnrolled) return true
    if (moduleIndex === 0 && lessonIndex === 0) return false
    
    // Check if previous lesson is complete
    const currentModule = modules[moduleIndex]
    if (lessonIndex > 0) {
      const prevLessonId = currentModule.lessons[lessonIndex - 1]._id
      return !isLessonComplete(prevLessonId)
    }
    
    // Check if previous module's last lesson is complete
    if (moduleIndex > 0) {
      const prevModule = modules[moduleIndex - 1]
      const lastLessonId = prevModule.lessons[prevModule.lessons.length - 1]._id
      return !isLessonComplete(lastLessonId)
    }
    
    return false
  }

  const getModuleProgress = (module) => {
    if (!progress.completedLessons?.length) return 0
    const completedInModule = module.lessons.filter(l => 
      progress.completedLessons.includes(l._id)
    ).length
    return Math.round((completedInModule / module.lessons.length) * 100)
  }

  return (
    <div className="space-y-4">
      {modules.map((module, moduleIndex) => {
        const isExpanded = expandedModules.includes(moduleIndex)
        const moduleProgress = getModuleProgress(module)
        
        return (
          <div 
            key={module._id || moduleIndex} 
            className="border border-white/10 rounded-xl overflow-hidden bg-gray-800/50"
          >
            {/* Module Header */}
            <button
              onClick={() => toggleModule(moduleIndex)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary-light font-bold">
                  {moduleIndex + 1}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">{module.title}</h3>
                  <p className="text-sm text-gray-400">
                    {module.lessons.length} lessons • {module.duration || '~30 min'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {isEnrolled && (
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal rounded-full transition-all duration-300"
                        style={{ width: `${moduleProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{moduleProgress}%</span>
                  </div>
                )}
                {isExpanded ? (
                  <ChevronUp className="text-gray-400" />
                ) : (
                  <ChevronDown className="text-gray-400" />
                )}
              </div>
            </button>

            {/* Module Lessons */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-white/10"
                >
                  <ul className="divide-y divide-white/5">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isComplete = isLessonComplete(lesson._id)
                      const isLocked = isLessonLocked(moduleIndex, lessonIndex)
                      const Icon = contentTypeIcons[lesson.contentType] || FileText

                      return (
                        <li key={lesson._id || lessonIndex}>
                          <button
                            onClick={() => !isLocked && onLessonClick?.(lesson)}
                            disabled={isLocked}
                            className={`w-full p-4 pl-8 flex items-center gap-4 transition-colors ${
                              isLocked 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-white/5 cursor-pointer'
                            }`}
                          >
                            {/* Status indicator */}
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                              isComplete 
                                ? 'bg-teal border-teal text-white' 
                                : isLocked
                                  ? 'border-gray-600 text-gray-600'
                                  : 'border-gray-500 text-gray-500'
                            }`}>
                              {isComplete ? (
                                <Check size={16} />
                              ) : isLocked ? (
                                <Lock size={14} />
                              ) : (
                                <Icon size={14} />
                              )}
                            </div>

                            {/* Lesson info */}
                            <div className="flex-1 text-left">
                              <h4 className={`font-medium ${
                                isComplete ? 'text-gray-400' : 'text-white'
                              }`}>
                                {lesson.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="capitalize">{lesson.contentType}</span>
                                <span>•</span>
                                <span>{lesson.duration || '5 min'}</span>
                              </div>
                            </div>

                            {/* Play button */}
                            {!isLocked && (
                              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-coral/20 text-coral">
                                <Play size={18} fill="currentColor" />
                              </div>
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

CourseModules.propTypes = {
  modules: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    duration: PropTypes.string,
    lessons: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
      contentType: PropTypes.string,
      duration: PropTypes.string,
    })).isRequired,
  })).isRequired,
  progress: PropTypes.shape({
    completedLessons: PropTypes.arrayOf(PropTypes.string),
  }),
  onLessonClick: PropTypes.func,
  isEnrolled: PropTypes.bool,
}

export default CourseModules
