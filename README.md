# 🌟 Lumina - The Universal Adaptive Learning Ecosystem

<div align="center">

![Lumina Logo](./client/public/icons/icon-192x192.png)

**Learn anywhere, anytime, at your own pace**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248?logo=mongodb)](https://www.mongodb.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 🎯 Overview

Lumina is a comprehensive Progressive Web Application (PWA) designed to revolutionize education through adaptive learning, AI-powered tutoring, and immersive virtual labs. Whether you're a student, educator, or parent, Lumina provides the tools you need for effective, engaging learning.

### ✨ Key Features

- 🤖 **AI-Powered Tutoring** - Socratic learning with personalized guidance
- 🧪 **Virtual Labs** - Immersive 3D/VR science experiments
- 📚 **Adaptive Curriculum** - Personalized learning paths
- 👥 **Live Classrooms** - Real-time collaboration with breakout rooms
- 🌐 **PWA Offline Mode** - Learn anywhere, even without internet
- ♿ **Full Accessibility** - Dyslexia mode, screen reader support, focus mode
- 📊 **Advanced Analytics** - Track progress with AI-generated insights
- 🎮 **Gamification** - XP, levels, achievements, and leaderboards

---

## 🏗️ Architecture

```
lumina/
├── client/                 # React + Vite frontend
│   ├── public/            # Static assets & PWA manifest
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Route components
│       ├── hooks/         # Custom React hooks
│       ├── store/         # Redux state management
│       └── services/      # API services
│
└── server/                # Node.js + Express backend
    └── src/
        ├── middleware/    # Auth, error handling
        ├── models/        # MongoDB schemas
        └── routes/        # API endpoints
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lumina.git
   cd lumina
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Client
   cp client/.env.example client/.env
   
   # Server
   cp server/.env.example server/.env
   ```
   
   Edit the `.env` files with your configuration.

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Run development servers**
   ```bash
   # Run both client and server
   npm run dev
   
   # Or run separately
   npm run dev:client
   npm run dev:server
   ```

6. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 📖 Feature Guide

### 🤖 AI Tutor (Lumina)

The AI tutor supports three modes:
- **Socratic Mode** - Guides learning through questions
- **Direct Mode** - Provides clear explanations
- **Guided Mode** - Offers hints without giving away answers

### 🧪 Virtual Labs

Immersive 3D experiments using WebGL/WebXR:
- Chemistry: Titration, Electrolysis, Combustion
- Physics: Pendulum, Optics, Circuits
- Biology: Cell Division, Photosynthesis

### 👥 Live Classrooms

Real-time collaboration features:
- Whiteboard sharing
- Polls and quizzes
- Hand raising
- Breakout rooms
- Chat with moderation

### ♿ Accessibility

Built with WCAG 2.1 AA compliance:
- **Dyslexia Mode** - OpenDyslexic font, increased spacing
- **Focus Mode** - Removes distractions
- **High Contrast** - Enhanced visibility
- **Reduced Motion** - Respects user preferences
- **Screen Reader** - Full ARIA support

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/profile` | Get current user |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/:id` | Get course details |
| POST | `/api/courses/:id/enroll` | Enroll in course |

### AI Tutor
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat with AI |
| POST | `/api/ai/hint` | Get problem hint |
| POST | `/api/ai/explain` | Explain concept |

### Labs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/labs` | List experiments |
| POST | `/api/labs/:id/submit` | Submit results |

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#4a1d6a` | Headers, primary actions |
| Coral | `#ff4757` | CTAs, accents |
| Teal | `#00c9a0` | Success states |
| Dark | `#1a1a2e` | Backgrounds |

### Typography
- **Headings**: Inter (600-800 weight)
- **Body**: Inter (400-500 weight)
- **Monospace**: Fira Code (code blocks)

---

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Redux Toolkit + React Query
- React Three Fiber (3D)
- Tailwind CSS
- Framer Motion
- Socket.io Client

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- LangChain.js (AI)
- JWT Authentication

### DevOps
- PWA with Workbox
- Docker support
- Vercel/Railway deployment

---

## 📱 PWA Features

Lumina works offline with:
- ✅ Downloaded lessons
- ✅ Cached exercises
- ✅ Offline quizzes
- ✅ Progress sync when online
- ✅ Push notifications
- ✅ Add to home screen

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) for 3D rendering
- [LangChain](https://langchain.com/) for AI capabilities
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

<div align="center">

**Built with ❤️ for learners everywhere**

[Documentation](docs/) · [Report Bug](issues/) · [Request Feature](issues/)

</div>
