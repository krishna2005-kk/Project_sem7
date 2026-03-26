# ApexQuest LMS (Project_sem7)

ApexQuest is a MERN-based learning management platform with:
- JWT authentication
- course/lecture management
- enrollment & payment flow (Razorpay)
- AI learning assistant (Gemini)

## Project structure

- `frontend/` → Vite + React app
- `backend/` → Node.js + Express API

---

## 1) Run locally (development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)
- Cloudinary account
- Razorpay keys

### Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

Start backend:

```bash
npm run dev
```

### Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_SERVER_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start frontend:

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## 2) Deploy as a real-world app (recommended stack)

### A. Deploy backend to Render

1. Push repository to GitHub.
2. In Render, create **Web Service** from this repo.
3. Configure:
   - **Root directory**: `backend`
   - **Build command**: `npm install`
   - **Start command**: `npm start`
4. Add backend environment variables (same as `backend/.env`).
5. Set `FRONTEND_URL` to your frontend production URL.
   - If you have multiple frontends/domains, separate them with commas.

Example:

```env
FRONTEND_URL=https://your-frontend.vercel.app,https://www.yourdomain.com
```

6. Deploy and copy the generated backend URL (example: `https://apexquest-api.onrender.com`).

### B. Deploy frontend to Vercel

1. In Vercel, import the same GitHub repo.
2. Set **Root directory** to `frontend`.
3. Build settings:
   - Install: `npm install`
   - Build: `npm run build`
   - Output directory: `dist`
4. Add environment variables:

```env
VITE_SERVER_URL=https://your-render-backend-url.onrender.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

5. Deploy.

### C. Final production checklist

- Update backend `FRONTEND_URL` with the final Vercel domain.
- Verify CORS and cookies/sign-in flow in production.
- Test payment flow with Razorpay test mode first.
- Ensure MongoDB Atlas network access allows Render IPs (or allow from anywhere with strong credentials).
- Use strong secrets and rotate them if leaked.

---

## 3) Common issues

### CORS error
- Ensure `FRONTEND_URL` exactly matches frontend origin (including `https://`).
- For multiple origins, use comma-separated values.

### 404/Network error from frontend
- Check `VITE_SERVER_URL` points to live backend URL.
- Confirm backend service is running and reachable.

### Login/cookie problems
- Ensure frontend and backend are both HTTPS in production.
- Confirm API calls include credentials where needed.

---

## 4) Suggested next upgrades

- Add CI/CD pipelines (GitHub Actions) for automatic deploy.
- Add Dockerfiles + docker-compose for consistent environments.
- Add health checks and error monitoring (Sentry/Logtail).
