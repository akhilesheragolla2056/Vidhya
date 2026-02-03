import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Clock, ChevronRight, ChevronLeft, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function TestTaker() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [testStarted, setTestStarted] = useState(false)
  const [startTime, setStartTime] = useState(null)

  // Fetch test
  const { data: testData, isLoading } = useQuery({
    queryKey: ['test', testId],
    queryFn: async () => {
      const res = await api.get(`/tests/${testId}`)
      return res.data.data
    },
  })

  // Submit test
  const submitTestMutation = useMutation({
    mutationFn: async payload => {
      const res = await api.post(`/tests/${testId}/submit`, payload)
      return res.data.data
    },
    onSuccess: result => {
      navigate(`/test-results/${testId}`, { state: result })
    },
  })

  // Initialize timer
  useEffect(() => {
    if (testData && testStarted && !timeLeft) {
      setTimeLeft(testData.duration * 60) // Convert minutes to seconds
      setStartTime(new Date())
    }
  }, [testData, testStarted, timeLeft])

  // Timer countdown
  useEffect(() => {
    if (!testStarted || timeLeft === 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testStarted, timeLeft])

  const handleStartTest = () => {
    setTestStarted(true)
    console.log('Test started')
  }

  const handleAnswerQuestion = answer => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer,
    }))
  }

  const handleSubmitTest = () => {
    const timeSpent = Math.round((testData.duration * 60 - timeLeft) / 60) // in minutes
    submitTestMutation.mutate({
      answers: testData.questions.map((q, idx) => answers[idx]),
      startTime: startTime?.toISOString(),
      timeSpent,
    })
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  const isTimeWarning = timeLeft < 300 // Less than 5 minutes
  const isTimeCritical = timeLeft < 60 // Less than 1 minute

  if (isLoading) return <LoadingSpinner />

  if (!testData) return <div className="text-center py-8">Test not found</div>

  const question = testData.questions[currentQuestion]
  const answered = currentQuestion in answers

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {!testStarted ? (
          // Test Introduction
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto mt-20">
            <h1 className="text-4xl font-bold text-text-primary mb-4">{testData.title}</h1>
            <p className="text-text-secondary text-lg mb-8">{testData.description}</p>

            <div className="space-y-4 mb-8 bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-primary" size={24} />
                <div>
                  <p className="font-semibold text-text-primary">Duration</p>
                  <p className="text-text-secondary">{testData.duration} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <p className="font-semibold text-text-primary">Total Points</p>
                  <p className="text-text-secondary">{testData.totalPoints} points</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-primary" size={24} />
                <div>
                  <p className="font-semibold text-text-primary">Passing Score</p>
                  <p className="text-text-secondary">{testData.passingScore}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="text-orange-500" size={24} />
                <div>
                  <p className="font-semibold text-text-primary">Total Questions</p>
                  <p className="text-text-secondary">{testData.questions.length} questions</p>
                </div>
              </div>
            </div>

            {testData.instructions && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-text-primary mb-2">Instructions</h3>
                <p className="text-text-secondary whitespace-pre-line">{testData.instructions}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleStartTest}
                className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Start Test
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-100 text-text-primary py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Test Taking Interface
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Question Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Header with Timer */}
                <div className="flex justify-between items-center mb-8 pb-6 border-b">
                  <div>
                    <p className="text-text-secondary text-sm">
                      Question {currentQuestion + 1} of {testData.questions.length}
                    </p>
                    <h2 className="text-2xl font-bold text-text-primary">{question.question}</h2>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${
                      isTimeCritical
                        ? 'bg-red-100 text-red-700'
                        : isTimeWarning
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-primary'
                    }`}
                  >
                    <Clock size={20} />
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Question Options */}
                <div className="space-y-3 mb-8">
                  {question.options?.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        answers[currentQuestion] === option
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-primary hover:bg-blue-50'
                      }`}
                    >
                      <input
                        type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                        name={`question-${currentQuestion}`}
                        value={option}
                        checked={
                          question.type === 'multiple'
                            ? Array.isArray(answers[currentQuestion])
                              ? answers[currentQuestion].includes(option)
                              : false
                            : answers[currentQuestion] === option
                        }
                        onChange={e => {
                          if (question.type === 'multiple') {
                            const current = Array.isArray(answers[currentQuestion])
                              ? answers[currentQuestion]
                              : []
                            const updated = e.target.checked
                              ? [...current, option]
                              : current.filter(a => a !== option)
                            handleAnswerQuestion(updated)
                          } else {
                            handleAnswerQuestion(option)
                          }
                        }}
                        className="w-5 h-5 text-primary cursor-pointer"
                      />
                      <span className="ml-4 font-medium text-text-primary">{option}</span>
                    </label>
                  ))}
                </div>

                {/* Navigation and Submit */}
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-text-primary rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  {currentQuestion === testData.questions.length - 1 ? (
                    <button
                      onClick={handleSubmitTest}
                      disabled={submitTestMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                    >
                      <CheckCircle size={20} />
                      {submitTestMutation.isPending ? 'Submitting...' : 'Submit Test'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all"
                    >
                      Next
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Question Navigator Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
                <h3 className="font-semibold text-text-primary mb-4">Questions</h3>
                <div className="grid grid-cols-4 gap-2">
                  {testData.questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all text-sm ${
                        currentQuestion === idx
                          ? 'bg-primary text-white shadow-md'
                          : idx in answers
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 rounded"></div>
                    <span className="text-text-secondary">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 rounded"></div>
                    <span className="text-text-secondary">Not Answered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestTaker
