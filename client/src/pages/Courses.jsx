import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Clock, 
  Search, 
  BookOpen, 
  Users, 
  Star,
  ArrowRight,
  Sparkles,
  Brain,
  Code,
  Languages,
  Heart,
  Briefcase,
  TrendingUp,
  Filter,
  Grid3X3,
  LayoutList
} from 'lucide-react'

// Course Data
const coursesData = [
  {
    id: 1,
    title: 'Principles of Happiness',
    description: 'Explore the fundamental principles of achieving and maintaining happiness through psychology, practical strategies, and mindfulness techniques.',
    level: 'Beginner',
    duration: '4 weeks',
    category: 'Personal Development',
    icon: Heart,
    lessons: 12,
    students: 2840,
    rating: 4.8,
    color: 'from-pink-500 to-rose-500',
    featured: true,
  },
  {
    id: 2,
    title: 'Introduction to Machine Learning',
    description: 'A comprehensive introduction to machine learning fundamentals, algorithms, and real-world applications. Perfect for beginners starting their AI journey.',
    level: 'Beginner',
    duration: '8 weeks',
    category: 'AI/ML',
    icon: Brain,
    lessons: 34,
    students: 5620,
    rating: 4.9,
    color: 'from-violet-500 to-purple-500',
    featured: true,
  },
  {
    id: 3,
    title: 'Python Programming Fundamentals',
    description: 'Learn Python from scratch with hands-on projects. Cover variables, data types, control flow, functions, and object-oriented programming.',
    level: 'Beginner',
    duration: '6 weeks',
    category: 'Programming',
    icon: Code,
    lessons: 28,
    students: 8930,
    rating: 4.9,
    color: 'from-blue-500 to-cyan-500',
    featured: true,
  },
  {
    id: 4,
    title: 'Intermediate French Grammar',
    description: 'Deepen your French knowledge with intermediate grammar topics. Enhance writing and speaking skills for greater fluency.',
    level: 'Intermediate',
    duration: '6 weeks',
    category: 'Languages',
    icon: Languages,
    lessons: 24,
    students: 1560,
    rating: 4.7,
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 5,
    title: 'Productivity Mastery',
    description: 'Master productivity techniques and digital tools to effectively manage tasks and time in the modern workplace.',
    level: 'Beginner',
    duration: '3 weeks',
    category: 'Professional Skills',
    icon: Briefcase,
    lessons: 15,
    students: 3420,
    rating: 4.6,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 6,
    title: 'Mindfulness and Stress Management',
    description: 'Practical tools and techniques for managing stress and enhancing mindfulness for professionals.',
    level: 'Beginner',
    duration: '4 weeks',
    category: 'Wellness',
    icon: Heart,
    lessons: 16,
    students: 2180,
    rating: 4.8,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 7,
    title: 'Data Science with Python',
    description: 'Master data science using Python with pandas, numpy, matplotlib, and scikit-learn. Analyze datasets and build predictive models.',
    level: 'Intermediate',
    duration: '8 weeks',
    category: 'Data Science',
    icon: TrendingUp,
    lessons: 32,
    students: 4210,
    rating: 4.8,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    id: 8,
    title: 'Web Development Bootcamp',
    description: 'Comprehensive course covering HTML, CSS, JavaScript, React, and Node.js. Build responsive websites and full-stack applications.',
    level: 'Beginner',
    duration: '10 weeks',
    category: 'Web Development',
    icon: Code,
    lessons: 48,
    students: 7650,
    rating: 4.9,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 9,
    title: 'Advanced Machine Learning',
    description: 'Deep dive into advanced ML techniques including neural networks, deep learning, and cutting-edge algorithms.',
    level: 'Advanced',
    duration: '10 weeks',
    category: 'AI/ML',
    icon: Brain,
    lessons: 42,
    students: 2890,
    rating: 4.7,
    color: 'from-purple-500 to-pink-500',
  },
]

const categories = [
  'All',
  'AI/ML',
  'Programming',
  'Data Science',
  'Web Development',
  'Languages',
  'Personal Development',
  'Professional Skills',
  'Wellness',
]

// Featured Course Card
function FeaturedCourseCard({ course, index }) {
  const Icon = course.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/courses/${course.id}`}
        className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-90`} />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        
        <div className="relative p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Icon size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star size={14} className="text-yellow-300 fill-yellow-300" />
              <span className="text-white text-sm font-medium">{course.rating}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 group-hover:underline">
            {course.title}
          </h3>
          
          <p className="text-white/80 text-sm mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>
          
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <BookOpen size={14} />
              {course.lessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              {course.students.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {course.duration}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Regular Course Card
function CourseCard({ course, index, viewMode }) {
  const Icon = course.icon

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link
          to={`/courses/${course.id}`}
          className="group flex items-center gap-6 bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 hover:border-primary/30 transition-all duration-300"
        >
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0`}>
            <Icon size={28} className="text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                {course.title}
              </h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                course.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {course.level}
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-1 mb-2">
              {course.description}
            </p>
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                {course.lessons} lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                {course.rating}
              </span>
            </div>
          </div>
          
          <ArrowRight size={20} className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/courses/${course.id}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-primary/30 transition-all duration-300 h-full"
      >
        <div className={`h-2 bg-gradient-to-r ${course.color}`} />
        
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center`}>
              <Icon size={24} className="text-white" />
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
              course.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {course.level}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                {course.lessons}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {course.duration}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-700">{course.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function Courses() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  
  const featuredCourses = coursesData.filter(c => c.featured)
  
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-16 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-cyan rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              AI-Powered Learning Experience
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Explore Our Courses
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Discover courses generated by AI and curated by experts. Start your learning journey today.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 shadow-xl focus:ring-4 focus:ring-white/30 outline-none transition-all"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid md:grid-cols-3 gap-4">
          {featuredCourses.map((course, index) => (
            <FeaturedCourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </div>

      {/* Filters and Course Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LayoutList size={20} />
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-600 mb-6">
          Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
          {selectedCategory !== 'All' && <> in <span className="font-semibold text-primary">{selectedCategory}</span></>}
        </p>

        {/* Course Grid */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} viewMode={viewMode} />
            ))}
          </div>
        )}

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-cyan rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Create a custom course tailored to your learning goals with our AI-powered course generator.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              <Sparkles size={20} />
              Create Custom Course
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Courses
