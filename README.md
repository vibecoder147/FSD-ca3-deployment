# Alumni Directory &mdash; Full-Stack Deployment

A full-stack web application designed for cloud deployment:
- **Backend**: Node.js + Express + Sequelize ORM (deployable on [Render](https://render.com/))
- **Database**: PostgreSQL (managed service e.g., Render PostgreSQL / Neon / Supabase)
- **Frontend**: React + Vite + React Router v6 (deployable on [Vercel](https://vercel.com/))

## Project Structure
```
├── backend/                  # Node.js + Express + Sequelize ORM backend
│   ├── middleware.js         # JWT authentication & validation middleware
│   ├── models.js             # Alumni & User Sequelize models
│   ├── server.js             # REST API server & endpoints
│   ├── package.json
│   └── .env.example
├── frontend/                 # React 18 + Vite frontend
│   ├── src/                  # React components & API client
│   ├── vercel.json           # SPA rewrite rules for React Router
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── schema.sql                # PostgreSQL database schema
├── DEPLOYMENT.md             # Detailed deployment steps for Render & Vercel
└── .gitignore
```

For complete step-by-step instructions on setting up environment variables, database configuration, and cloud deployment, see [DEPLOYMENT.md](DEPLOYMENT.md).
