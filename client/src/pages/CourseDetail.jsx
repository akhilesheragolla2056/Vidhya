import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  BookOpen,
  PanelLeftClose,
  PanelLeft,
  Flag,
  Bot,
  Copy,
  Folder,
  PenLine,
  Library,
  User,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react'

// Course Database with comprehensive modules and lessons
const coursesDatabase = {
  1: {
    id: 1,
    title: 'Principles of Happiness',
    description: 'This course explores the fundamental principles of achieving and maintaining happiness.',
    level: 'Beginner',
    category: 'Generic',
    modules: [
      {
        id: 1,
        title: '1. Understanding Happiness',
        lessons: [
          { 
            id: 1, 
            title: '1.1 What is Happiness?', 
            completed: true,
            sections: [
              { id: 1, title: '1.1.1 Introduction', content: 'Happiness is a fundamental human experience that has been studied and debated by philosophers, psychologists, and scientists for centuries. In this lesson, we will explore what happiness truly means, how it differs from related concepts like pleasure and contentment, and why understanding happiness is crucial for living a fulfilling life.\n\nWe will examine various definitions of happiness from different cultural and philosophical perspectives. From the ancient Greek concept of eudaimonia (flourishing) to modern psychological theories, happiness has been conceptualized in many ways. By the end of this section, you will have a comprehensive understanding of the multifaceted nature of happiness.' },
              { id: 2, title: '1.1.2 Definition and Key Characteristics', content: 'Happiness can be defined as a state of well-being characterized by positive emotions, life satisfaction, and a sense of meaning and purpose. Key characteristics include positive affect, life satisfaction, and purpose.' },
              { id: 3, title: '1.1.3 Historical Perspectives', content: 'Throughout history, philosophers and thinkers have offered various perspectives on happiness, from Aristotle\'s virtue ethics to utilitarian views of maximizing pleasure.' },
              { id: 4, title: '1.1.4 Conclusion', content: 'Understanding happiness is the first step toward cultivating it in our daily lives. In the next lesson, we will explore the science behind well-being.' },
            ]
          },
          { 
            id: 2, 
            title: '1.2 The Science of Well-being', 
            completed: true,
            sections: [
              { id: 1, title: '1.2.1 Introduction', content: 'Modern psychology has made significant advances in understanding what contributes to human well-being and happiness.' },
              { id: 2, title: '1.2.2 Positive Psychology Foundations', content: 'Learn about the key findings from positive psychology research and how they apply to everyday life.' },
              { id: 3, title: '1.2.3 Conclusion', content: 'The science of well-being provides evidence-based strategies for increasing happiness.' },
            ]
          },
          { 
            id: 3, 
            title: '1.3 Measuring Happiness', 
            completed: false,
            sections: [
              { id: 1, title: '1.3.1 Introduction', content: 'How do researchers measure something as subjective as happiness? This lesson explores the methods and tools used.' },
              { id: 2, title: '1.3.2 Subjective Well-being Scales', content: 'Learn about validated instruments like the Satisfaction with Life Scale and PANAS.' },
              { id: 3, title: '1.3.3 Conclusion', content: 'Understanding how to measure happiness helps us track progress and identify areas for improvement.' },
            ]
          },
        ]
      },
      {
        id: 2,
        title: '2. Psychological Foundations',
        lessons: [
          { id: 4, title: '2.1 Positive Psychology Basics', completed: false, sections: [{ id: 1, title: '2.1.1 Introduction', content: 'An introduction to the field of positive psychology and its key concepts.' }] },
          { id: 5, title: '2.2 Cognitive Patterns', completed: false, sections: [{ id: 1, title: '2.2.1 Introduction', content: 'Understanding how our thought patterns affect our happiness.' }] },
          { id: 6, title: '2.3 Emotional Intelligence', completed: false, sections: [{ id: 1, title: '2.3.1 Introduction', content: 'Developing emotional intelligence for greater well-being.' }] },
        ]
      },
      {
        id: 3,
        title: '3. Practical Strategies',
        lessons: [
          { id: 7, title: '3.1 Gratitude Practices', completed: false, sections: [{ id: 1, title: '3.1.1 Introduction', content: 'Learn evidence-based gratitude practices that boost happiness.' }] },
          { id: 8, title: '3.2 Mindfulness Techniques', completed: false, sections: [{ id: 1, title: '3.2.1 Introduction', content: 'Explore mindfulness meditation and its benefits for well-being.' }] },
          { id: 9, title: '3.3 Building Positive Habits', completed: false, sections: [{ id: 1, title: '3.3.1 Introduction', content: 'Create lasting habits that support long-term happiness.' }] },
        ]
      },
    ]
  },
  2: {
    id: 2,
    title: 'Introduction to Machine Learning',
    description: 'This course provides a comprehensive introduction to the fundamental concepts and techniques of machine learning.',
    level: 'Beginner',
    category: 'Generic',
    modules: [
      {
        id: 1,
        title: '1. Understanding Machine Learning',
        lessons: [
          { 
            id: 1, 
            title: '1.1 What is Machine Learning?', 
            completed: true,
            sections: [
              { id: 1, title: '1.1.1 Introduction', content: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. This foundational lesson introduces you to the core concepts that underpin all machine learning applications.\n\nWe will explore how machine learning differs from traditional programming, understand the types of problems ML can solve, and examine real-world applications that demonstrate its transformative potential.' },
              { id: 2, title: '1.1.2 Definition and Key Characteristics', content: 'Machine learning algorithms build mathematical models based on sample data to make predictions or decisions without being explicitly programmed to perform the task.' },
              { id: 3, title: '1.1.3 Types of Machine Learning', content: 'The three main types are supervised learning, unsupervised learning, and reinforcement learning, each suited for different types of problems.' },
              { id: 4, title: '1.1.4 Conclusion', content: 'Understanding the fundamentals of machine learning prepares you for deeper exploration of specific algorithms and techniques.' },
            ]
          },
          { 
            id: 2, 
            title: '1.2 Types of ML', 
            completed: true,
            sections: [
              { id: 1, title: '1.2.1 Introduction', content: 'Explore the different paradigms of machine learning in depth.' },
              { id: 2, title: '1.2.2 Supervised Learning', content: 'Learn how labeled data is used to train models for classification and regression.' },
              { id: 3, title: '1.2.3 Unsupervised Learning', content: 'Discover how patterns are found in unlabeled data through clustering and dimensionality reduction.' },
              { id: 4, title: '1.2.4 Reinforcement Learning', content: 'Understand how agents learn through trial and error with reward signals.' },
              { id: 5, title: '1.2.5 Conclusion', content: 'Choosing the right type of ML depends on your data and problem requirements.' },
            ]
          },
          { 
            id: 3, 
            title: '1.3 Applications', 
            completed: false,
            sections: [
              { id: 1, title: '1.3.1 Introduction', content: 'Machine learning is transforming industries across the globe.' },
              { id: 2, title: '1.3.2 Healthcare Applications', content: 'From diagnosis to drug discovery, ML is revolutionizing medicine.' },
              { id: 3, title: '1.3.3 Finance Applications', content: 'Fraud detection, trading, and risk assessment powered by ML.' },
              { id: 4, title: '1.3.4 Conclusion', content: 'The applications of ML continue to expand as the technology evolves.' },
            ]
          },
        ]
      },
      {
        id: 2,
        title: '2. Data Preparation And Preprocessing',
        lessons: [
          { 
            id: 4, 
            title: '2.1 Introduction to Data Preparation', 
            completed: false,
            sections: [
              { id: 1, title: '2.1.1 Introduction', content: 'Data preparation is a fundamental step in the machine learning workflow. It involves transforming raw data into a clean and usable format, which is essential for building effective machine learning models. Without high-quality data, even the most sophisticated algorithms are likely to underperform. In this lesson, we will explore the critical role of data preparation in machine learning and understand why it is so important.\n\nWe will also discuss some common challenges encountered during data preparation, such as dealing with missing values, handling outliers, and ensuring data consistency. By the end of this lesson, you will have a comprehensive understanding of the importance of data preparation and be better equipped to handle the initial stages of your machine learning projects.' },
              { id: 2, title: '2.1.2 The Importance of High-Quality Data', content: 'High-quality data is the foundation of successful machine learning models. Without proper data preparation, models may learn incorrect patterns or fail to generalize to new data. The quality of your input data directly affects the quality of your model\'s predictions.' },
              { id: 3, title: '2.1.3 Common Challenges in Data Preparation', content: 'Real-world data is often messy. Common challenges include missing values, outliers, inconsistent formatting, duplicate records, and imbalanced datasets. Understanding these challenges is the first step toward addressing them effectively.' },
              { id: 4, title: '2.1.4 Strategies for Effective Data Preparation', content: 'Effective data preparation involves a systematic approach: data collection, data cleaning, data transformation, and data validation. Each step requires careful attention to maintain data integrity.' },
              { id: 5, title: '2.1.5 Conclusion', content: 'Data preparation may not be the most glamorous part of machine learning, but it is arguably the most important. A well-prepared dataset is the foundation for successful model development.' },
            ]
          },
          { id: 5, title: '2.2 Handling Missing Values', completed: false, sections: [{ id: 1, title: '2.2.1 Introduction', content: 'Learn techniques for identifying and handling missing data in your datasets.' }] },
          { id: 6, title: '2.3 Data Normalization and Standardization', completed: false, sections: [{ id: 1, title: '2.3.1 Introduction', content: 'Understand when and how to scale your features for optimal model performance.' }] },
          { id: 7, title: '2.4 Feature Engineering', completed: false, sections: [{ id: 1, title: '2.4.1 Introduction', content: 'Create new features that can improve your model\'s predictive power.' }] },
          { id: 8, title: '2.5 Encoding Categorical Data', completed: false, sections: [{ id: 1, title: '2.5.1 Introduction', content: 'Transform categorical variables into numerical format for machine learning algorithms.' }] },
        ]
      },
      {
        id: 3,
        title: '3. Supervised Learning Algorithms',
        lessons: [
          { 
            id: 9, 
            title: '3.1 Introduction to Supervised Learning', 
            completed: false,
            sections: [
              { id: 1, title: '3.1.1 Introduction', content: 'Supervised learning is a fundamental concept in the field of machine learning, where the algorithm is trained on a labeled dataset. This means that each training example is paired with an output label. The goal is to learn a mapping from inputs to outputs, enabling the model to make predictions on new, unseen data. In this lesson, we will explore the basics of supervised learning, its significance, and the types of problems it can solve. We will also distinguish between regression and classification tasks, which are two primary categories of supervised learning problems.\n\nUnderstanding supervised learning is crucial because it forms the basis for many real-world applications, such as predicting house prices, detecting spam emails, and diagnosing diseases. By the end of this lesson, you will have a clear understanding of what supervised learning entails and the types of challenges it can address. This foundational knowledge will prepare you for more advanced topics and algorithms in supervised learning.' },
              { id: 2, title: '3.1.2 Definition and Key Characteristics', content: 'Supervised learning uses labeled training data to learn a function that maps inputs to desired outputs. Key characteristics include the need for labeled data, the ability to measure accuracy, and the goal of generalization to new data.' },
              { id: 3, title: '3.1.3 Types of Problems Solved by Supervised Learning', content: 'Supervised learning addresses two main types of problems: classification (predicting categories) and regression (predicting continuous values). Examples include email spam detection and house price prediction.' },
              { id: 4, title: '3.1.4 Conclusion', content: 'Supervised learning is the most commonly used type of machine learning, with applications across virtually every industry.' },
            ]
          },
          { id: 10, title: '3.2 Linear Regression', completed: false, sections: [{ id: 1, title: '3.2.1 Introduction', content: 'Learn the fundamentals of linear regression, one of the simplest yet most powerful algorithms.' }] },
          { id: 11, title: '3.3 Logistic Regression', completed: false, sections: [{ id: 1, title: '3.3.1 Introduction', content: 'Understand logistic regression for binary classification problems.' }] },
          { id: 12, title: '3.4 Decision Trees', completed: false, sections: [{ id: 1, title: '3.4.1 Introduction', content: 'Explore decision trees and how they make predictions through a series of decisions.' }] },
          { id: 13, title: '3.5 Support Vector Machines (SVM)', completed: false, sections: [{ id: 1, title: '3.5.1 Introduction', content: 'Discover how SVMs find optimal decision boundaries in high-dimensional spaces.' }] },
          { id: 14, title: '3.6 K-Nearest Neighbors (KNN)', completed: false, sections: [{ id: 1, title: '3.6.1 Introduction', content: 'Learn the intuitive KNN algorithm and its applications.' }] },
          { id: 15, title: '3.7 Naive Bayes', completed: false, sections: [{ id: 1, title: '3.7.1 Introduction', content: 'Understand probabilistic classification with Naive Bayes.' }] },
          { id: 16, title: '3.8 Ensemble Methods', completed: false, sections: [{ id: 1, title: '3.8.1 Introduction', content: 'Combine multiple models for better predictions with ensemble techniques.' }] },
          { id: 17, title: '3.9 Model Evaluation in Supervised Learning', completed: false, sections: [{ id: 1, title: '3.9.1 Introduction', content: 'Learn to evaluate and compare supervised learning models.' }] },
          { id: 18, title: '3.10 Implementing Supervised Learning Algorithms', completed: false, sections: [{ id: 1, title: '3.10.1 Introduction', content: 'Hands-on implementation of supervised learning algorithms in Python.' }] },
        ]
      },
      {
        id: 4,
        title: '4. Unsupervised Learning Algorithms',
        lessons: [
          { id: 19, title: '4.1 K-Means Clustering', completed: false, sections: [{ id: 1, title: '4.1.1 Introduction', content: 'Learn the most popular clustering algorithm.' }] },
          { id: 20, title: '4.2 Hierarchical Clustering', completed: false, sections: [{ id: 1, title: '4.2.1 Introduction', content: 'Build cluster hierarchies with agglomerative and divisive approaches.' }] },
          { id: 21, title: '4.3 PCA', completed: false, sections: [{ id: 1, title: '4.3.1 Introduction', content: 'Reduce dimensionality while preserving variance.' }] },
        ]
      },
      {
        id: 5,
        title: '5. Model Evaluation And Validation',
        lessons: [
          { id: 22, title: '5.1 Accuracy and Precision', completed: false, sections: [{ id: 1, title: '5.1.1 Introduction', content: 'Understand key metrics for model evaluation.' }] },
          { id: 23, title: '5.2 Cross-Validation', completed: false, sections: [{ id: 1, title: '5.2.1 Introduction', content: 'Learn robust techniques for model validation.' }] },
          { id: 24, title: '5.3 Overfitting and Underfitting', completed: false, sections: [{ id: 1, title: '5.3.1 Introduction', content: 'Balance model complexity for optimal generalization.' }] },
        ]
      },
      {
        id: 6,
        title: '6. Introduction To Neural Networks',
        lessons: [
          { id: 25, title: '6.1 Neural Network Architecture', completed: false, sections: [{ id: 1, title: '6.1.1 Introduction', content: 'Understand the structure of neural networks.' }] },
          { id: 26, title: '6.2 Activation Functions', completed: false, sections: [{ id: 1, title: '6.2.1 Introduction', content: 'Learn about different activation functions and when to use them.' }] },
          { id: 27, title: '6.3 Backpropagation', completed: false, sections: [{ id: 1, title: '6.3.1 Introduction', content: 'Understand how neural networks learn through backpropagation.' }] },
        ]
      },
      {
        id: 7,
        title: '7. Practical Applications Of Machine Learning',
        lessons: [
          { id: 28, title: '7.1 Healthcare Applications', completed: false, sections: [{ id: 1, title: '7.1.1 Introduction', content: 'ML in medical diagnosis, drug discovery, and personalized medicine.' }] },
          { id: 29, title: '7.2 Finance Applications', completed: false, sections: [{ id: 1, title: '7.2.1 Introduction', content: 'Trading algorithms, fraud detection, and credit scoring.' }] },
          { id: 30, title: '7.3 Marketing Applications', completed: false, sections: [{ id: 1, title: '7.3.1 Introduction', content: 'Customer segmentation, recommendation systems, and churn prediction.' }] },
        ]
      },
      {
        id: 8,
        title: '8. Implementing Machine Learning Projects',
        lessons: [
          { id: 31, title: '8.1 Project Planning', completed: false, sections: [{ id: 1, title: '8.1.1 Introduction', content: 'Define objectives, scope, and success metrics for your ML project.' }] },
          { id: 32, title: '8.2 Data Collection', completed: false, sections: [{ id: 1, title: '8.2.1 Introduction', content: 'Strategies for gathering and organizing training data.' }] },
          { id: 33, title: '8.3 Model Training', completed: false, sections: [{ id: 1, title: '8.3.1 Introduction', content: 'Train, tune, and optimize your machine learning model.' }] },
          { id: 34, title: '8.4 Deployment', completed: false, sections: [{ id: 1, title: '8.4.1 Introduction', content: 'Deploy your model to production and monitor its performance.' }] },
        ]
      },
    ]
  },
}

// Default course for IDs not in database
const getDefaultCourse = (id) => ({
  id: parseInt(id) || 0,
  title: `Course ${id}`,
  description: 'Course description will appear here.',
  level: 'Beginner',
  category: 'Generic',
  modules: [
    {
      id: 1,
      title: '1. Getting Started',
      lessons: [
        { id: 1, title: '1.1 Introduction', completed: false, sections: [{ id: 1, title: '1.1.1 Introduction', content: 'Welcome to this course! This introduction will help you get started.' }] },
        { id: 2, title: '1.2 Overview', completed: false, sections: [{ id: 1, title: '1.2.1 Introduction', content: 'An overview of what you will learn in this course.' }] },
      ]
    }
  ]
})

// Left Sidebar Component
function LeftSidebar({ isOpen, onToggle, course }) {
  const navigate = useNavigate()
  
  const menuItems = [
    { icon: BookOpen, label: 'Current Course', active: true },
    { icon: PenLine, label: 'Create New Course', path: '/courses' },
    { icon: Sparkles, label: 'Flashcards', path: '#' },
    { icon: Library, label: 'Library', path: '/courses' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  if (!isOpen) {
    return (
      <div className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4">
        <button 
          onClick={onToggle}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg mb-6"
        >
          <PanelLeft size={20} />
        </button>
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => item.path && navigate(item.path)}
            className={`p-3 rounded-xl mb-2 transition-colors ${
              item.active 
                ? 'bg-primary/20 text-primary' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <span className="font-bold text-white">AI Tutor</span>
        </div>
        <button 
          onClick={onToggle}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 flex-1">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => item.path && navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors text-left ${
              item.active 
                ? 'bg-primary/20 text-primary' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// Lesson Content Component
function LessonContent({ lesson, module, course, onNext, onPrev, hasNext, hasPrev, onMarkComplete }) {
  const [expandedSections, setExpandedSections] = useState([1])
  const [activeTab, setActiveTab] = useState('content')

  const toggleSection = (id) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'simplify', label: 'Simplify' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'example', label: 'Example' },
  ]

  const sections = lesson.sections || [
    { id: 1, title: `${lesson.title} - Introduction`, content: 'Lesson content will appear here.' }
  ]

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Lesson Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">Module {module.id}: {module.title.replace(/^\d+\.\s*/, '')}</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Flag size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bot size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Copy size={18} />
            </button>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{lesson.title}</h2>
        
        {/* Tabs */}
        <div className="flex gap-1 mt-5 border-b border-gray-200 -mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'content' && (
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <span className="font-medium text-white text-left">{section.title}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      expandedSections.includes(section.id) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.includes(section.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-slate-900 text-slate-300 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'simplify' && (
          <div className="bg-slate-800 rounded-xl p-6 text-slate-300">
            <h3 className="text-lg font-semibold text-white mb-4">Simplified Explanation</h3>
            <p className="leading-relaxed">
              This is a simplified version of the lesson content, broken down into easier-to-understand concepts. 
              The AI will explain complex topics in simpler terms with analogies and examples.
            </p>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="bg-slate-800 rounded-xl p-6 text-slate-300">
            <h3 className="text-lg font-semibold text-white mb-4">Quiz</h3>
            <p className="mb-6">Test your understanding of this lesson with a quick quiz.</p>
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
              Start Quiz
            </button>
          </div>
        )}

        {activeTab === 'example' && (
          <div className="bg-slate-800 rounded-xl p-6 text-slate-300">
            <h3 className="text-lg font-semibold text-white mb-4">Real-World Example</h3>
            <p className="leading-relaxed">
              Here you'll find practical examples that demonstrate the concepts from this lesson 
              in real-world scenarios. The AI provides contextual examples to help solidify your understanding.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-center gap-4 bg-gray-50">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Lesson
        </button>
        <button 
          onClick={onMarkComplete}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            lesson.completed 
              ? 'bg-emerald-500 text-white' 
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {lesson.completed ? (
            <>
              <Check className="w-4 h-4" />
              Completed
            </>
          ) : (
            'Mark as Complete'
          )}
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Lesson
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Right Sidebar - Course Navigation
function RightSidebar({ course, modules, selectedLesson, onSelectLesson, expandedModules, onToggleModule }) {
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 overflow-y-auto">
      {/* Course Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-slate-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm truncate">{course.title}</h3>
          </div>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
            {course.category}
          </span>
        </div>
      </div>

      {/* Module List */}
      <div className="p-3">
        {modules.map((module) => (
          <div key={module.id} className="mb-1">
            <button
              onClick={() => onToggleModule(module.id)}
              className="w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Folder size={16} className="text-slate-500 flex-shrink-0" />
              <span className="flex-1 truncate">{module.title}</span>
              <ChevronDown 
                className={`w-4 h-4 text-slate-500 transition-transform ${
                  expandedModules.includes(module.id) ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            <AnimatePresence>
              {expandedModules.includes(module.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-6 border-l border-slate-700 pl-3 py-1">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson, module)}
                        className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedLesson?.id === lesson.id
                            ? 'bg-primary/20 text-primary'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <FileText size={14} className="flex-shrink-0" />
                        <span className="flex-1 truncate">{lesson.title}</span>
                        {lesson.completed && (
                          <Check size={14} className="text-emerald-400 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main CourseDetail Component
function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const course = coursesDatabase[id] || getDefaultCourse(id)
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [expandedModules, setExpandedModules] = useState([1, 2, 3])
  const [darkMode, setDarkMode] = useState(true)

  // Auto-select first incomplete lesson on load
  useEffect(() => {
    const allLessons = course.modules.flatMap(m => m.lessons.map(l => ({ ...l, module: m })))
    const firstIncomplete = allLessons.find(l => !l.completed) || allLessons[0]
    if (firstIncomplete && !selectedLesson) {
      setSelectedLesson(firstIncomplete)
      setSelectedModule(firstIncomplete.module)
    }
  }, [course])

  const toggleModule = (moduleId) => {
    setExpandedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    )
  }

  const handleSelectLesson = (lesson, module) => {
    setSelectedLesson(lesson)
    setSelectedModule(module)
  }

  // Get flat list of all lessons for navigation
  const allLessons = course.modules.flatMap(m => m.lessons.map(l => ({ ...l, module: m })))
  const currentLessonIndex = selectedLesson ? allLessons.findIndex(l => l.id === selectedLesson.id) : -1

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const next = allLessons[currentLessonIndex + 1]
      setSelectedLesson(next)
      setSelectedModule(next.module)
    }
  }

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prev = allLessons[currentLessonIndex - 1]
      setSelectedLesson(prev)
      setSelectedModule(prev.module)
    }
  }

  const handleMarkComplete = () => {
    // In a real app, this would update the backend
    if (selectedLesson) {
      selectedLesson.completed = !selectedLesson.completed
      setSelectedLesson({ ...selectedLesson })
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Sidebar */}
      <LeftSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        course={course}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
              <span className="text-sm">Back to Courses</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link 
              to="/login"
              className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {selectedLesson && selectedModule ? (
            <LessonContent 
              lesson={selectedLesson}
              module={selectedModule}
              course={course}
              onNext={handleNextLesson}
              onPrev={handlePrevLesson}
              hasNext={currentLessonIndex < allLessons.length - 1}
              hasPrev={currentLessonIndex > 0}
              onMarkComplete={handleMarkComplete}
            />
          ) : (
            <div className="bg-slate-900 rounded-2xl p-12 text-center">
              <BookOpen size={48} className="mx-auto mb-4 text-slate-600" />
              <h2 className="text-xl font-bold text-white mb-2">Select a Lesson</h2>
              <p className="text-slate-400">Choose a lesson from the sidebar to begin learning</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar
        course={course}
        modules={course.modules}
        selectedLesson={selectedLesson}
        onSelectLesson={handleSelectLesson}
        expandedModules={expandedModules}
        onToggleModule={toggleModule}
      />
    </div>
  )
}

export default CourseDetail
