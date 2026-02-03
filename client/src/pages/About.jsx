import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Users,
  Target,
  Sparkles,
  Brain,
  Globe,
  Award,
  Zap,
  Heart,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description:
      'Our advanced AI tutors adapt to your learning style, providing personalized guidance and instant feedback.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Courses',
    description:
      'Access a wide range of courses covering programming, science, mathematics, languages, and more.',
  },
  {
    icon: Users,
    title: 'Expert Instructors',
    description:
      'Learn from industry professionals and experienced educators who are passionate about teaching.',
  },
  {
    icon: Target,
    title: 'Goal-Oriented Learning',
    description:
      'Set clear learning objectives and track your progress with detailed analytics and insights.',
  },
  {
    icon: Zap,
    title: 'Interactive Labs',
    description:
      'Practice concepts hands-on with virtual labs, coding exercises, and real-world projects.',
  },
  {
    icon: Award,
    title: 'Certifications',
    description:
      'Earn recognized certificates upon course completion to showcase your skills and knowledge.',
  },
]

const stats = [
  { value: '10K+', label: 'Active Learners' },
  { value: '500+', label: 'Courses Available' },
  { value: '50+', label: 'Expert Instructors' },
  { value: '95%', label: 'Success Rate' },
]

const values = [
  {
    title: 'Accessibility',
    description: 'Education should be accessible to everyone, anywhere, anytime.',
  },
  {
    title: 'Innovation',
    description: 'We leverage cutting-edge AI technology to enhance the learning experience.',
  },
  {
    title: 'Quality',
    description: 'We maintain high standards in content creation and delivery.',
  },
  {
    title: 'Community',
    description: 'We foster a supportive learning community where everyone can thrive.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent-cyan rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} />
              <span className="text-sm font-medium">About Vidhya</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Revolutionizing Education with AI
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Vidhya is an innovative e-learning platform that combines artificial intelligence with
              expert instruction to deliver personalized, engaging, and effective learning
              experiences.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Target size={16} />
              <span className="text-sm font-semibold">Our Mission</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Empowering Learners Worldwide
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              Our mission is to make high-quality education accessible to everyone, everywhere. We
              believe that learning should be personalized, engaging, and available on demand.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              Through the power of AI and the expertise of passionate educators, we're transforming
              how people learn, grow, and achieve their goals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-surface-light py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Choose Vidhya?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Who We Serve</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Vidhya is designed for learners of all backgrounds and skill levels
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: 'Students',
              description:
                'From K-12 to higher education, master subjects at your own pace with personalized AI tutoring.',
            },
            {
              icon: TrendingUp,
              title: 'Professionals',
              description:
                'Upskill and stay competitive with industry-relevant courses and certifications.',
            },
            {
              icon: Heart,
              title: 'Lifelong Learners',
              description:
                'Explore new interests and expand your knowledge with our diverse course catalog.',
            },
          ].map((audience, i) => {
            const Icon = audience.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{audience.title}</h3>
                <p className="text-text-secondary">{audience.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-br from-primary/5 to-accent-cyan/5 py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Our Values</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">{value.title}</h3>
                    <p className="text-text-secondary">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 text-center text-white"
        >
          <Globe size={48} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of learners worldwide who are achieving their goals with Vidhya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/courses"
              className="px-8 py-4 bg-white/10 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
