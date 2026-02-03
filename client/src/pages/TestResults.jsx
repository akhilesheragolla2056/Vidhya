import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle, ArrowRight, Download, RotateCcw } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function TestResults() {
  const { testId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const attemptResult = location.state

  const { data: testData } = useQuery({
    queryKey: ['test', testId],
    queryFn: async () => {
      const res = await api.get(`/tests/${testId}`)
      return res.data.data
    },
  })

  if (!attemptResult || !testData) {
    return <LoadingSpinner />
  }

  const { score, totalPoints, percentage, isPassed } = attemptResult
  const passing = testData.passingScore

  // Calculate badge color based on score
  const getBadgeColor = () => {
    if (percentage >= 90) return 'from-green-400 to-green-600'
    if (percentage >= 80) return 'from-blue-400 to-blue-600'
    if (percentage >= 70) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  const getPassStatus = () => {
    if (isPassed) {
      return {
        title: 'Congratulations!',
        message: 'You passed the test',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      }
    }
    return {
      title: 'Test Not Passed',
      message: `You need ${passing}% to pass. Keep practicing!`,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    }
  }

  const status = getPassStatus()
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Result Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className={`bg-gradient-to-r ${getBadgeColor()} text-white p-12`}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-white/80 mb-2">{testData.title}</p>
                <h1 className="text-5xl font-bold">Test Results</h1>
              </div>
              <StatusIcon size={64} className="text-white/80" />
            </div>
          </div>

          {/* Results Content */}
          <div className="p-12">
            {/* Pass/Fail Status */}
            <div
              className={`${status.bgColor} border-2 ${status.borderColor} rounded-2xl p-8 mb-12`}
            >
              <p className={`text-2xl font-bold ${status.color} mb-2`}>{status.title}</p>
              <p className={`text-lg ${status.color}`}>{status.message}</p>
            </div>

            {/* Score Circle */}
            <div className="flex justify-center mb-12">
              <div className="relative w-48 h-48">
                <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${percentage * 5.65} 565`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B5BDB" />
                      <stop offset="100%" stopColor="#364FC7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold text-text-primary">{percentage}%</p>
                  <p className="text-text-secondary text-sm mt-2">Score</p>
                </div>
              </div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 pb-12 border-b">
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-text-secondary text-sm mb-1">Points Scored</p>
                <p className="text-3xl font-bold text-primary">{score}</p>
                <p className="text-text-secondary text-sm mt-1">out of {totalPoints}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <p className="text-text-secondary text-sm mb-1">Passing Score</p>
                <p className="text-3xl font-bold text-green-600">{passing}%</p>
                <p className="text-text-secondary text-sm mt-1">
                  {isPassed ? '✓ Passed' : '✗ Not Passed'}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-6">
                <p className="text-text-secondary text-sm mb-1">Correct Answers</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {attemptResult.attempt.answers.filter(a => a.isCorrect).length}
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  out of {testData.questions.length}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isPassed ? (
                <button
                  onClick={() => navigate('/certificates')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Download size={20} />
                  Get Certificate
                </button>
              ) : (
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <RotateCcw size={20} />
                  Retake Test
                </button>
              )}
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-text-primary rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Back to Dashboard
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Question Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Question Summary</h2>
          <div className="space-y-3">
            {testData.questions.map((question, idx) => {
              const answer = attemptResult.attempt.answers[idx]
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 ${
                    answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {answer.isCorrect ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <XCircle className="text-red-600" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary">
                      Q{idx + 1}. {question.question}
                    </p>
                    <div className="mt-2 text-sm">
                      <p className="text-text-secondary">
                        Your answer:{' '}
                        <span className="font-medium text-text-primary">
                          {Array.isArray(answer.selectedAnswer)
                            ? answer.selectedAnswer.join(', ')
                            : answer.selectedAnswer}
                        </span>
                      </p>
                      {!answer.isCorrect && (
                        <p className="text-green-600 mt-1">
                          Correct answer:{' '}
                          <span className="font-medium">
                            {Array.isArray(question.correctAnswer)
                              ? question.correctAnswer.join(', ')
                              : question.correctAnswer}
                          </span>
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-2">
                      Points: {answer.pointsScored}/{question.points}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestResults
