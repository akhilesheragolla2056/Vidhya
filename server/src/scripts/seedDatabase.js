import mongoose from 'mongoose'
import Course from '../models/Course.js'
import MockTest from '../models/MockTest.js'
import Experiment from '../models/Experiment.js'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vidhya'

// Sample courses data
const coursesData = [
  {
    title: 'Introduction to Python Programming',
    slug: 'intro-python',
    description: 'Learn Python basics from scratch',
    longDescription:
      'Complete guide to Python programming. Learn variables, loops, functions, and object-oriented programming.',
    category: 'Programming',
    level: 'Beginner',
    duration: '20 hours',
    requirements: ['Computer', 'Internet connection'],
    whatYouWillLearn: [
      'Python syntax and basics',
      'Data types and variables',
      'Functions and modules',
      'Object-oriented programming',
      'File handling',
    ],
    tags: ['Python', 'Programming', 'Coding'],
    modules: [
      {
        title: 'Getting Started',
        description: 'Introduction to Python',
        order: 1,
        lessons: [
          {
            title: 'What is Python?',
            description: 'Introduction to Python programming language',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/kqtZrmDKYiY',
            },
            duration: 15,
            order: 1,
          },
          {
            title: 'Installation & Setup',
            description: 'Install Python and set up your environment',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/YYXdXT2l-Gg',
            },
            duration: 20,
            order: 2,
          },
        ],
      },
      {
        title: 'Python Basics',
        description: 'Variables, data types, operators',
        order: 2,
        lessons: [
          {
            title: 'Variables and Data Types',
            description: 'Learn about variables and different data types in Python',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/HGOBQPFzWKo',
            },
            duration: 25,
            order: 1,
          },
          {
            title: 'Control Flow',
            description: 'If statements, loops, and control flow',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/RF-tKECdHDo',
            },
            duration: 30,
            order: 2,
          },
        ],
      },
    ],
    pricing: { isFree: true },
    isPublished: true,
  },
  // --- Health Studies Catalog ---
  {
    title: 'Human Anatomy & Physiology',
    slug: 'health-anatomy-physiology',
    description: 'Foundational overview of human body systems and functions',
    longDescription:
      'Study the skeletal, muscular, circulatory, respiratory, and nervous systems with engaging videos.',
    category: 'Health Studies',
    level: 'Beginner',
    duration: '18 hours',
    whatYouWillLearn: [
      'Major organ systems',
      'Body functions and homeostasis',
      'Basic anatomical terminology',
    ],
    modules: [
      {
        title: 'Skeletal & Muscular Systems',
        order: 1,
        lessons: [
          {
            title: 'Introduction to the Skeletal System',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=J2v2eH5Hq9o' },
            duration: 18,
            order: 1,
          },
          {
            title: 'Muscular System Basics',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=J8zH2pjkZ0M' },
            duration: 20,
            order: 2,
          },
        ],
      },
      {
        title: 'Circulatory & Respiratory Systems',
        order: 2,
        lessons: [
          {
            title: 'Heart & Blood Circulation',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=9qCNwA6QhXQ' },
            duration: 22,
            order: 1,
          },
          {
            title: 'Lung Function & Respiration',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=8CaCm9y3Kf8' },
            duration: 19,
            order: 2,
          },
        ],
      },
    ],
    pricing: { isFree: true },
    isPublished: true,
  },
  {
    title: 'Basics of Medicine & Healthcare',
    slug: 'health-medicine-basics',
    description: 'Core concepts of healthcare, patient care, and safety',
    category: 'Health Studies',
    level: 'Beginner',
    duration: '12 hours',
    modules: [
      {
        title: 'Healthcare Foundations',
        order: 1,
        lessons: [
          {
            title: 'Introduction to Healthcare Systems',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=3GZW1iVfxDk' },
            duration: 16,
            order: 1,
          },
          {
            title: 'Patient Safety Basics',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=0eM3rY7hJ2o' },
            duration: 15,
            order: 2,
          },
        ],
      },
      {
        title: 'Clinical Communication',
        order: 2,
        lessons: [
          {
            title: 'Effective Patient Communication',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=3iYqJrBzJm8' },
            duration: 14,
            order: 1,
          },
          {
            title: 'Record Keeping & Documentation',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=t5cI1XWmA1U' },
            duration: 18,
            order: 2,
          },
        ],
      },
    ],
    pricing: { isFree: true },
    isPublished: true,
  },
  {
    title: 'Nutrition & Dietetics',
    slug: 'health-nutrition-dietetics',
    description: 'Principles of healthy eating, macro/micro nutrients, and meal planning',
    category: 'Health Studies',
    level: 'Beginner',
    duration: '14 hours',
    modules: [
      {
        title: 'Nutrition Basics',
        order: 1,
        lessons: [
          {
            title: 'Macronutrients Explained',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=Q4A6gG4_6r4' },
            duration: 17,
            order: 1,
          },
          {
            title: 'Micronutrients & Vitamins',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=iml8aFqD0Ck' },
            duration: 16,
            order: 2,
          },
        ],
      },
      {
        title: 'Diet Planning',
        order: 2,
        lessons: [
          {
            title: 'Balanced Diet & Meal Prep',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=KfKZ0kVjv6c' },
            duration: 18,
            order: 1,
          },
          {
            title: 'Special Diets Overview',
            type: 'video',
            content: { videoUrl: 'https://www.youtube.com/watch?v=7mS4I9ZbJ1U' },
            duration: 19,
            order: 2,
          },
        ],
      },
    ],
    pricing: { isFree: true },
    isPublished: true,
  },
  {
    title: 'Mathematics - Class 6',
    slug: 'math-class-6',
    description: 'Complete mathematics curriculum for Class 6',
    longDescription:
      'Learn fundamentals of mathematics including numbers, geometry, algebra basics, and more.',
    category: 'Math',
    level: 'Beginner',
    duration: '40 hours',
    requirements: ['Basic numeracy'],
    whatYouWillLearn: [
      'Number systems',
      'Basic geometry',
      'Introduction to algebra',
      'Fractions and decimals',
      'Data handling',
    ],
    tags: ['Math', 'Class 6', 'Fundamentals'],
    modules: [
      {
        title: 'Numbers and Numerals',
        description: 'Understanding number systems',
        order: 1,
        lessons: [
          {
            title: 'Natural Numbers and Whole Numbers',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/1m6bzvLfxV0',
            },
            duration: 20,
            order: 1,
          },
          {
            title: 'Place Value and Estimation',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/C8eVGqlYqDo',
            },
            duration: 15,
            order: 2,
          },
        ],
      },
      {
        title: 'Geometry Basics',
        description: 'Introduction to shapes and geometry',
        order: 2,
        lessons: [
          {
            title: 'Lines, Angles, and Shapes',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/xvuK7c5n9yM',
            },
            duration: 25,
            order: 1,
          },
        ],
      },
    ],
    pricing: { isFree: true },
    isPublished: true,
  },
  {
    title: 'Physics - Laws of Motion',
    slug: 'physics-motion',
    description: "Newton's Laws of Motion explained",
    longDescription:
      'Deep dive into the three laws of motion, force, friction, and practical applications.',
    category: 'Science',
    level: 'Intermediate',
    duration: '15 hours',
    requirements: ['Basic mathematics'],
    whatYouWillLearn: [
      "Newton's first law",
      "Newton's second law",
      "Newton's third law",
      'Force and friction',
      'Applications of laws',
    ],
    tags: ['Physics', 'Motion', 'Forces'],
    modules: [
      {
        title: 'Introduction to Motion',
        order: 1,
        lessons: [
          {
            title: 'What is Motion?',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/5eRfFTrg9fE',
            },
            duration: 20,
            order: 1,
          },
          {
            title: "Newton's First Law",
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/Xc85qB1ynNY',
            },
            duration: 25,
            order: 2,
          },
        ],
      },
    ],
    pricing: { isFree: true },
    isPublished: true,
  },
  {
    title: 'Chemistry - Acids and Bases',
    slug: 'chemistry-acids-bases',
    description: 'Properties and reactions of acids and bases',
    category: 'Science',
    level: 'Intermediate',
    duration: '12 hours',
    whatYouWillLearn: [
      'Acid properties',
      'Base properties',
      'pH scale',
      'Neutralization',
      'Salt formation',
    ],
    tags: ['Chemistry', 'Acids', 'Bases'],
    modules: [
      {
        title: 'Understanding Acids and Bases',
        order: 1,
        lessons: [
          {
            title: 'Introduction to Acids',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/J4RIaKbRd0w',
            },
            duration: 20,
            order: 1,
          },
          {
            title: 'Introduction to Bases',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/1wm0gzLaW4g',
            },
            duration: 18,
            order: 2,
          },
        ],
      },
    ],
    pricing: { isFree: true },
    isPublished: true,
  },
  {
    title: 'Biology - Human Digestive System',
    slug: 'biology-digestion',
    description: 'Understanding the human digestive system',
    category: 'Science',
    level: 'Beginner',
    duration: '10 hours',
    whatYouWillLearn: [
      'Organs of digestion',
      'Digestive process',
      'Absorption',
      'Nutrition',
      'Common disorders',
    ],
    tags: ['Biology', 'Human Body', 'Digestion'],
    modules: [
      {
        title: 'Digestive System Overview',
        order: 1,
        lessons: [
          {
            title: 'Introduction to Digestion',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/RhkHC82KA0g',
            },
            duration: 20,
            order: 1,
          },
          {
            title: 'Organs of Digestive System',
            type: 'video',
            content: {
              videoUrl: 'https://www.youtube.com/embed/s3kFr_FnB-E',
            },
            duration: 25,
            order: 2,
          },
        ],
      },
    ],
    pricing: { isFree: true },
    isPublished: true,
  },
]

// Sample mock tests data
const mockTestsData = [
  {
    title: 'Python Basics Quiz',
    description: 'Test your knowledge of Python basics',
    instructions: 'Answer all questions. You have 30 minutes to complete this test.',
    duration: 30,
    totalPoints: 100,
    passingScore: 70,
    retakesAllowed: 3,
    questions: [
      {
        question: 'What is the correct syntax to declare a variable in Python?',
        type: 'single',
        options: ['var x = 5;', 'x = 5', 'x: int = 5', 'int x = 5;'],
        correctAnswer: 'x = 5',
        points: 10,
        difficulty: 'easy',
      },
      {
        question: 'Which of the following data types is mutable in Python?',
        type: 'multiple',
        options: ['Tuple', 'List', 'String', 'Integer'],
        correctAnswer: ['List'],
        points: 10,
        difficulty: 'medium',
      },
      {
        question: 'What is the output of print(5 ** 2)?',
        type: 'single',
        options: ['10', '7', '25', '52'],
        correctAnswer: '25',
        points: 10,
        difficulty: 'easy',
      },
    ],
    isPublished: true,
  },
  {
    title: 'Anatomy & Physiology Basics',
    description: 'Assess understanding of core human body systems',
    duration: 25,
    totalPoints: 100,
    passingScore: 70,
    questions: [
      {
        question: 'Which organ pumps blood through the body?',
        type: 'single',
        options: ['Liver', 'Heart', 'Kidney', 'Lung'],
        correctAnswer: 'Heart',
        points: 10,
        difficulty: 'easy',
      },
      {
        question: 'Gas exchange occurs primarily in the:',
        type: 'single',
        options: ['Bronchi', 'Alveoli', 'Trachea', 'Larynx'],
        correctAnswer: 'Alveoli',
        points: 10,
        difficulty: 'medium',
      },
      {
        question: 'Bones connect to muscles via:',
        type: 'single',
        options: ['Ligaments', 'Tendons', 'Cartilage', 'Nerves'],
        correctAnswer: 'Tendons',
        points: 10,
        difficulty: 'easy',
      },
    ],
    isPublished: true,
  },
  {
    title: 'Nutrition Fundamentals',
    description: 'Evaluate knowledge of macro/micro nutrients and diet planning',
    duration: 20,
    totalPoints: 100,
    passingScore: 70,
    questions: [
      {
        question: 'Which is NOT a macronutrient?',
        type: 'single',
        options: ['Protein', 'Carbohydrate', 'Vitamin C', 'Fat'],
        correctAnswer: 'Vitamin C',
        points: 10,
        difficulty: 'easy',
      },
      {
        question: 'A balanced diet should include:',
        type: 'multiple',
        options: ['Proteins', 'Fats', 'Carbohydrates', 'Water'],
        correctAnswer: ['Proteins', 'Fats', 'Carbohydrates', 'Water'],
        points: 10,
        difficulty: 'medium',
      },
    ],
    isPublished: true,
  },
  {
    title: 'Class 6 Mathematics Test',
    description: 'Basic mathematics assessment for Class 6',
    duration: 45,
    totalPoints: 100,
    passingScore: 70,
    questions: [
      {
        question: 'What is 15 + 27?',
        type: 'single',
        options: ['42', '40', '44', '41'],
        correctAnswer: '42',
        points: 10,
        difficulty: 'easy',
      },
      {
        question: 'What is the place value of 7 in 5678?',
        type: 'single',
        options: ['7', '70', '700', '7000'],
        correctAnswer: '70',
        points: 10,
        difficulty: 'easy',
      },
    ],
    isPublished: true,
  },
]

// Sample experiments data
const experimentsData = [
  {
    title: "Ohm's Law Experiment",
    slug: 'ohms-law',
    description: "Understanding Ohm's Law through simulation",
    category: 'Physics',
    gradeLevel: ['10', '11', '12'],
    objective: 'To verify the relationship between voltage, current, and resistance (V=IR)',
    theory:
      "Ohm's Law states that the current flowing through a conductor is directly proportional to the voltage applied across its ends and inversely proportional to its resistance.",
    apparatus: [
      { name: 'Battery', quantity: '1' },
      { name: 'Ammeter', quantity: '1' },
      { name: 'Voltmeter', quantity: '1' },
      { name: 'Variable Resistor', quantity: '1' },
      { name: 'Wires', quantity: 'As needed' },
    ],
    procedure: [
      {
        step: 1,
        description: 'Connect the circuit as shown in the diagram',
      },
      { step: 2, description: 'Set the voltage to 1V using the power supply' },
      {
        step: 3,
        description: 'Record the current reading from the ammeter',
      },
      {
        step: 4,
        description: 'Repeat for different voltages (1V, 2V, 3V, 4V, 5V)',
      },
    ],
    expectedResult: 'Current increases proportionally with voltage (V=IR)',
    difficulty: 'medium',
    estimatedTime: 45,
    isPublished: true,
  },
  {
    title: 'Plant Cell Structure',
    slug: 'plant-cell-structure',
    description: 'Interactive visualization of plant cell structure',
    category: 'Biology',
    gradeLevel: ['9', '10'],
    objective: 'To understand the structure and function of plant cell components',
    theory: 'Plant cells are eukaryotic cells that contain a nucleus and various organelles.',
    apparatus: [
      { name: 'Microscope', quantity: '1' },
      { name: 'Plant leaf', quantity: '1' },
      { name: 'Glass slide', quantity: '1' },
    ],
    procedure: [
      { step: 1, description: 'Prepare a thin slice of plant leaf' },
      { step: 2, description: 'Place it on a glass slide' },
      {
        step: 3,
        description: 'Observe under microscope at different magnifications',
      },
    ],
    expectedResult: 'Visible cell wall, cell membrane, cytoplasm, nucleus, and chloroplasts',
    difficulty: 'easy',
    estimatedTime: 30,
    isPublished: true,
  },
  {
    title: 'Acid-Base Neutralization',
    slug: 'acid-base-neutralization',
    description: 'Simulating acid-base neutralization reactions',
    category: 'Chemistry',
    gradeLevel: ['9', '10', '11'],
    objective: 'To observe and understand the neutralization of acids and bases',
    theory:
      'Neutralization is a reaction between an acid and a base that results in the formation of salt and water.',
    apparatus: [
      { name: 'HCl Solution', quantity: '50 mL' },
      { name: 'NaOH Solution', quantity: '50 mL' },
      { name: 'pH Indicator', quantity: 'Few drops' },
      { name: 'Test Tube', quantity: '2' },
    ],
    procedure: [
      { step: 1, description: 'Add HCl to a test tube' },
      { step: 2, description: 'Check pH using indicator (acidic)' },
      { step: 3, description: 'Slowly add NaOH while stirring' },
      { step: 4, description: 'Observe color change and note pH changes' },
    ],
    expectedResult:
      'Solution changes from acidic to neutral as NaOH is added, pH changes from <7 to ~7',
    difficulty: 'medium',
    estimatedTime: 40,
    isPublished: true,
  },
]

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✓ Connected to MongoDB')

    // Clear existing data (optional - comment out to preserve data)
    // await Course.deleteMany({})
    // await MockTest.deleteMany({})
    // await Experiment.deleteMany({})

    // Seed courses (idempotent)
    const seededCourses = []
    for (const course of coursesData) {
      const existing = await Course.findOne({ slug: course.slug })
      if (existing) {
        seededCourses.push(existing)
      } else {
        const created = await Course.create(course)
        seededCourses.push(created)
      }
    }
    console.log(`✓ Courses present: ${seededCourses.length}`)

    // Seed mock tests linked to courses (idempotent)
    const anatomyCourse = await Course.findOne({ slug: 'health-anatomy-physiology' })
    const nutritionCourse = await Course.findOne({ slug: 'health-nutrition-dietetics' })
    const defaultCourse = seededCourses[0]
    for (const test of mockTestsData) {
      const exists = await MockTest.findOne({ title: test.title })
      if (exists) continue
      const targetCourse = /Anatomy/i.test(test.title)
        ? anatomyCourse || defaultCourse
        : /Nutrition/i.test(test.title)
          ? nutritionCourse || defaultCourse
          : defaultCourse
      await MockTest.create({ ...test, course: targetCourse?._id, createdBy: null })
    }
    const testsCount = await MockTest.countDocuments()
    console.log(`✓ Mock tests present: ${testsCount}`)

    // Seed experiments (idempotent)
    for (const exp of experimentsData) {
      const exists = await Experiment.findOne({ slug: exp.slug })
      if (exists) continue
      await Experiment.create(exp)
    }
    const expCount = await Experiment.countDocuments()
    console.log(`✓ Experiments present: ${expCount}`)

    console.log('\n✓ Database seeding completed successfully!')
  } catch (error) {
    console.error('✗ Error seeding database:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('✓ Disconnected from MongoDB')
  }
}

// Run seeding
seedDatabase()
