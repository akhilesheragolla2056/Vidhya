import { useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Award, RotateCcw, ChevronRight, HelpCircle } from 'lucide-react'

/**
 * MCQQuiz Component
 * Interactive multiple-choice quiz with instant feedback and scoring
 */
export default function MCQQuiz({ mcqs, lessonId, courseId, onComplete, previousScore }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)

  if (!mcqs || mcqs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <HelpCircle size={48} className="text-gray-300 mx-auto mb-3" />
        <p className="text-text-secondary">No quiz available for this lesson</p>
      </div>
    )
  }

  const handleSelectAnswer = answerIndex => {
    if (quizCompleted) return

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex,
    })
  }

  const handleSubmitAnswer = () => {
    setShowResult(true)
  }

  const handleNextQuestion = () => {
    setShowResult(false)

    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate final score
      const correctCount = Object.keys(selectedAnswers).filter(
        key => selectedAnswers[key] === mcqs[parseInt(key)].correctAnswer
      ).length

      setScore(correctCount)
      setQuizCompleted(true)

      if (onComplete) {
        onComplete(lessonId, correctCount, mcqs.length)
      }
    }
  }

  const handleRetake = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResult(false)
    setQuizCompleted(false)
    setScore(0)
  }

  const currentMCQ = mcqs[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]
  const isCorrect = selectedAnswer === currentMCQ?.correctAnswer
  const percentage = quizCompleted ? Math.round((score / mcqs.length) * 100) : 0
  const passed = percentage >= 60

  // Quiz Completion Screen
  if (quizCompleted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className={`p-6 ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <div className="text-center">
            {passed ? (
              <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4" />
            ) : (
              <XCircle size={64} className="text-red-500 mx-auto mb-4" />
            )}

            <h2 className="text-3xl font-bold text-text-primary mb-2">
              {passed ? 'Congratulations! 🎉' : 'Keep Practicing!'}
            </h2>

            <p className="text-text-secondary mb-6">
              {passed
                ? 'You have successfully completed this quiz!'
                : 'You need 60% to pass. Review the material and try again.'}
            </p>

            {/* Score Display */}
            <div className="bg-white rounded-xl p-6 mb-6 inline-block">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary mb-2">{percentage}%</p>
                  <p className="text-sm text-text-secondary">Your Score</p>
                </div>
                <div className="h-16 w-px bg-gray-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-text-primary mb-2">
                    {score}/{mcqs.length}
                  </p>
                  <p className="text-sm text-text-secondary">Correct Answers</p>
                </div>
              </div>
            </div>

            {/* Previous Score Comparison */}
            {previousScore && (
              <div className="mb-6">
                <p className="text-sm text-text-secondary">
                  Previous Score: {previousScore.percentage}%
                  {percentage > previousScore.percentage && (
                    <span className="text-emerald-600 ml-2">
                      ↑ Improved by {percentage - previousScore.percentage}%
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-text-primary rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                <RotateCcw size={18} />
                Retake Quiz
              </button>

              {passed && (
                <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors">
                  <Award size={18} />
                  View Certificate
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="p-6 bg-gray-50">
          <h3 className="font-bold text-text-primary mb-4">Answer Review</h3>
          <div className="space-y-3">
            {mcqs.map((mcq, index) => {
              const userAnswer = selectedAnswers[index]
              const isCorrectAnswer = userAnswer === mcq.correctAnswer

              return (
                <div
                  key={mcq.id}
                  className={`p-4 rounded-lg border ${
                    isCorrectAnswer
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrectAnswer ? (
                      <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-text-primary mb-2">
                        Q{index + 1}: {mcq.question}
                      </p>
                      <p className="text-sm text-text-secondary">
                        Your answer:{' '}
                        <span className="font-semibold">{mcq.options[userAnswer]}</span>
                        {!isCorrectAnswer && (
                          <>
                            <br />
                            Correct answer:{' '}
                            <span className="font-semibold text-emerald-600">
                              {mcq.options[mcq.correctAnswer]}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Quiz Question Screen
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent-cyan/10 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <HelpCircle size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Quiz</h3>
              <p className="text-xs text-text-secondary">
                Question {currentQuestion + 1} of {mcqs.length}
              </p>
            </div>
          </div>

          {previousScore && (
            <div className="px-3 py-1 bg-white rounded-full">
              <p className="text-xs text-text-secondary">
                Previous:{' '}
                <span className="font-semibold text-primary">{previousScore.percentage}%</span>
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / mcqs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold text-text-primary mb-6">{currentMCQ.question}</h3>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentMCQ.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const showCorrect = showResult && index === currentMCQ.correctAnswer
                const showWrong = showResult && isSelected && !isCorrect

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      showCorrect
                        ? 'border-emerald-500 bg-emerald-50'
                        : showWrong
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          showCorrect
                            ? 'border-emerald-500 bg-emerald-500'
                            : showWrong
                              ? 'border-red-500 bg-red-500'
                              : isSelected
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                        }`}
                      >
                        {(showCorrect || (showWrong && isSelected)) &&
                          (showCorrect ? (
                            <CheckCircle2 size={16} className="text-white" />
                          ) : (
                            <XCircle size={16} className="text-white" />
                          ))}
                      </div>
                      <span className="text-text-primary font-medium">{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showResult && currentMCQ.explanation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-6 ${
                  isCorrect
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <p className="text-sm font-semibold text-text-primary mb-1">Explanation:</p>
                <p className="text-sm text-text-secondary">{currentMCQ.explanation}</p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === undefined}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {currentQuestion < mcqs.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

MCQQuiz.propTypes = {
  mcqs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      correctAnswer: PropTypes.number.isRequired,
      explanation: PropTypes.string,
    })
  ).isRequired,
  lessonId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  previousScore: PropTypes.shape({
    score: PropTypes.number,
    totalQuestions: PropTypes.number,
    percentage: PropTypes.number,
  }),
}
