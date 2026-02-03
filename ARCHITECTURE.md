# 🏗️ Vidhya Learning Platform - Architecture Overview

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vidhya Learning Platform                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │           React Application             │
        │         (Client-Side SPA)               │
        └────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌───────────────┐                         ┌──────────────────┐
│    Routing    │                         │  State Management│
│ React Router  │                         │   localStorage   │
└───────────────┘                         └──────────────────┘
        │                                           │
        │                                           │
        ▼                                           ▼
┌───────────────────────────────────────────────────────────┐
│                         Pages                              │
├───────────────────────────────────────────────────────────┤
│  • LearningShowcase  • CoursesNew  • CourseDetailNew      │
└───────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                      Components                            │
├───────────────────────────────────────────────────────────┤
│  • VideoLesson  • TheoryNotes  • MCQQuiz                  │
└───────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────┐           ┌──────────────┐
        │     Data     │           │   Utilities  │
        │ coursesData  │           │progressTracker│
        └──────────────┘           └──────────────┘
```

---

## 🗂️ Component Hierarchy

```
App.jsx
 │
 ├── LearningShowcase.jsx
 │    └── Feature cards, Course previews, CTA
 │
 ├── CoursesNew.jsx
 │    ├── Search & Filters
 │    └── CourseCard (×N)
 │         ├── Thumbnail
 │         ├── Progress Badge
 │         ├── Metadata
 │         └── Instructor Info
 │
 └── CourseDetailNew.jsx
      ├── Header (Course Info + Progress)
      ├── Playlist Sidebar
      │    └── Lesson List Items
      │         ├── Lesson Number
      │         ├── Completion Icon
      │         └── Title
      │
      └── Main Content Area
           ├── Lesson Header
           │    ├── Title
           │    └── Status Badges
           │
           ├── Tab Navigation
           │    ├── Video Tab
           │    ├── Notes Tab
           │    └── Quiz Tab
           │
           └── Tab Content
                ├── VideoLesson
                │    ├── YouTube Player
                │    ├── Custom Controls
                │    └── Progress Tracker
                │
                ├── TheoryNotes
                │    ├── Markdown Renderer
                │    ├── Scroll Progress
                │    └── Read Status
                │
                └── MCQQuiz
                     ├── Question Display
                     ├── Answer Options
                     ├── Feedback Panel
                     └── Score Display
```

---

## 🔄 Data Flow

```
                        User Actions
                             │
                             ▼
┌────────────────────────────────────────────────────┐
│              Component Event Handlers               │
│  (onVideoComplete, onNotesRead, onQuizComplete)    │
└────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────┐
│            Progress Tracker Utilities              │
│  • markVideoWatched()                              │
│  • markNotesRead()                                 │
│  • saveMCQResults()                                │
│  • calculateProgress()                             │
└────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────┐
│                  localStorage                      │
│  vidhya_course_progress: {                        │
│    courseId: {                                    │
│      completedLessons: [],                        │
│      videoProgress: {},                           │
│      mcqScores: {},                               │
│      status: "in-progress"                        │
│    }                                              │
│  }                                                │
└────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────┐
│              Component Re-render                   │
│  • Update progress bars                           │
│  • Show completion badges                         │
│  • Update status indicators                       │
└────────────────────────────────────────────────────┘
```

---

## 📦 Module Dependencies

```
CourseDetailNew.jsx
 ├── Dependencies:
 │    ├── react (useState, useEffect)
 │    ├── react-router-dom (useParams, useNavigate)
 │    ├── framer-motion
 │    ├── lucide-react (icons)
 │    │
 │    ├── VideoLesson.jsx
 │    ├── TheoryNotes.jsx
 │    ├── MCQQuiz.jsx
 │    ├── LoadingSpinner.jsx
 │    │
 │    ├── coursesData.js
 │    └── progressTracker.js

VideoLesson.jsx
 ├── Dependencies:
 │    ├── react (useState, useEffect, useRef)
 │    ├── lucide-react
 │    └── YouTube IFrame API (CDN)

TheoryNotes.jsx
 ├── Dependencies:
 │    ├── react (useState, useEffect)
 │    ├── lucide-react
 │    └── react-markdown

MCQQuiz.jsx
 ├── Dependencies:
 │    ├── react (useState)
 │    ├── framer-motion
 │    └── lucide-react

CoursesNew.jsx
 ├── Dependencies:
 │    ├── react (useState, useEffect)
 │    ├── react-router-dom (Link)
 │    ├── framer-motion
 │    ├── lucide-react
 │    ├── coursesData.js
 │    └── progressTracker.js
```

---

## 🎯 State Management

### Component Level State (useState)

```javascript
CourseDetailNew:
  - course (object)
  - currentLessonIndex (number)
  - activeTab (string)
  - progress (object)

VideoLesson:
  - player (YouTube API instance)
  - isPlaying (boolean)
  - progress (number)
  - watchedPercentage (number)

TheoryNotes:
  - showNotes (boolean)
  - scrollProgress (number)

MCQQuiz:
  - currentQuestion (number)
  - selectedAnswers (object)
  - showResult (boolean)
  - quizCompleted (boolean)
  - score (number)
```

### Persistent State (localStorage)

```javascript
vidhya_course_progress: {
  [courseId]: {
    courseId: string,
    completedLessons: string[],
    videoProgress: {
      [lessonId]: {
        watched: boolean,
        percentage: number
      }
    },
    completedMCQs: string[],
    mcqScores: {
      [lessonId]: {
        score: number,
        totalQuestions: number,
        percentage: number
      }
    },
    notesRead: string[],
    status: "not-started" | "in-progress" | "completed",
    overallProgress: number,
    startedAt: string,
    lastAccessed: string
  }
}
```

---

## 🎨 UI Component Structure

### Course Card

```
┌─────────────────────────────┐
│     [Thumbnail Image]       │
│  [Progress Badge]           │
├─────────────────────────────┤
│ [Difficulty] [Rating]       │
│                             │
│ Course Title                │
│ Description text...         │
│                             │
│ 📚 24 lessons 👥 1.2k ⏱ 8w  │
│ ────────────────────────    │
│ [Instructor Photo] Name  →  │
└─────────────────────────────┘
```

### Video Player

```
┌─────────────────────────────┐
│                             │
│   YouTube Video Player      │
│                             │
├─────────────────────────────┤
│ ━━━━━━━━━━━━━━━━━ 45%      │
│ ▶️ 🔊 2:30 / 5:00  ✅ 80%  │
└─────────────────────────────┘
```

### Quiz Interface

```
┌─────────────────────────────┐
│ Question 2 of 5             │
│ ████████░░░░ 40%            │
├─────────────────────────────┤
│ What is Machine Learning?   │
│                             │
│ ○ Option A                  │
│ ⦿ Option B (selected)       │
│ ○ Option C                  │
│ ○ Option D                  │
│                             │
│   [Submit Answer]           │
└─────────────────────────────┘
```

---

## 🔐 Security & Performance

### Security

- ✅ Client-side only (no sensitive data)
- ✅ localStorage for progress (user-specific)
- ✅ No authentication required for demo
- ✅ YouTube embed sandboxed

### Performance

- ✅ Lazy loading for pages
- ✅ Code splitting by route
- ✅ Optimized re-renders
- ✅ Debounced scroll handlers
- ✅ Throttled video progress updates
- ✅ Lightweight bundle size

---

## 🚀 Scalability Paths

### Backend Integration

```
Current:    localStorage
            ↓
Future:     REST API / GraphQL
            ↓
            Database (MongoDB/PostgreSQL)
            ↓
            Authentication (JWT)
            ↓
            Multi-device sync
```

### Features Expansion

```
Current:    YouTube videos
            ↓
Future:     Native video hosting
            PDF downloads
            Live sessions
            Discussion forums
            AI tutoring
            Certificates
```

---

## 📱 Responsive Strategy

```
Mobile (< 768px):
  - Single column layout
  - Collapsible playlist
  - Full-width video
  - Stacked tabs

Tablet (768px - 1024px):
  - 2-column course grid
  - Sidebar toggleable
  - Optimized spacing

Desktop (> 1024px):
  - 3-column course grid
  - Fixed sidebar
  - Full feature set
  - Hover effects
```

---

## 🎯 Key Design Patterns

### 1. Container/Presentational

- Pages (containers)
- Components (presentational)

### 2. Composition

- Small, focused components
- Reusable across pages

### 3. Props Drilling Alternative

- Progress utilities centralized
- localStorage as single source

### 4. Event-Driven Updates

- User actions trigger updates
- Components react to changes

---

This architecture ensures:

- ✅ **Maintainability**: Clean separation of concerns
- ✅ **Scalability**: Easy to add features
- ✅ **Performance**: Optimized rendering
- ✅ **Testability**: Modular components
- ✅ **Extensibility**: Backend-ready structure
