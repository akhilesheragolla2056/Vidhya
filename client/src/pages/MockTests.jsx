import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
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
import api from '../services/api'

const mockTests = [
  {
    id: 1,
    title: 'Python Fundamentals Quiz',
    subject: 'Programming',
    difficulty: 'Beginner',
    questions: 10,
    duration: 15,
    passingScore: 70,
    questionBank: 'python',
  },
  {
    id: 2,
    title: 'Machine Learning Concepts',
    subject: 'AI/ML',
    difficulty: 'Intermediate',
    questions: 15,
    duration: 20,
    passingScore: 75,
    questionBank: 'machineLearning',
  },
  {
    id: 3,
    title: 'Web Development Essentials',
    subject: 'Web Dev',
    difficulty: 'Beginner',
    questions: 12,
    duration: 18,
    passingScore: 70,
    questionBank: 'webDevelopment',
  },
  {
    id: 4,
    title: 'BSc Agriculture: Soil Science Mock Test',
    subject: 'Agriculture',
    difficulty: 'Beginner',
    questions: 10,
    duration: 20,
    passingScore: 70,
    questionBank: 'soilScience',
  },
  {
    id: 5,
    title: 'BSc Agriculture: Agronomy Mock Test',
    subject: 'Agriculture',
    difficulty: 'Intermediate',
    questions: 10,
    duration: 20,
    passingScore: 75,
    questionBank: 'agronomy',
  },
  {
    id: 6,
    title: 'BSc Agriculture: Plant Pathology Mock Test',
    subject: 'Agriculture',
    difficulty: 'Intermediate',
    questions: 10,
    duration: 22,
    passingScore: 75,
    questionBank: 'plantPathology',
  },
]

const questionBanks = {
  python: [
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
  ],
  machineLearning: [
    { id: 1, question: 'What is supervised learning?', options: ['Learning from labeled examples', 'Learning without any data', 'Grouping data by distance only', 'Writing rules by hand'], correctAnswer: 0 },
    { id: 2, question: 'Which task is a classification problem?', options: ['Predicting house prices', 'Estimating tomorrow’s temperature', 'Sorting email into spam or not spam', 'Forecasting sales totals'], correctAnswer: 2 },
    { id: 3, question: 'What does a training set help a model do?', options: ['Learn patterns from examples', 'Measure final performance only', 'Store the source code', 'Replace all test data'], correctAnswer: 0 },
    { id: 4, question: 'What is overfitting?', options: ['A model performs well on new data only', 'A model memorizes training data and generalizes poorly', 'A model has too few features', 'A model trains without labels'], correctAnswer: 1 },
    { id: 5, question: 'Why keep a test set separate from training data?', options: ['To make training faster', 'To estimate performance on unseen data', 'To increase the number of labels', 'To avoid choosing a model'], correctAnswer: 1 },
    { id: 6, question: 'Which measure is often useful when classes are imbalanced?', options: ['F1 score', 'File size', 'Training duration', 'Number of columns'], correctAnswer: 0 },
    { id: 7, question: 'What does a feature represent?', options: ['An input attribute used for prediction', 'The answer key only', 'The model’s final score', 'A type of computer hardware'], correctAnswer: 0 },
    { id: 8, question: 'What is an example of unsupervised learning?', options: ['Clustering customers by behavior', 'Predicting labeled exam results', 'Classifying known flower species', 'Detecting spam from labeled emails'], correctAnswer: 0 },
    { id: 9, question: 'What does a loss function measure?', options: ['How far predictions are from target values', 'How much memory a screen uses', 'How many rows are in a file', 'How quickly users enter data'], correctAnswer: 0 },
    { id: 10, question: 'What is regularization used for?', options: ['Reducing overfitting', 'Adding duplicate data', 'Removing the test set', 'Increasing label noise'], correctAnswer: 0 },
    { id: 11, question: 'What is cross-validation useful for?', options: ['Comparing model performance across data splits', 'Encrypting datasets', 'Writing labels automatically', 'Replacing feature selection'], correctAnswer: 0 },
    { id: 12, question: 'Which algorithm is commonly used for a simple binary classifier?', options: ['Logistic regression', 'K-means', 'Principal component analysis', 'Apriori'], correctAnswer: 0 },
    { id: 13, question: 'What does a neural network learn during training?', options: ['Weights that map inputs to predictions', 'The computer’s operating system', 'A fixed list of answers', 'The order of rows in a file'], correctAnswer: 0 },
    { id: 14, question: 'What is data leakage?', options: ['Training uses information that would not be available at prediction time', 'A dataset has a missing file extension', 'A model uses too few features', 'A chart displays the wrong color'], correctAnswer: 0 },
    { id: 15, question: 'Why scale numeric features for some algorithms?', options: ['To put values on comparable ranges', 'To turn labels into images', 'To remove the need for evaluation', 'To guarantee perfect predictions'], correctAnswer: 0 },
  ],
  webDevelopment: [
    { id: 1, question: 'What is HTML primarily used to define?', options: ['Page structure and content', 'Database queries', 'Network routing', 'Image compression'], correctAnswer: 0 },
    { id: 2, question: 'Which HTML element is best for a page’s main navigation?', options: ['<nav>', '<span>', '<small>', '<canvas>'], correctAnswer: 0 },
    { id: 3, question: 'What does CSS control?', options: ['Presentation and layout', 'Server authentication', 'Database storage', 'DNS records'], correctAnswer: 0 },
    { id: 4, question: 'Which CSS layout tool is designed for arranging items in one dimension?', options: ['Flexbox', 'SQL', 'SVG', 'WebSocket'], correctAnswer: 0 },
    { id: 5, question: 'What does JavaScript commonly add to a web page?', options: ['Interactive behavior', 'A domain name', 'A database server', 'A browser engine'], correctAnswer: 0 },
    { id: 6, question: 'What does the DOM represent?', options: ['A structured representation of a page that scripts can access', 'A CSS color palette', 'A web hosting plan', 'A media file format'], correctAnswer: 0 },
    { id: 7, question: 'What is responsive design?', options: ['A layout that adapts to different screen sizes', 'A page that only works on phones', 'A faster database query', 'A type of image format'], correctAnswer: 0 },
    { id: 8, question: 'What does HTTPS add to HTTP?', options: ['Encrypted transport using TLS', 'Automatic image editing', 'A new HTML version', 'A larger screen resolution'], correctAnswer: 0 },
    { id: 9, question: 'Why should a form input have an associated label?', options: ['It improves usability and accessible identification', 'It changes the server language', 'It compresses the submitted data', 'It hides validation messages'], correctAnswer: 0 },
    { id: 10, question: 'What is an accessible purpose for image alt text?', options: ['Describe meaningful image content to users who cannot see it', 'Set the image’s file size', 'Choose its CSS position', 'Make every image decorative'], correctAnswer: 0 },
    { id: 11, question: 'What is Git commonly used for?', options: ['Tracking changes to source code', 'Styling web pages', 'Serving domain names', 'Editing database schemas in production'], correctAnswer: 0 },
    { id: 12, question: 'Which HTML attribute helps a responsive page match the device viewport?', options: ['name="viewport"', 'role="button"', 'alt="responsive"', 'target="viewport"'], correctAnswer: 0 },
  ],
  soilScience: [
    {
      id: 1,
      question: 'Which horizon is generally rich in organic matter?',
      options: ['C horizon', 'A horizon', 'R horizon', 'B horizon'],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: 'Sandy soils are known for:',
      options: ['High water retention', 'Poor drainage', 'Quick drainage', 'High clay content'],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: 'The ideal pH range for most field crops is approximately:',
      options: ['3.0-4.0', '6.0-7.5', '8.5-9.5', '9.5-10.5'],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: 'Which nutrient is represented by the letter P in NPK?',
      options: ['Potassium', 'Phosphorus', 'Protein', 'Peroxide'],
      correctAnswer: 1,
    },
    {
      id: 5,
      question: 'Soil testing is mainly done to:',
      options: ['Count insects', 'Predict rainfall', 'Assess nutrient status', 'Increase salinity'],
      correctAnswer: 2,
    },
    {
      id: 6,
      question: 'A loamy soil is preferred because it has:',
      options: ['Only sand', 'Balanced sand, silt, and clay', 'Only clay', 'No pores'],
      correctAnswer: 1,
    },
    {
      id: 7,
      question: 'Which practice improves soil organic carbon?',
      options: ['Burning residues', 'Compost application', 'Over-tillage', 'Excess urea only'],
      correctAnswer: 1,
    },
    {
      id: 8,
      question: 'Nitrogen deficiency commonly causes:',
      options: ['Yellowing of older leaves', 'Purple flowers', 'Leaf wax increase', 'Root swelling'],
      correctAnswer: 0,
    },
    {
      id: 9,
      question: 'Micronutrients are needed in:',
      options: ['Very large quantities', 'Moderate quantities', 'Small quantities', 'No quantities'],
      correctAnswer: 2,
    },
    {
      id: 10,
      question: 'Green manuring primarily helps to:',
      options: ['Reduce sunlight', 'Increase soil fertility', 'Harden soil', 'Destroy all microbes'],
      correctAnswer: 1,
    },
  ],
  agronomy: [
    {
      id: 1,
      question: 'Line sowing is preferred over broadcasting because it:',
      options: ['Needs no seed', 'Improves crop geometry', 'Stops irrigation', 'Removes fertilizer need'],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: 'Critical crop-weed competition period is important because:',
      options: ['Weeds help yield', 'Early weed competition cuts yield', 'Weeds store water', 'Weeds fix all nutrients'],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: 'Which irrigation method is most efficient in water use?',
      options: ['Flood', 'Check basin', 'Drip', 'Furrow'],
      correctAnswer: 2,
    },
    {
      id: 4,
      question: 'Seed treatment is done to:',
      options: ['Color seeds only', 'Protect against seed-borne diseases', 'Increase seed size', 'Reduce germination'],
      correctAnswer: 1,
    },
    {
      id: 5,
      question: 'Intercropping can help in:',
      options: ['Lower biodiversity', 'Better resource use', 'No yield stability', 'Weed increase only'],
      correctAnswer: 1,
    },
    {
      id: 6,
      question: 'A wider plant spacing usually causes:',
      options: ['No sunlight', 'Lower air movement', 'Reduced plant population', 'Higher competition'],
      correctAnswer: 2,
    },
    {
      id: 7,
      question: 'Mulching helps to:',
      options: ['Increase evaporation', 'Conserve soil moisture', 'Increase erosion', 'Remove root growth'],
      correctAnswer: 1,
    },
    {
      id: 8,
      question: 'Crop rotation mainly supports:',
      options: ['Continuous pest buildup', 'Improved soil health', 'Single crop dominance', 'Nutrient mining'],
      correctAnswer: 1,
    },
    {
      id: 9,
      question: 'The best time to irrigate many crops is:',
      options: ['At random', 'At critical growth stages', 'Only after harvest', 'Never'],
      correctAnswer: 1,
    },
    {
      id: 10,
      question: 'Integrated weed management combines:',
      options: ['Only herbicides', 'Only hand weeding', 'Multiple control methods', 'No field practices'],
      correctAnswer: 2,
    },
  ],
  plantPathology: [
    {
      id: 1,
      question: 'The disease triangle includes host, pathogen, and:',
      options: ['Market', 'Environment', 'Machinery', 'Fertilizer'],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: 'Rusts in crops are typically caused by:',
      options: ['Bacteria', 'Viruses', 'Fungi', 'Nematodes'],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: 'Seed treatment is a key step in:',
      options: ['Disease prevention', 'Harvesting', 'Marketing', 'Irrigation design'],
      correctAnswer: 0,
    },
    {
      id: 4,
      question: 'Removing infected crop residue is part of:',
      options: ['Field sanitation', 'Over-irrigation', 'Monocropping', 'Late sowing'],
      correctAnswer: 0,
    },
    {
      id: 5,
      question: 'Late blight in potato is favored by:',
      options: ['Hot dry weather', 'Cool humid weather', 'Strong winds only', 'High soil pH only'],
      correctAnswer: 1,
    },
    {
      id: 6,
      question: 'Integrated Disease Management emphasizes:',
      options: ['One chemical only', 'Multiple compatible strategies', 'No monitoring', 'Only resistant seed'],
      correctAnswer: 1,
    },
    {
      id: 7,
      question: 'A common sign of wilt disease is:',
      options: ['Healthy turgor', 'Leaf curling and drooping', 'Blue pigmentation', 'Stronger stem only'],
      correctAnswer: 1,
    },
    {
      id: 8,
      question: 'Crop rotation helps disease management by:',
      options: ['Maintaining same host', 'Breaking pathogen cycles', 'Increasing humidity', 'Reducing sunlight'],
      correctAnswer: 1,
    },
    {
      id: 9,
      question: 'Field scouting should be done:',
      options: ['Only at harvest', 'Regularly during crop growth', 'Never in rainy season', 'Only after pesticide spray'],
      correctAnswer: 1,
    },
    {
      id: 10,
      question: 'Which is a preventive practice?',
      options: ['Using certified seed', 'Ignoring symptoms', 'Dense canopy always', 'Continuous same crop'],
      correctAnswer: 0,
    },
  ],
}

const getQuestionsForTest = test => questionBanks[test?.questionBank] || questionBanks.python

export default function MockTests() {
  const { isAuthenticated } = useSelector(state => state.user)
  const navigate = useNavigate()
  const {
    data: publishedTests = [],
    isError: publishedTestsError,
  } = useQuery({
    queryKey: ['published-tests'],
    queryFn: async () => {
      const response = await api.get('/tests')
      return Array.isArray(response.data?.data) ? response.data.data : []
    },
  })
  const [selectedTest, setSelectedTest] = useState(null)
  const [isTestActive, setIsTestActive] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const activeQuestions = getQuestionsForTest(selectedTest)

  useEffect(() => {
    if (!isTestActive) return undefined
    if (timeLeft <= 0) {
      setIsTestActive(false)
      setShowResults(true)
      return undefined
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
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
    if (currentQuestion < activeQuestions.length - 1) {
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
    const total = activeQuestions.length
    const correct = activeQuestions.filter((q, i) => answers[i] === q.correctAnswer).length
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
              {activeQuestions.map((q, i) => {
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
    const question = activeQuestions[currentQuestion]
    const progress = ((currentQuestion + 1) / activeQuestions.length) * 100

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
                  Question {currentQuestion + 1} of {activeQuestions.length}
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
                {currentQuestion < activeQuestions.length - 1 ? (
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
        <section className="mb-12" aria-labelledby="published-assessments-heading">
          <div className="mb-5">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">From your courses</p>
            <h2 id="published-assessments-heading" className="text-2xl font-bold text-text-primary">
              Published assessments
            </h2>
            <p className="mt-1 text-text-secondary">Assessments created for courses are available here.</p>
          </div>

          {publishedTestsError ? (
            <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Published assessments could not be loaded. Your sample mock tests are still available below.
            </div>
          ) : publishedTests.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {publishedTests.map(test => (
                <article key={test._id} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {test.course?.category || 'Course assessment'}
                    </span>
                    {test.course?.title && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-text-secondary">
                        {test.course.title}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-text-primary">{test.title}</h3>
                  <p className="mb-5 flex-1 text-sm leading-6 text-text-secondary">
                    {test.description || 'Check your understanding of this course with a timed assessment.'}
                  </p>
                  <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary">
                    <span className="inline-flex items-center gap-1.5"><BookOpen size={15} />{test.totalQuestions} questions</span>
                    <span className="inline-flex items-center gap-1.5"><Clock size={15} />{test.duration} min</span>
                    <span className="inline-flex items-center gap-1.5"><Target size={15} />Pass {test.passingScore}%</span>
                  </div>
                  <Link to={`/test/${test._id}`} className="btn-primary inline-flex items-center justify-center gap-2">
                    <Play size={17} /> Start assessment
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-gray-300 bg-white p-5 text-sm text-text-secondary">
              No course assessments have been published yet.
            </p>
          )}
        </section>

        <div className="mb-5">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Practice anytime</p>
          <h2 className="text-2xl font-bold text-text-primary">Sample mock tests</h2>
          <p className="mt-1 text-text-secondary">Use these practice tests to review core topics at your own pace.</p>
        </div>
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
