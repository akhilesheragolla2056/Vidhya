/**
 * Comprehensive Course Data for Vidhya Learning Platform
 * Includes multiple categories with videos, notes, and MCQs
 */

export const coursesData = [
  {
    id: 'ml-101',
    title: 'Machine Learning Fundamentals',
    category: 'Academic Education',
    subcategory: 'Computer Science',
    description:
      'Master the fundamentals of machine learning with hands-on projects and real-world applications.',
    instructor: 'Dr. Sarah Johnson',
    instructorAvatar: 'https://i.pravatar.cc/150?img=5',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    totalLessons: 24,
    rating: 4.8,
    enrolledCount: 12540,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    skills: ['Python', 'TensorFlow', 'Data Analysis', 'Neural Networks'],
    playlist: [
      {
        id: 'ml-101-1',
        title: 'Introduction to Machine Learning',
        duration: '45 min',
        videoUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
        notes: `# Introduction to Machine Learning

## What is Machine Learning?

Machine Learning (ML) is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.

### Key Concepts:

1. **Supervised Learning**: Learning from labeled data
   - Classification problems
   - Regression problems

2. **Unsupervised Learning**: Finding patterns in unlabeled data
   - Clustering
   - Dimensionality reduction

3. **Reinforcement Learning**: Learning through trial and error
   - Reward-based learning
   - Decision making

### Real-World Applications:

- **Healthcare**: Disease prediction, medical imaging analysis
- **Finance**: Fraud detection, algorithmic trading
- **E-commerce**: Recommendation systems, price optimization
- **Transportation**: Self-driving cars, route optimization

### Why Learn Machine Learning?

Machine learning is transforming every industry. Understanding ML fundamentals opens doors to:
- High-paying career opportunities
- Solving complex real-world problems
- Innovation in technology

### Prerequisites:

- Basic Python programming
- Understanding of statistics
- Linear algebra basics
- Curiosity and problem-solving mindset`,
        mcqs: [
          {
            id: 'ml-101-1-q1',
            question: 'What is the primary characteristic of supervised learning?',
            options: [
              'Learning from unlabeled data',
              'Learning from labeled data with known outcomes',
              'Learning through trial and error',
              'Learning without any data',
            ],
            correctAnswer: 1,
            explanation:
              'Supervised learning uses labeled data where the correct answer is known, allowing the model to learn patterns and make predictions.',
          },
          {
            id: 'ml-101-1-q2',
            question: 'Which of the following is NOT a type of machine learning?',
            options: [
              'Supervised Learning',
              'Unsupervised Learning',
              'Reinforcement Learning',
              'Deterministic Learning',
            ],
            correctAnswer: 3,
            explanation:
              'The three main types of machine learning are supervised, unsupervised, and reinforcement learning. Deterministic learning is not a recognized ML category.',
          },
          {
            id: 'ml-101-1-q3',
            question: 'What is a common application of unsupervised learning?',
            options: [
              'Email spam detection',
              'Customer segmentation',
              'House price prediction',
              'Image classification',
            ],
            correctAnswer: 1,
            explanation:
              'Customer segmentation uses clustering, an unsupervised learning technique, to group similar customers without predefined labels.',
          },
        ],
      },
      {
        id: 'ml-101-2',
        title: 'Python for Machine Learning',
        duration: '52 min',
        videoUrl: 'https://www.youtube.com/watch?v=7eh4d6sabA0',
        notes: `# Python for Machine Learning

## Why Python?

Python is the most popular language for machine learning due to:
- Simple, readable syntax
- Extensive libraries (NumPy, Pandas, Scikit-learn)
- Large community support
- Cross-platform compatibility

## Essential Libraries:

### 1. NumPy
\`\`\`python
import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2], [3, 4]])

# Mathematical operations
mean = np.mean(arr)
std = np.std(arr)
\`\`\`

### 2. Pandas
\`\`\`python
import pandas as pd

# Create DataFrame
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35]
})

# Data manipulation
filtered = df[df['age'] > 28]
\`\`\`

### 3. Matplotlib
\`\`\`python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
plt.xlabel('X axis')
plt.ylabel('Y axis')
plt.title('Sample Plot')
plt.show()
\`\`\`

## Data Structures for ML:

1. **Arrays**: Efficient numerical computations
2. **DataFrames**: Tabular data manipulation
3. **Matrices**: Linear algebra operations
4. **Tensors**: Multi-dimensional arrays for deep learning`,
        mcqs: [
          {
            id: 'ml-101-2-q1',
            question: 'Which Python library is primarily used for numerical computations in ML?',
            options: ['Pandas', 'NumPy', 'Matplotlib', 'Requests'],
            correctAnswer: 1,
            explanation:
              'NumPy (Numerical Python) is the fundamental library for numerical computations and array operations in machine learning.',
          },
          {
            id: 'ml-101-2-q2',
            question: 'What data structure does Pandas primarily work with?',
            options: ['Lists', 'Arrays', 'DataFrames', 'Dictionaries'],
            correctAnswer: 2,
            explanation:
              'Pandas works primarily with DataFrames, which are 2-dimensional labeled data structures similar to spreadsheets.',
          },
        ],
      },
      {
        id: 'ml-101-3',
        title: 'Linear Regression Basics',
        duration: '48 min',
        videoUrl: 'https://www.youtube.com/watch?v=7ArmBVF2dCs',
        notes: `# Linear Regression

## What is Linear Regression?

Linear regression is a fundamental supervised learning algorithm that models the relationship between variables by fitting a linear equation.

## The Linear Equation:

**y = mx + b**

Where:
- y = predicted value (dependent variable)
- x = input feature (independent variable)
- m = slope (coefficient)
- b = y-intercept (bias)

## Types of Linear Regression:

### 1. Simple Linear Regression
- One independent variable
- Example: Predicting house price based on size

### 2. Multiple Linear Regression
- Multiple independent variables
- Example: Predicting house price based on size, location, and age

## Cost Function (Mean Squared Error):

MSE = (1/n) Σ(actual - predicted)²

The goal is to minimize this cost function to find the best-fit line.

## Implementation Example:

\`\`\`python
from sklearn.linear_model import LinearRegression
import numpy as np

# Training data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Make predictions
predictions = model.predict([[6], [7]])
print(predictions)  # [12, 14]
\`\`\`

## Real-World Applications:

- Sales forecasting
- Risk assessment
- Trend analysis
- Price prediction`,
        mcqs: [
          {
            id: 'ml-101-3-q1',
            question: 'In the equation y = mx + b, what does m represent?',
            options: ['Y-intercept', 'Slope', 'Predicted value', 'Input feature'],
            correctAnswer: 1,
            explanation:
              'm represents the slope, which determines how much y changes for each unit change in x.',
          },
          {
            id: 'ml-101-3-q2',
            question: 'What is the goal when training a linear regression model?',
            options: [
              'Maximize the cost function',
              'Minimize the cost function',
              'Keep the cost function constant',
              'Ignore the cost function',
            ],
            correctAnswer: 1,
            explanation:
              'The goal is to minimize the cost function (typically MSE) to find the best-fit line that reduces prediction errors.',
          },
        ],
      },
    ],
  },
  {
    id: 'yoga-beginners',
    title: 'Yoga for Absolute Beginners',
    category: 'Sports & Fitness',
    subcategory: 'Yoga',
    description:
      'Start your yoga journey with beginner-friendly poses, breathing techniques, and mindfulness practices.',
    instructor: 'Maya Patel',
    instructorAvatar: 'https://i.pravatar.cc/150?img=20',
    difficulty: 'Beginner',
    duration: '4 weeks',
    totalLessons: 12,
    rating: 4.9,
    enrolledCount: 8920,
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop',
    skills: ['Flexibility', 'Mindfulness', 'Breathing', 'Balance'],
    playlist: [
      {
        id: 'yoga-1',
        title: 'Introduction to Yoga',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
        notes: `# Introduction to Yoga

## What is Yoga?

Yoga is an ancient practice that combines physical postures, breathing techniques, and meditation to promote overall wellness.

## Benefits of Yoga:

### Physical Benefits:
- Improved flexibility and strength
- Better posture and balance
- Enhanced cardiovascular health
- Pain relief and injury prevention

### Mental Benefits:
- Stress reduction
- Improved focus and concentration
- Better sleep quality
- Enhanced mood and emotional well-being

## Types of Yoga:

1. **Hatha Yoga**: Gentle, slow-paced
2. **Vinyasa Yoga**: Flow-based, dynamic
3. **Ashtanga Yoga**: Structured, challenging
4. **Yin Yoga**: Deep stretching, meditative

## Getting Started:

- Wear comfortable clothing
- Use a yoga mat
- Practice on an empty stomach
- Listen to your body
- Start with basic poses

## Basic Principles:

1. **Breath (Pranayama)**: Conscious breathing
2. **Posture (Asana)**: Physical poses
3. **Mindfulness**: Present moment awareness
4. **Non-judgment**: Accept where you are`,
        mcqs: [
          {
            id: 'yoga-1-q1',
            question: 'What are the three main components of yoga practice?',
            options: [
              'Exercise, diet, and sleep',
              'Postures, breathing, and meditation',
              'Strength, cardio, and flexibility',
              'Running, jumping, and stretching',
            ],
            correctAnswer: 1,
            explanation:
              'Yoga combines physical postures (asanas), breathing techniques (pranayama), and meditation for holistic wellness.',
          },
          {
            id: 'yoga-1-q2',
            question: 'Which type of yoga is best for beginners seeking a gentle practice?',
            options: ['Ashtanga', 'Hatha', 'Power Yoga', 'Hot Yoga'],
            correctAnswer: 1,
            explanation:
              'Hatha yoga is gentle and slow-paced, making it ideal for beginners to learn proper alignment and breathing.',
          },
        ],
      },
      {
        id: 'yoga-2',
        title: 'Basic Breathing Techniques',
        duration: '20 min',
        videoUrl: 'https://www.youtube.com/watch?v=nM-ySWyID9o',
        notes: `# Pranayama: The Art of Breathing

## What is Pranayama?

Pranayama is the practice of breath control, a vital aspect of yoga that enhances physical and mental well-being.

## Key Breathing Techniques:

### 1. Diaphragmatic Breathing
- Breathe deeply into your belly
- Activates the relaxation response
- Reduces stress and anxiety

### 2. Alternate Nostril Breathing (Nadi Shodhana)
- Balances left and right brain hemispheres
- Calms the nervous system
- Improves focus

### 3. Ujjayi Breath (Ocean Breath)
- Creates slight constriction in throat
- Sounds like ocean waves
- Builds internal heat

## Benefits:

- Increased lung capacity
- Better oxygen circulation
- Reduced blood pressure
- Enhanced mental clarity
- Stress relief

## Practice Tips:

1. Find a comfortable seated position
2. Keep spine straight
3. Breathe through your nose
4. Start with 5-10 minutes daily
5. Don't force the breath`,
        mcqs: [
          {
            id: 'yoga-2-q1',
            question: 'What is the primary benefit of diaphragmatic breathing?',
            options: [
              'Builds muscle strength',
              'Activates relaxation response',
              'Improves digestion',
              'Increases flexibility',
            ],
            correctAnswer: 1,
            explanation:
              "Diaphragmatic breathing activates the parasympathetic nervous system, triggering the body's relaxation response.",
          },
        ],
      },
    ],
  },
  {
    id: 'web-dev-bootcamp',
    title: 'Complete Web Development Bootcamp',
    category: 'Skill-based Courses',
    subcategory: 'Web Development',
    description:
      'Learn full-stack web development from scratch. Build real-world projects with HTML, CSS, JavaScript, React, and Node.js.',
    instructor: 'Alex Chen',
    instructorAvatar: 'https://i.pravatar.cc/150?img=12',
    difficulty: 'Beginner',
    duration: '12 weeks',
    totalLessons: 36,
    rating: 4.7,
    enrolledCount: 15670,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    playlist: [
      {
        id: 'web-1',
        title: 'HTML Fundamentals',
        duration: '35 min',
        videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
        notes: `# HTML Fundamentals

## What is HTML?

HTML (HyperText Markup Language) is the standard markup language for creating web pages.

## Basic Structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first webpage.</p>
</body>
</html>
\`\`\`

## Essential HTML Tags:

### Headings:
\`\`\`html
<h1>Main Heading</h1>
<h2>Subheading</h2>
<h3>Smaller Heading</h3>
\`\`\`

### Paragraphs and Text:
\`\`\`html
<p>This is a paragraph.</p>
<strong>Bold text</strong>
<em>Italic text</em>
\`\`\`

### Links:
\`\`\`html
<a href="https://example.com">Visit Example</a>
\`\`\`

### Images:
\`\`\`html
<img src="image.jpg" alt="Description">
\`\`\`

### Lists:
\`\`\`html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>

<ol>
    <li>First</li>
    <li>Second</li>
</ol>
\`\`\`

## Semantic HTML:

Use meaningful tags:
- \`<header>\` for page header
- \`<nav>\` for navigation
- \`<main>\` for main content
- \`<article>\` for articles
- \`<footer>\` for page footer`,
        mcqs: [
          {
            id: 'web-1-q1',
            question: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Markup Language',
            ],
            correctAnswer: 0,
            explanation:
              'HTML stands for HyperText Markup Language, the standard language for creating web pages.',
          },
          {
            id: 'web-1-q2',
            question: 'Which tag is used to create a hyperlink?',
            options: ['<link>', '<a>', '<href>', '<url>'],
            correctAnswer: 1,
            explanation:
              'The <a> (anchor) tag is used to create hyperlinks in HTML, with the href attribute specifying the destination.',
          },
          {
            id: 'web-1-q3',
            question: 'What is the purpose of semantic HTML?',
            options: [
              'To make pages load faster',
              'To give meaning to the structure of web content',
              'To add styling to elements',
              'To create animations',
            ],
            correctAnswer: 1,
            explanation:
              'Semantic HTML uses meaningful tags to give structure and meaning to web content, improving accessibility and SEO.',
          },
        ],
      },
    ],
  },
  {
    id: 'upsc-prep',
    title: 'UPSC Civil Services Preparation',
    category: 'Competitive Exams',
    subcategory: 'UPSC',
    description:
      'Comprehensive preparation course for UPSC Civil Services Examination covering all subjects and current affairs.',
    instructor: 'Dr. Rajesh Kumar',
    instructorAvatar: 'https://i.pravatar.cc/150?img=33',
    difficulty: 'Advanced',
    duration: '16 weeks',
    totalLessons: 48,
    rating: 4.9,
    enrolledCount: 6780,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop',
    skills: ['General Studies', 'Current Affairs', 'Essay Writing', 'Ethics'],
    playlist: [
      {
        id: 'upsc-1',
        title: 'Understanding UPSC Exam Pattern',
        duration: '40 min',
        videoUrl: 'https://www.youtube.com/watch?v=CkgF0vxudRw',
        notes: `# UPSC Civil Services Examination

## Exam Structure:

The UPSC CSE consists of three stages:

### 1. Prelims (Objective Type)
- **Paper 1**: General Studies (200 marks)
- **Paper 2**: CSAT - Civil Services Aptitude Test (200 marks)
- **Duration**: 2 hours each
- **Qualifying**: Both papers, but only GS marks count for merit

### 2. Mains (Descriptive)
- **Essay**: 250 marks
- **GS Paper 1**: 250 marks (Indian Heritage, History, Geography)
- **GS Paper 2**: 250 marks (Governance, Constitution, Social Justice)
- **GS Paper 3**: 250 marks (Technology, Economy, Environment)
- **GS Paper 4**: 250 marks (Ethics, Integrity, Aptitude)
- **Optional Subject**: 2 papers × 250 marks
- **Total**: 1750 marks

### 3. Personality Test (Interview)
- **Marks**: 275
- **Final Merit**: Mains + Interview = 2025 marks

## Preparation Strategy:

1. **Understand the Syllabus**: Read it thoroughly
2. **NCERTs First**: Build strong foundation
3. **Current Affairs**: Daily newspaper reading
4. **Answer Writing**: Regular practice
5. **Test Series**: Mock tests and evaluation
6. **Optional Subject**: Choose wisely based on interest

## Time Management:

- Prelims preparation: 6-8 months
- Mains preparation: 10-12 months
- Continuous revision throughout

## Key Resources:

- NCERT textbooks (6-12)
- The Hindu/Indian Express
- Monthly magazines (Yojana, Kurukshetra)
- Standard reference books
- Previous year papers`,
        mcqs: [
          {
            id: 'upsc-1-q1',
            question: 'How many stages are there in UPSC Civil Services Examination?',
            options: ['Two', 'Three', 'Four', 'Five'],
            correctAnswer: 1,
            explanation:
              'UPSC CSE has three stages: Prelims (screening), Mains (written exam), and Interview (personality test).',
          },
          {
            id: 'upsc-1-q2',
            question: 'What is the total marks for UPSC Mains examination?',
            options: ['1000 marks', '1500 marks', '1750 marks', '2025 marks'],
            correctAnswer: 2,
            explanation: 'UPSC Mains has 1750 marks (Essay 250 + 4 GS papers 1000 + Optional 500).',
          },
          {
            id: 'upsc-1-q3',
            question: 'Which paper in Prelims is qualifying in nature?',
            options: ['Paper 1 (GS)', 'Paper 2 (CSAT)', 'Both papers', 'Neither paper'],
            correctAnswer: 1,
            explanation:
              'Paper 2 (CSAT) is qualifying with 33% minimum marks required, while Paper 1 marks count for final merit.',
          },
        ],
      },
    ],
  },
]

/**
 * Get course by ID
 */
export function getCourseById(courseId) {
  return coursesData.find(course => course.id === courseId)
}

/**
 * Get all courses by category
 */
export function getCoursesByCategory(category) {
  return coursesData.filter(course => course.category === category)
}

/**
 * Get all unique categories
 */
export function getAllCategories() {
  return [...new Set(coursesData.map(course => course.category))]
}
