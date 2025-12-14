import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  ChevronDown,
  Sparkles,
  Brain,
  Target,
  BookOpen,
  Users,
  Award,
  Zap,
  CheckCircle2,
  Star
} from 'lucide-react'

const stats = [
  { value: '42', suffix: '+', label: 'Practice', sublabel: 'Tools' },
  { value: '1K', suffix: '+', label: 'Demo Sessions', sublabel: 'Created' },
  { value: '5', suffix: '+', label: 'Months of', sublabel: 'Development' },
  { value: '3', suffix: '', label: 'Built by', sublabel: 'Passionate Devs' },
]

const features = [
  {
    title: 'Effective, bite-sized lessons',
    description: 'Our AI tutor crafts personalized learning paths to help you master new skills efficiently.',
    bgColor: 'bg-gradient-to-br from-cyan-400 to-cyan-500',
    icon: Zap,
  },
  {
    title: 'Inspired learning, affordable pricing',
    description: 'Personal tutoring is not a luxury anymore. Start your journey for as little as the price of a cup of coffee.',
    bgColor: 'bg-gradient-to-br from-pink-400 to-pink-500',
    icon: Sparkles,
  },
  {
    title: 'Real-life skills for success',
    description: 'Learn practical skills that translate directly to career advancement and personal growth.',
    bgColor: 'bg-gradient-to-br from-orange-400 to-orange-500',
    icon: Target,
  },
]

const capabilities = [
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description: 'Adaptive algorithms that understand your learning style and pace.'
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Courses',
    description: 'From programming to science, explore a wide range of subjects.'
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Get help when you need it from our AI assistants.'
  },
  {
    icon: Award,
    title: 'Track Progress',
    description: 'Visualize your growth with detailed analytics and achievements.'
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Computer Science Student',
    content: 'Vidhya helped me understand complex algorithms in a way my textbooks never could. The AI explanations are incredibly clear!',
    rating: 5,
  },
  {
    name: 'James K.',
    role: 'Working Professional',
    content: 'I use Vidhya during my commute. The bite-sized lessons are perfect for busy schedules.',
    rating: 5,
  },
  {
    name: 'Priya R.',
    role: 'High School Teacher',
    content: 'I recommend Vidhya to all my students. It adapts to each learner\'s needs beautifully.',
    rating: 5,
  },
]

const faqs = [
  { question: 'What is Vidhya AI Tutor?', answer: 'Vidhya is an AI-powered learning platform that creates personalized courses tailored to your learning style and goals.' },
  { question: 'How does Vidhya personalize the learning?', answer: 'Our AI analyzes your learning patterns, preferences, and progress to create custom learning paths that adapt in real-time.' },
  { question: 'Which subjects does Vidhya cover?', answer: 'Vidhya covers a wide range of subjects including programming, data science, mathematics, languages, business, and more.' },
  { question: 'Is Vidhya for all ages?', answer: 'Yes, Vidhya is designed for learners of all ages, from K-12 students to working professionals.' },
  { question: 'How do I sign up for Vidhya?', answer: 'Simply click the Get Started button and create your free account to begin your learning journey.' },
  { question: 'What are the subscription plans of Vidhya?', answer: 'We offer flexible plans including a free tier, monthly subscription, and annual plans with significant savings.' },
  { question: 'Can I cancel my Vidhya subscription anytime?', answer: 'Yes, you can cancel your subscription at any time with no questions asked.' },
  { question: 'Do you offer plans for schools or universities?', answer: 'Not yet. This is currently an early-stage prototype. Institution plans may be added in the future.' },
]

function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute -left-40 -top-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 top-20 w-80 h-80 bg-accent-cyan/30 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 bottom-0 w-[600px] h-[600px] bg-accent-pink/20 rounded-full blur-3xl -translate-x-1/2"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating Shapes */}
      <motion.div
        className="absolute left-[10%] top-[20%] w-16 h-16 hidden lg:block"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl shadow-lg" />
      </motion.div>
      
      <motion.div
        className="absolute right-[15%] top-[25%] w-12 h-12 hidden lg:block"
        animate={{ y: [0, 15, 0], rotate: [45, 50, 45] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-500 rotate-45 shadow-lg" />
      </motion.div>
      
      <motion.div
        className="absolute left-[20%] bottom-[30%] w-20 h-20 hidden lg:block"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-lg" />
      </motion.div>
      
      <motion.div
        className="absolute right-[10%] bottom-[25%] w-14 h-14 hidden lg:block"
        animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,0 100,100 0,100" className="fill-yellow-400" />
        </svg>
      </motion.div>
    </div>
  )
}

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="mb-3">
      <button
        onClick={onClick}
        className="w-full faq-item flex items-center justify-between"
      >
        <span className="text-left font-medium">{question}</span>
        <div className={`accordion-icon transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 bg-blue-100 text-text-primary rounded-b-xl">
          {answer}
        </div>
      </motion.div>
    </div>
  )
}

function FeatureCard({ feature, index }) {
  const Icon = feature.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-3xl p-8 md:p-10 ${feature.bgColor} shadow-xl`}
    >
      <div className="absolute -right-8 -bottom-8 opacity-20">
        <Icon size={200} strokeWidth={1} />
      </div>
      
      <div className="relative z-10 flex items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <Icon size={32} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {feature.title}
          </h3>
          <p className="text-white/90 text-lg">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function CapabilityCard({ capability, index }) {
  const Icon = capability.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4">
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{capability.title}</h3>
      <p className="text-gray-600">{capability.description}</p>
    </motion.div>
  )
}

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">"{testimonial.content}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold">
          {testimonial.name[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Landing() {
  const [openFAQ, setOpenFAQ] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 py-20">
        <HeroBackground />
        
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles size={16} />
              AI-Powered Learning Platform
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-cyan">
                Next Level
              </span>{' '}
              AI Tutoring
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700 mb-6">
              For Lifelong Learners
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Create a custom learning pathway powered by AI to help you achieve more in school, work, and life.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-shadow">
                Start Learning Free
                <ArrowRight size={20} />
              </Link>
              <Link to="/courses" className="flex items-center gap-2 text-gray-700 hover:text-primary font-medium transition-colors">
                <BookOpen size={20} />
                Browse Courses
              </Link>
            </div>
            
            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-12 text-gray-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="text-sm">Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl py-12 px-8 border border-gray-100"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">
                    {stat.value}<span className="text-primary">{stat.suffix}</span>
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                  <div className="text-gray-500 text-sm">{stat.sublabel}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Capabilities Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with proven learning methods
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, index) => (
              <CapabilityCard key={index} capability={cap} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
          >
            Learn What <span className="text-primary">Interests</span> You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-center text-gray-600 mb-12"
          >
            In as little as 10 minutes a day
          </motion.p>
          
          <div className="space-y-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by <span className="text-primary">Learners</span>
            </h2>
            <p className="text-xl text-gray-600">
              See what our community has to say
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-10">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl py-16 px-8 overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-cyan rounded-full blur-3xl" />
            </div>
            
            <div className="text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of learners already using Vidhya to achieve their goals
              </p>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                Get Started for Free
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
