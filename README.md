# Travel Advisor (Madhav)

A full-stack travel planning and discovery web app built for a college project.

Source Code Repository: https://github.com/madhavjindal2024-eng/traveladvisor-madhav

## Tech Stack

- Frontend: `React + Vite`
- Backend: `Node.js + Express`
- Database: `MongoDB + Mongoose`
- Auth: `JWT (httpOnly cookie) + bcrypt`
- Maps: `Leaflet + OpenStreetMap` (no API key required)
- APIs (server-side): OpenAI, OpenWeatherMap, ExchangeRate

## Project Structure

```text
traveladvisor/
  client/   -> React app
  server/   -> Express API
```

## Quick Start (Step by Step for New Users)

### 1) Clone from GitHub

```bash
git clone https://github.com/madhavjindal2024-eng/traveladvisor-madhav.git
cd traveladvisor-madhav
```

### 2) Install dependencies

Option A (from root):

```bash
npm run install:all
```

Option B (manual):

```bash
cd client && npm install
cd ../server && npm install
```

### 3) Configure environment variables

Create server env:

```bash
cd server
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update `server/.env` with at least:

- `MONGO_URI` (local MongoDB or Atlas URI)
- `JWT_SECRET` (any strong random string)

Frontend does not need map API keys. `client/.env.example` already has:

- `VITE_API_BASE_URL=/api/v1`

### 4) Start MongoDB

Use one of:

- Local MongoDB service
- MongoDB Atlas
- Docker (if installed): from project root

```bash
docker compose up -d
```

### 5) Seed sample data (first time)

```bash
cd server
npm run seed
```

### 6) Run backend and frontend

Open 2 terminals.

Terminal 1 (backend):

```bash
cd server
npm run dev
```

Terminal 2 (frontend):

```bash
cd client
npm run dev
```

### 7) Open in browser

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/health`

---

## Useful Root Scripts

From project root:

- `npm run install:all` -> install client + server dependencies
- `npm run dev:server` -> start backend in watch mode
- `npm run dev:client` -> start frontend
- `npm run seed` -> seed database
- `npm run build:client` -> production build

---

## Features Included

- Landing, Explore, Destination Detail, Planner (core pages)
- Hotels, Food guide, Blog, Reviews, Budget tools, Dashboard, Contact
- Leaflet map explorer + destination maps
- Wishlist and itinerary saving
- AI itinerary generation (mock fallback if no OpenAI key)
- Responsive glassmorphism UI theme

---

## Troubleshooting

- **Backend not starting**: check `MONGO_URI` and MongoDB availability
- **`/health` not responding**: backend may be waiting for DB connection
- **Empty destination list**: run `npm run seed` in `server/`
- **Login issues**: ensure `JWT_SECRET` exists in `server/.env`

---

## Push Your Changes to GitHub (Beginner Steps)

From project root:

```bash
git add .
git commit -m "Your message"
git push origin main
```

If your remote is not set:

```bash
git remote add origin https://github.com/madhavjindal2024-eng/traveladvisor-madhav.git
git branch -M main
git push -u origin main
```

---

## Author

- **Madhav Jindal**
- Registration No.: `24BAI1154`
- University: `VIT (Vellore Institute of Technology)`
- Email: `madhav.jindal2024@vitstudent.ac.in`
