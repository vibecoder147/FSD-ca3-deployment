require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize, Alumni, User } = require("./models");
const { authenticate, validateAlumni, errorHandler } = require("./middleware");

const REQUIRED = ["DATABASE_URL", "JWT_SECRET", "CORS_ORIGINS"];
const missing = REQUIRED.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const allowedOrigins = (process.env.CORS_ORIGINS || "*").split(",").map((o) => o.trim());
const app = express();
function checkOrigin(origin, cb) {
  if (
    !origin ||
    allowedOrigins.includes("*") ||
    allowedOrigins.includes(origin) ||
    origin.endsWith(".vercel.app")
  ) {
    return cb(null, true);
  }
  return cb(Object.assign(new Error("CORS origin not allowed"), { status: 403 }));
}

app.use(cors({
  origin: checkOrigin,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use((req, res, next) => { req.body ??= {}; next(); }); // Express 5 leaves body undefined when empty

// Express 4 does not forward rejected promises, so each async handler is wrapped
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const notFound = (res) => res.status(404).json({ message: "Alumni not found" });

// Health check endpoint for deployment monitoring
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// CRUD routes (Sequelize)
app.get("/api/alumni", wrap(async (req, res) => {
  res.json(await Alumni.findAll({ order: [["fullName", "ASC"]] }));
}));

app.get("/api/alumni/:id", wrap(async (req, res) => {
  const record = await Alumni.findByPk(req.params.id);
  record ? res.json(record) : notFound(res);
}));

app.post("/api/alumni", validateAlumni(false), wrap(async (req, res) => {
  const record = await Alumni.create(req.body);
  res.status(201).location(`/api/alumni/${record.id}`).json(record);
}));

app.put("/api/alumni/:id", validateAlumni(false), wrap(async (req, res) => {
  const record = await Alumni.findByPk(req.params.id);
  if (!record) return notFound(res);
  res.json(await record.update(req.body));
}));

app.patch("/api/alumni/:id", validateAlumni(true), wrap(async (req, res) => {
  const record = await Alumni.findByPk(req.params.id);
  if (!record) return notFound(res);
  res.json(await record.update(req.body));
}));

app.delete("/api/alumni/:id", authenticate, wrap(async (req, res) => {
  const deleted = await Alumni.destroy({ where: { id: req.params.id } });
  deleted ? res.status(204).end() : notFound(res);
}));

// Auth routes (User model, bcrypt, JWT)
app.post("/api/auth/register", wrap(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ message: "email and a password of 8+ characters are required" });
  }
  const user = await User.create({ email, passwordHash: await bcrypt.hash(password, 12) });
  res.status(201).json({ id: user.id, email: user.email });
}));

app.post("/api/auth/login", wrap(async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email || "" } });
  const ok = user && (await bcrypt.compare(req.body.password || "", user.passwordHash));
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, tokenType: "Bearer", expiresIn: "1h" });
}));

// Protected route
app.get("/api/auth/me", authenticate, wrap(async (req, res) => {
  const user = await User.findByPk(req.user.sub);
  user ? res.json({ id: user.id, email: user.email }) : res.status(404).json({ message: "User not found" });
}));

app.use((req, res) => res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` }));
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;
sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => app.listen(PORT, () => console.log(`API with PostgreSQL on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error("Startup failed:", err.message);
    process.exit(1);
  });
