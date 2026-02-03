import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Play,
  RotateCcw,
  BookOpen,
} from 'lucide-react'

const mockTests = [
  {
    id: 1,
    title: 'Python Fundamentals Quiz',
    subject: 'Programming',
    difficulty: 'Beginner',
    questions: 10,
    duration: 15,
    passingScore: 70,
  },
  {
    id: 2,
    title: 'Machine Learning Concepts',
    subject: 'AI/ML',
    difficulty: 'Intermediate',
    questions: 15,
    duration: 20,
    passingScore: 75,
  },
  {
    id: 3,
    title: 'Web Development Essentials',
    subject: 'Web Dev',
    difficulty: 'Beginner',
    questions: 12,
    duration: 18,
    passingScore: 70,
  },
]

const sampleQuestions = [
  {
    id: 1,
    question: 'What is Python primarily used for?',
    options: [
      'Mobile app development',
      'Web development, data science, and automation',
      'Only game development',
      'Hardware programming',
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'Which of these is NOT a valid Python data type?',
    options: ['int', 'float', 'string', 'character'],
    correctAnswer: 3,
  },
  {
    id: 3,
    question: 'What does the "len()" function do in Python?',
    options: [
      'Returns the length of an object',
      'Creates a new list',
      'Deletes an item',
      'Sorts a list',
    ],
    correctAnswer: 0,
  },
  {
    id: 4,
    question: 'Which keyword is used to define a function in Python?',
    options: ['function', 'def', 'func', 'define'],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: 'What is the output of: print(type([]))?',
    options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'dict'>"],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: 'Which operator is used for exponentiation in Python?',
    options: ['^', '**', 'exp()', 'pow'],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: 'How do you start a comment in Python?',
    options: ['//', '/*', '#', '<!--'],
    correctAnswer: 2,
  },
  {
    id: 8,
    question: 'Which method is used to add an element to the end of a list?',
    options: ['add()', 'append()', 'push()', 'insert()'],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: 'What does "PEP 8" refer to?',
    options: [
      'Python version 8',
      'Python style guide',
      'Python package manager',
      'Python error code',
    ],
    correctAnswer: 1,
  },
  {
    id: 10,
    question: 'Which statement is used to exit a loop in Python?',
    options: ['exit', 'break', 'stop', 'end'],
    correctAnswer: 1,
  },
]

export default function MockTests() {
  const { isAuthenticated } = useSelector(state => state.user)
  const navigate = useNavigate()
  const [selectedTest, setSelectedTest] = useState(null)
  const [isTestActive, setIsTestActive] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (isTestActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isTestActive && timeLeft === 0) {
      handleSubmitTest()
    }
  }, [timeLeft, isTestActive])

  const handleStartTest = test => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setSelectedTest(test)
    setIsTestActive(true)
    setCurrentQuestion(0)
    setAnswers({})
    setTimeLeft(test.duration * 60)
    setShowResults(false)
  }

  const handleSelectAnswer = answer => {
    setAnswers({ ...answers, [currentQuestion]: answer })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitTest = () => {
    setIsTestActive(false)
    setShowResults(true)
  }

  const calculateResults = () => {
    const total = sampleQuestions.length
    const correct = sampleQuestions.filter((q, i) => answers[i] === q.correctAnswer).length
    const percentage = Math.round((correct / total) * 100)
    const passed = percentage >= (selectedTest?.passingScore || 70)
    return { total, correct, percentage, passed }
  }

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (showResults) {
    const results = calculateResults()
    return (
      <div className="min-h-screen bg-surface-light py-12">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div
              className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                results.passed ? 'bg-emerald-100' : 'bg-red-100'
              }`}
            >
              {results.passed ? (
                <Trophy className="w-10 h-10 text-emerald-600" />
              ) : (
                <AlertCircle className="w-10 h-10 text-red-600" />
              )}
            </div>

            <h2 className="text-3xl font-bold text-text-primary mb-2">
              {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-text-secondary mb-8">
              {results.passed
                ? 'You passed the test!'
                : "You didn't pass this time, but you're improving."}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-surface-light rounded-xl">
                <p className="text-3xl font-bold text-primary">{results.percentage}%</p>
                <p className="text-sm text-text-secondary">Score</p>
              </div>
              <div className="p-4 bg-surface-light rounded-xl">
                <p className="text-3xl font-bold text-emerald-600">{results.correct}</p>
                <p className="text-sm text-text-secondary">Correct</p>
              </div>
              <div className="p-4 bg-surface-light rounded-xl">
                <p className="text-3xl font-bold text-red-600">{results.total - results.correct}</p>
                <p className="text-sm text-text-secondary">Incorrect</p>
              </div>
            </div>

            <div className="space-y-3 text-left mb-8">
              <h3 className="font-semibold text-text-primary mb-3">Review Answers</h3>
              {sampleQuestions.map((q, i) => {
                const userAnswer = answers[i]
                const isCorrect = userAnswer === q.correctAnswer
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm text-text-primary mb-2">
                          {i + 1}. {q.question}
                        </p>
                        <p className="text-sm text-text-secondary">
                          Your answer:{' '}
                          <span className="font-medium">
                            {q.options[userAnswer] || 'Not answered'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-emerald-600 mt-1">
                            Correct answer:{' '}
                            <span className="font-medium">{q.options[q.correctAnswer]}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleStartTest(selectedTest)}
                className="btn-primary flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Retake Test
              </button>
              <Link
                to="/mock-tests"
                onClick={() => setShowResults(false)}
                className="btn-secondary"
              >
                Back to Tests
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isTestActive && selectedTest) {
    const question = sampleQuestions[currentQuestion]
    const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100

    return (
      <div className="min-h-screen bg-surface-light py-8">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedTest.title}</h2>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <Clock size={18} />
                  <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <p className="text-sm text-text-muted mb-2">
                  Question {currentQuestion + 1} of {sampleQuestions.length}
                </p>
                <h3 className="text-xl font-semibold text-text-primary">{question.question}</h3>
              </div>

              <div className="space-y-3 mb-8">
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectAnswer(i)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[currentQuestion] === i
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion] === i
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}
                      >
                        {answers[currentQuestion] === i && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-text-primary font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                {currentQuestion < sampleQuestions.length - 1 ? (
                  <button onClick={handleNextQuestion} className="btn-primary">
                    Next
                  </button>
                ) : (
                  <button onClick={handleSubmitTest} className="btn-primary">
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 px-4">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Target size={16} />
              <span className="text-sm font-medium">Test Your Knowledge</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Mock Tests</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Practice with timed tests and get instant feedback on your performance
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                    {test.subject}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      test.difficulty === 'Beginner'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {test.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-3">{test.title}</h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <BookOpen size={16} />
                    <span>{test.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock size={16} />
                    <span>{test.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Target size={16} />
                    <span>Pass: {test.passingScore}%</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartTest(test)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Play size={18} />
                  {isAuthenticated ? 'Start Test' : 'Sign in to start'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            Browse courses to prepare for tests
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
