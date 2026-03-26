# ApexQuest LMS (Project_sem7)

A full-stack learning management system built with a **MERN-style architecture**:

- **Frontend:** React + Vite + Redux Toolkit
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)
- **Integrations:** Cloudinary, Razorpay, Gemini API

---

## 1) Run locally (quick start)

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection string
- Cloudinary account
- Razorpay account (optional for testing non-payment flows)

### Setup

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

3. Create env files:
   - `backend/.env` from `backend/.env.example`
   - `frontend/.env` from `frontend/.env.example`

4. Start backend:
   ```bash
   cd backend
   npm run dev
   ```

5. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. Open app:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## 2) Deploy to a real-world production setup

This is the simplest reliable production flow for this repo:

- **Backend API on Render**
- **Frontend on Vercel**
- **Database on MongoDB Atlas**

### A. Deploy backend (Render)

1. Push this repo to GitHub.
2. In Render: **New +** → **Web Service** → connect your repo.
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables from `backend/.env.example`.
5. Deploy and copy your backend URL (example: `https://apexquest-api.onrender.com`).

### B. Deploy frontend (Vercel)

1. In Vercel: **Add New Project** → import the same repo.
2. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variable:
   - `VITE_SERVER_URL=https://<your-render-backend-url>`
4. Deploy and copy your frontend URL.

### C. Final CORS setup

After frontend deploy is ready, update backend env on Render:

- `FRONTEND_URL=https://<your-vercel-frontend-url>`

Then redeploy backend.

### D. Smoke-test production

- Open frontend URL and sign up/login.
- Check backend health endpoint:
  - `GET https://<backend-url>/api/health`
- Create a course, upload media, and test payments if Razorpay keys are configured.

---

## 3) One-click Render blueprint (optional)

This repo includes a `render.yaml` blueprint to provision services quickly in Render.

- Create a **Blueprint** in Render and point it to this repo.
- Fill all environment variables during setup.

---

## 4) Environment variables

Use these example files:

- Backend: `backend/.env.example`
- Frontend: `frontend/.env.example`

Never commit real secrets.
