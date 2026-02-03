# Vidhya E-Learning Platform - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running (local or Atlas)
- Google OAuth credentials (optional, for OAuth login)

### Installation

1. **Clone and navigate to project**

   ```bash
   cd "c:\Users\akhil\OneDrive\Desktop\Akhilesh\Akhilesh"
   ```

2. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**

   Create `server/.env`:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vidhya
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
   TWITTER_API_KEY=your-twitter-api-key
   TWITTER_API_SECRET=your-twitter-api-secret
   GEMINI_API_KEY=your-gemini-api-key
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

   Create `client/.env`:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

### Running the Application

**Option 1: Run both servers separately**

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

**Option 2: Run with Docker (if docker-compose.yml configured)**

```bash
docker-compose up
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📱 Features & Routes

### Public Routes (No Auth Required)

- `/` - Landing page
- `/login` - Login page
- `/signup` - Registration page
- `/courses` - Browse courses (limited features)
- `/about` - About page
- `/tools/math` - Math helper
- `/tools/essay` - Essay helper
- `/tools/code` - Code helper

### Protected Routes (Auth Required)

- `/dashboard` - User dashboard with enrolled courses
- `/courses/:id` - Course detail with video player
- `/mock-tests` - MCQ tests with timer
- `/chat` - AI study chat
- `/lab/:subject` - Virtual science lab
- `/classroom/:id` - Classroom view
- `/profile` - User profile

## 🧪 Testing the Features

### 1. Test Authentication

```bash
# Register new user
POST http://localhost:5000/api/auth/signup
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Test Course Enrollment

1. Login to the application
2. Navigate to `/courses`
3. Click on any course
4. Click "Enroll Now"
5. View course content and progress

### 3. Test Mock Tests

1. Navigate to `/mock-tests`
2. Click "Start Test" on any test
3. Answer questions
4. Submit and view results

### 4. Test YouTube Video Embedding

1. Create a course with modules/lessons via API or database
2. Add YouTube video URL to lesson.content.videoUrl
3. Open course detail page
4. Video should embed and play

## 🛠️ Development Tools

### Useful Commands

**Client (React + Vite)**

```bash
cd client
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Server (Node + Express)**

```bash
cd server
npm run dev          # Start with nodemon
npm start            # Start production
npm run lint         # Run ESLint
```

### Database Management

**View MongoDB data**

```bash
mongosh
use vidhya
db.users.find()
db.courses.find()
```

**Seed sample courses (if needed)**

```javascript
// Create sample course in MongoDB
db.courses.insertOne({
  title: 'Introduction to Python',
  description: 'Learn Python from scratch',
  category: 'Programming',
  level: 'Beginner',
  duration: '6 weeks',
  rating: 4.9,
  students: 5000,
  modules: [
    {
      id: 1,
      title: 'Getting Started',
      lessons: [
        {
          id: 1,
          title: 'Welcome to Python',
          duration: '10 min',
          type: 'video',
          content: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            description: 'Introduction to Python programming',
          },
        },
      ],
    },
  ],
})
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution**:

- Check if MongoDB is running: `mongosh`
- Verify MONGODB_URI in server/.env
- Install MongoDB Community Edition if not installed

### Issue: "OAuth login not working"

**Solution**:

- Verify Google OAuth credentials in server/.env
- Check redirect URI matches Google Console settings
- Ensure CLIENT_URL is set correctly

### Issue: "Videos not loading"

**Solution**:

- Check YouTube URL format (should be youtube.com/watch?v=ID)
- Verify internet connection (YouTube embed requires internet)
- Check browser console for CORS errors

### Issue: "401 Unauthorized"

**Solution**:

- Check if token is in localStorage
- Verify JWT_SECRET matches between requests
- Try logging out and logging back in

### Issue: "Port already in use"

**Solution**:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

## 📊 Project Structure

```
Akhilesh/
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.jsx         # Main app component
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom hooks
│   ├── public/             # Static assets
│   └── package.json
├── server/                  # Express backend
│   ├── src/
│   │   ├── index.js        # Entry point
│   │   ├── routes/         # API routes
│   │   ├── models/         # Mongoose models
│   │   └── middleware/     # Express middleware
│   └── package.json
├── docker-compose.yml       # Docker setup
├── PROJECT_STATUS.md        # Development status
└── README.md               # This file
```

## 🔑 API Endpoints Reference

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/twitter` - Twitter OAuth

### Courses

- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/enrolled` - Get enrolled courses
- `GET /api/courses/:id/progress` - Get course progress
- `POST /api/courses/:id/lessons/:lessonId/complete` - Mark lesson complete

### AI Features

- `POST /api/ai/chat` - Chat with AI tutor
- `POST /api/ai/hint` - Get problem hint
- `POST /api/ai/explain` - Explain concept
- `POST /api/ai/practice` - Generate practice problems

### Labs

- `GET /api/labs/:subject` - Get experiments by subject

## 📝 Notes

- The app uses TanStack Query for server state caching
- Protected routes automatically redirect to /login if not authenticated
- OAuth requires HTTPS in production
- MongoDB indexes recommended for better performance
- Gemini API key required for AI features

## 🎯 Testing Checklist

Before deploying:

- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Session persists after refresh
- [ ] Can logout successfully
- [ ] Can enroll in course
- [ ] Videos play correctly
- [ ] Progress tracking works
- [ ] Mock tests timer works
- [ ] Can mark lessons complete
- [ ] About page renders
- [ ] All navigation links work
- [ ] Responsive on mobile

---

**Need help?** Check PROJECT_STATUS.md for detailed feature documentation.
