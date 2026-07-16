# IELTSTAR — IELTS Computer-Based Mock Test Platform

A full-stack IELTS Academic mock test platform for **Listening, Reading, and Writing**, designed to simulate the official British Council computer-delivered IELTS experience. Built for **金华米德尔顿学校 (Jinhua Middleton School)**.

## Features

- 🎧 **Listening** — Single-column question layout with audio player
- 📖 **Reading** — Left passage / right questions split with **text highlighter**
- ✍️ **Writing** — Left task / right writing area with **live word count** (Task 1 & 2)
- ⏱️ **Per-section timer** — Independent timers for each section (30/60 min)
- ✅ **Auto-scoring** — Listening & Reading answers auto-graded with band scores
- 🖍️ **Text highlighter** — Select to highlight, click to remove
- 📝 **Notes panel** — Built-in notepad
- 🧭 **Bottom navigation** — Switch between sections with answer status

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 13, React 18, TypeScript, MUI v5 |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| Auth | Auth0 (configurable) |

## Quick Start

### Option A: Docker Compose (recommended)

```bash
# 1. Clone and configure
cp server/.env.example server/.env
# Edit server/.env → set DB_URL to your MongoDB

# 2. Start
docker compose up -d

# 3. Seed data (first time only)
docker exec ieltstar-api node seed.js
docker exec ieltstar-api node seed-roles.js

# 4. Open
# Frontend: http://localhost:3000
# Admin: admin@gmail.com / admin123
```

### Option B: Manual

#### Prerequisites
- Node.js ≥18
- MongoDB (local or Atlas)

#### 1. Install dependencies
```bash
cd ieltstar && npm install --legacy-peer-deps
cd ../server && npm install
```

#### 2. Configure environment
```bash
cp ieltstar/.env.example ieltstar/.env.local
cp server/.env.example server/.env
# Edit files with your values
```

### 4. Seed the database
```bash
cd server && node seed.js
```

### 5. Start the servers
```bash
# Backend (port 8080)
cd server && node server.js

# Frontend (port 3000)
cd ieltstar && npm run dev
```

### 6. Open
- **Demo exam**: `http://localhost:3000/test-exam` (no login required)
- **Full app**: `http://localhost:3000` (requires Auth0 setup)

## Project Structure

```
ieltstar/         # Next.js frontend
├── components/TestComponents/ExamV2/  # New IELTS exam UI
│   ├── ExamLayout.jsx    # Main exam layout
│   ├── ExamTopBar.jsx    # Fixed top bar + timer
│   ├── ReadingView.jsx   # Left passage / right questions
│   ├── WritingView.jsx   # Left task / right textarea
│   ├── ListeningView.jsx # Single-column questions
│   └── BottomNav.jsx     # Section navigation
├── pages/test-exam.jsx   # Demo page (no auth required)
└── pages/student/exam/[id].jsx  # Real exam page

server/           # Express backend
├── api/
│   ├── models/     # Mongoose schemas
│   ├── controllers/
│   ├── services/
│   └── routes/
└── seed.js        # Database seeder
```

## Environment Variables

Copy `.env.example` to `.env.local` (frontend) and `.env` (backend). Never commit actual secrets.

See `.env.example` files for the full list of required variables.

## License

Original project by Amey Bansod, Harshil Shah, Keerthana Satheesh, Saloni Talwar (Northeastern University). Adapted for school use.


