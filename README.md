# IELTSTAR — IELTS Computer-Based Mock Test Platform

English | [中文](./README_sc.md)

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

## Quick Start — Docker

```bash
# 1. Configure MongoDB connection
cp server/.env.example server/.env
# Edit server/.env → DB_URL=mongodb://your-host:27017

# 2. Start
docker compose up -d

# 3. Seed data
docker exec ieltstar-api node seed.js
docker exec ieltstar-api node seed-roles.js
```

Open `http://localhost:3000` — Login: `admin@gmail.com` / `admin123`

<details>
<summary>📄 compose.yaml template</summary>

```yaml
services:
  backend:
    image: your-dockerhub-username/ieltstar-api:latest
    container_name: ieltstar-api
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      PORT: 8080
      DB_NAME: ieltstar
      DB_URL: mongodb://your-mongo-host:27017
    networks:
      - ieltstar

  frontend:
    image: your-dockerhub-username/ieltstar-web:latest
    container_name: ieltstar-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      API_URL: http://backend:8080
    depends_on:
      - backend
    networks:
      - ieltstar

networks:
  ieltstar:
    driver: bridge
```

Replace `your-dockerhub-username` and `your-mongo-host` with your actual values.
</details>

## Deployment via Docker Hub

This repo auto-builds Docker images on push to `main` via GitHub Actions.

| Image | Path |
|-------|------|
| `yourname/ieltstar-api:latest` | Backend API |
| `yourname/ieltstar-web:latest` | Frontend |

### Setup CI/CD

1. Fork this repo
2. Go to **Settings → Secrets → Actions**, add:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
3. Push to `main` → images auto-built on [Docker Hub](https://hub.docker.com)

### Server deploy

```bash
# docker-compose.yml already uses pre-built images
docker compose up -d
docker exec ieltstar-api node seed.js
docker exec ieltstar-api node seed-roles.js
```

## Dev Setup (no Docker)

```bash
cd ieltstar && npm install --legacy-peer-deps
cd ../server && npm install
cp server/.env.example server/.env
cp ieltstar/.env.example ieltstar/.env.local
# Edit .env files

# Start
cd server && node server.js          # → :8080
cd ieltstar && npm run dev            # → :3000
```

Demo: `http://localhost:3000/test-exam` (no login required)

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


