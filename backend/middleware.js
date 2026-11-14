const jwt = require("jsonwebtoken");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUSES = ["active", "inactive", "pending"];
const FIELDS = ["fullName", "email", "gradYear", "status"];

function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Send header: Authorization: Bearer <token>" });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// partial = true for PATCH (only supplied fields are checked)
function validateAlumni(partial) {
  return (req, res, next) => {
    const body = Object.fromEntries(
      FIELDS.filter((f) => req.body[f] !== undefined)
        .map((f) => [f, typeof req.body[f] === "string" ? req.body[f].trim() : req.body[f]])
    );
    const has = (f) => !partial || body[f] !== undefined;
    const maxYear = new Date().getFullYear() + 5;
    const errors = [];

    if (partial && Object.keys(body).length === 0) errors.push("send at least one field");
    if (has("fullName") && (typeof body.fullName !== "string" || body.fullName.length < 3)) {
      errors.push("fullName must be at least 3 characters");
    }
    if (has("email") && !EMAIL_PATTERN.test(body.email)) errors.push("email is not valid");
    if (has("gradYear") && !(Number.isInteger(body.gradYear) && body.gradYear >= 1950 && body.gradYear <= maxYear)) {
      errors.push(`gradYear must be an integer from 1950 to ${maxYear}`);
    }
    if (has("status") && !STATUSES.includes(body.status)) errors.push(`status must be ${STATUSES.join(", ")}`);

    if (errors.length) return res.status(400).json({ message: "Validation failed", errors });
    req.body = body;
    next();
  };
}

// Central error handler: Sequelize errors, malformed JSON, and generic failures
function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON" });
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Email already exists" });
  }
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ message: "Validation failed", errors: err.errors.map((e) => e.message) });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.status < 500 ? err.message : "Internal server error" });
}

module.exports = { authenticate, validateAlumni, errorHandler };
