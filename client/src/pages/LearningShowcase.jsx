import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Star,
  Trophy,
  Target,
  Play,
} from 'lucide-react'

/**
 * Showcase Component for New Learning Platform
 */
export default function LearningShowcase() {
  const features = [
    {
      icon: Video,
      title: 'Video Lessons',
      description: 'Watch expert-led YouTube video lessons with auto-play and progress tracking',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: FileText,
      title: 'Theory Notes',
      description: 'Read comprehensive markdown-formatted study materials for each lesson',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: HelpCircle,
      title: 'Interactive MCQs',
      description: 'Test your knowledge with instant feedback, scoring, and unlimited reattempts',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Target,
      title: 'Real-time Progress',
      description:
        'Track your learning journey with automatic progress updates and completion status',
      color: 'from-emerald-500 to-teal-500',
    },
  ]

  const sampleCourses = [
    {
      id: 'ml-101',
      title: 'Machine Learning Fundamentals',
      category: 'Academic Education',
      difficulty: 'Intermediate',
      lessons: 24,
    },
    {
      id: 'yoga-beginners',
      title: 'Yoga for Absolute Beginners',
      category: 'Sports & Fitness',
      difficulty: 'Beginner',
      lessons: 12,
    },
    {
      id: 'web-dev-bootcamp',
      title: 'Complete Web Development Bootcamp',
      category: 'Skill-based Courses',
      difficulty: 'Beginner',
      lessons: 36,
    },
    {
      id: 'upsc-prep',
      title: 'UPSC Civil Services Preparation',
      category: 'Competitive Exams',
      difficulty: 'Advanced',
      lessons: 48,
    },
  ]

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to Vidhya</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              A Professional Learning Platform with Courses, Videos, Notes, and Interactive Quizzes
            </p>
            <Link
              to="/courses-new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Explore All Courses
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Complete Learning Experience
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Everything you need to master new skills in one place
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Sample Courses */}
      <div className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Explore courses across multiple categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/course/${course.id}`}
                  className="block bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        course.difficulty === 'Beginner'
                          ? 'bg-teal/20 text-teal'
                          : course.difficulty === 'Intermediate'
                            ? 'bg-coral/20 text-coral'
                            : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {course.difficulty}
                    </span>
                    <BookOpen size={16} className="text-primary" />
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-sm text-text-secondary mb-4">{course.category}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-text-secondary">{course.lessons} lessons</span>
                    <ArrowRight
                      size={16}
                      className="text-primary group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/courses-new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors"
            >
              View All Courses
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">How It Works</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Simple 3-step learning process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Choose a Course</h3>
            <p className="text-text-secondary">
              Browse courses across categories and select one that interests you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Learn & Practice</h3>
            <p className="text-text-secondary">
              Watch videos, read notes, and test yourself with MCQs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Track Progress</h3>
            <p className="text-text-secondary">
              Monitor your completion status and earn certificates
            </p>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-16">
        <div className="container-custom text-center">
          <Trophy size={64} className="mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of learners mastering new skills with Vidhya
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/courses-new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse Courses
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/course/ml-101"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-lg backdrop-blur-sm transition-colors"
            >
              Try Sample Course
              <Play size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
