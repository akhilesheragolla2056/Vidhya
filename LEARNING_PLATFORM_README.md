# Vidhya - Professional Learning Platform

## 🎓 Overview

Vidhya is a comprehensive education and learning platform featuring interactive courses across multiple categories including Academic Education, Sports & Fitness, Skill-based Courses, and Competitive Exam Preparation.

## ✨ Key Features

### 📚 Course Playlist System

- Browse courses organized by categories
- Each course includes:
  - Course Title, Category, Description
  - Instructor Information with Avatar
  - Total Duration, Number of Lessons
  - Difficulty Level (Beginner / Intermediate / Advanced)
  - Rating and Enrollment Count
  - Skills/Topics Covered

### 🎥 Video Integration

- YouTube video embedding with custom controls
- Real-time video progress tracking
- Auto-play next video after completion
- Track watch percentage per video
- Custom player controls (play/pause, mute, fullscreen)

### 📊 Real-time Progress Tracking

- Automatic progress calculation
- Visual progress bars showing completion percentage
- Three completion statuses:
  - **Not Started** - Course hasn't been accessed
  - **In Progress** - Active learning
  - **Completed** - All lessons finished
- Progress synced to localStorage for persistence

### 📝 Course Content Structure

Each lesson contains:

#### 1. Video Lessons

- YouTube embedded videos
- Progress tracking with percentage
- Auto-play next functionality
- Custom video controls overlay

#### 2. Theory Notes

- Markdown-formatted study materials
- Scrollable content viewer
- Auto-mark as read at 80% scroll
- Reading progress indicator
- Beautiful typography and code highlighting

#### 3. MCQ Quizzes

- Multiple-choice questions per lesson
- Instant feedback (correct/wrong)
- Detailed explanations for each answer
- Score tracking with percentage
- Unlimited reattempts allowed
- Previous score comparison
- Answer review after completion
- Pass threshold: 60%

### 🎯 Progress Tracking Features

- **Video Progress**: Tracks watch percentage
- **Notes Read**: Marks when notes are fully read
- **MCQ Scores**: Stores quiz results and percentages
- **Lesson Completion**: Auto-marks complete when criteria met
- **Overall Course Progress**: Real-time percentage calculation
- **Learning Statistics**: Total courses, completed, in progress

### 🎨 UI/UX Design

- **Clean, Modern Interface**: Professional learning platform aesthetic
- **Card-based Layout**: Course cards with thumbnails and stats
- **Tabbed Interface**: Videos | Notes | MCQs tabs
- **Playlist Sidebar**: Easy lesson navigation
- **Progress Indicators**: Visual feedback everywhere
- **Responsive Design**: Mobile-friendly layouts
- **Smooth Animations**: Framer Motion transitions
- **Status Badges**: Visual completion indicators

## 🗂️ File Structure

```
client/src/
├── data/
│   └── coursesData.js          # Course database with all content
├── utils/
│   └── progressTracker.js      # Progress management utilities
├── components/
│   └── course/
│       ├── VideoLesson.jsx     # YouTube player component
│       ├── TheoryNotes.jsx     # Notes viewer component
│       └── MCQQuiz.jsx         # Interactive quiz component
├── pages/
│   ├── CoursesNew.jsx          # Course listing page
│   ├── CourseDetailNew.jsx     # Main learning page
│   └── LearningShowcase.jsx    # Platform showcase page
```

## 🚀 Getting Started

### Installation

1. Install dependencies:

```bash
cd client
npm install
```

2. The following packages are required:

- `react-markdown` - For theory notes rendering
- `framer-motion` - For animations
- `lucide-react` - For icons

### Usage

1. **Browse Courses**
   - Navigate to `/courses-new` or `/learning`
   - Filter by category and difficulty
   - Search for specific courses

2. **Start Learning**
   - Click on any course card
   - You'll be taken to `/course/:id`
   - Use the playlist sidebar to navigate lessons

3. **Complete Lessons**
   - Watch the video (auto-tracked)
   - Read the theory notes (mark when done)
   - Take the MCQ quiz (60% to pass)
   - Progress updates automatically

## 📚 Sample Courses Included

1. **Machine Learning Fundamentals**
   - Category: Academic Education
   - 24 lessons covering ML basics
   - Videos, comprehensive notes, quizzes

2. **Yoga for Absolute Beginners**
   - Category: Sports & Fitness
   - 12 lessons on yoga fundamentals
   - Breathing techniques and poses

3. **Complete Web Development Bootcamp**
   - Category: Skill-based Courses
   - 36 lessons from HTML to full-stack
   - Practical web development skills

4. **UPSC Civil Services Preparation**
   - Category: Competitive Exams
   - 48 lessons for UPSC preparation
   - Comprehensive exam strategy

## 🎯 Progress Tracking System

### localStorage Schema

```javascript
{
  "vidhya_course_progress": {
    "course-id": {
      "courseId": "course-id",
      "completedLessons": ["lesson-1", "lesson-2"],
      "videoProgress": {
        "lesson-1": { "watched": true, "percentage": 100 }
      },
      "completedMCQs": ["lesson-1"],
      "mcqScores": {
        "lesson-1": { "score": 3, "totalQuestions": 3, "percentage": 100 }
      },
      "notesRead": ["lesson-1"],
      "status": "in-progress",
      "overallProgress": 33,
      "startedAt": "2026-02-03T...",
      "lastAccessed": "2026-02-03T..."
    }
  }
}
```

### Progress Calculation

- Lesson marked complete when:
  - Video watched ≥ 80%
  - OR MCQ passed (≥ 60%)
- Course progress = (completedLessons / totalLessons) × 100
- Auto-marks course as "completed" at 100%

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Redux Toolkit
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Markdown**: React Markdown
- **Video**: YouTube IFrame API
- **Storage**: localStorage

## 📱 Responsive Design

- **Mobile**: Single column layout, stacked components
- **Tablet**: Two column grid for courses
- **Desktop**: Full sidebar + main content layout
- **Breakpoints**: Tailwind's responsive utilities

## 🎨 Design System

### Colors

- **Primary**: Blue (#3B82F6)
- **Accent Cyan**: (#06B6D4)
- **Accent Coral**: (#FF6B6B)
- **Success**: Emerald (#10B981)
- **Warning**: Orange (#F97316)

### Difficulty Badges

- **Beginner**: Teal background
- **Intermediate**: Coral background
- **Advanced**: Primary background

### Status Indicators

- **Not Started**: Gray
- **In Progress**: Primary blue
- **Completed**: Emerald green

## 🔄 Auto-play & Navigation

- Videos auto-play next lesson after completion
- 3-second delay before auto-play
- Previous/Next lesson buttons
- Playlist sidebar for quick navigation
- Keyboard shortcuts support (planned)

## 🏆 Achievement System (Future Enhancement)

- Badges for course completion
- Streak tracking
- XP points system
- Leaderboards
- Certificates

## 📊 Analytics (Future Enhancement)

- Time spent per lesson
- Average quiz scores
- Learning velocity
- Weak topics identification
- Personalized recommendations

## 🔐 Authentication

- Currently uses existing auth system
- Progress tied to localStorage
- Future: Server-side progress sync
- Multi-device progress sync (planned)

## 🚧 Future Enhancements

1. **Backend Integration**
   - Save progress to database
   - User-specific course enrollment
   - Real-time progress sync

2. **Advanced Features**
   - Live sessions support
   - Discussion forums per lesson
   - AI-powered doubt resolution
   - Personalized learning paths

3. **Content Types**
   - PDF downloads
   - Code playgrounds
   - Interactive simulations
   - Live coding exercises

4. **Social Features**
   - Study groups
   - Peer review
   - Course ratings/reviews
   - Share progress on social media

## 📝 License

This project is part of the Vidhya Learning Platform.

## 👨‍💻 Development

To add new courses, edit `client/src/data/coursesData.js`:

```javascript
{
  id: 'unique-id',
  title: 'Course Title',
  category: 'Category',
  // ... other properties
  playlist: [
    {
      id: 'lesson-id',
      title: 'Lesson Title',
      videoUrl: 'YouTube URL',
      notes: '# Markdown content',
      mcqs: [{ question, options, correctAnswer, explanation }]
    }
  ]
}
```

## 🎉 Demo Routes

- `/learning` - Showcase page
- `/courses-new` - Browse all courses
- `/course/ml-101` - Machine Learning course
- `/course/yoga-beginners` - Yoga course
- `/course/web-dev-bootcamp` - Web Dev course
- `/course/upsc-prep` - UPSC preparation

---

**Built with ❤️ for learners everywhere**
