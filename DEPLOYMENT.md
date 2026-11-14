# Alumni Directory: Full-Stack Deployment

## 1. Database (PostgreSQL)
Create a PostgreSQL database (Render PostgreSQL or any managed service) and copy its connection URL.
The tables are created automatically on first start (Sequelize sync). `schema.sql` shows the generated schema.

## 2. Backend on Render
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables (set in the Render dashboard, never in code):
  - `NODE_ENV=production`
  - `DATABASE_URL=<Render PostgreSQL internal or external URL>`
  - `JWT_SECRET=<long random string>`
  - `CORS_ORIGINS=https://<your-app>.vercel.app`

Health check: `https://<your-backend>.onrender.com/api/health`

## 3. Frontend on Vercel
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://<your-backend>.onrender.com/api`
- `vercel.json` rewrites all routes to `index.html` so React Router deep links work.

## 4. Local run
- Backend: copy `backend/.env.example` to `backend/.env`, fill in values, then `npm install` and `npm start` (port 4000).
- Frontend: `npm install`, copy `.env.example` to `.env`, then `npm run dev` (port 5173).
