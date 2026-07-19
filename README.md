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
# 1. Configure compose.yaml with your MongoDB connection
# 2. Start (single container, auto-seeds database on first run)
docker compose up -d
```

Open `http://localhost:3000` — Login: `admin@gmail.com` / `admin123`

<details>
<summary>📄 compose.yaml template</summary>

```yaml
services:
  ieltstar:
    image: xmmtx/ieltstar:latest
    container_name: ieltstar
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DB_NAME: ieltstar
      DB_URL: mongodb://host.docker.internal:27017
      DB_USER: ""
      DB_PASS: ""
    extra_hosts:
      - "host.docker.internal:host-gateway"
```
> 💡 **Single container**: Next.js rewrites `/api/*` to internal Express. No `API_URL` needed!
> 
> For external MongoDB, set `DB_URL` to your connection string. For Docker-hosted MongoDB, use service name instead of `host.docker.internal`.

</details>

## Deployment

This repo auto-builds a **single Docker image** on push to `main` via GitHub Actions.

| Image | Docker Hub | ACR (cn-hangzhou) |
|-------|-----------|-------------------|
| ieltstar | `yourname/ieltstar:latest` | `registry.cn-shanghai.aliyuncs.com/ieltstar/ieltstar:latest` |

### GitHub Secrets

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |

### Server deploy

```bash
# 1. Edit compose.yaml → set DB_URL to your MongoDB
# 2. Start (auto-seeds on first run)
docker compose up -d
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


