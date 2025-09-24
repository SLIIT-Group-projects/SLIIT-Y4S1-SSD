const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");              

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const labReportRoutes = require("./routes/labReportRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const helmet = require("helmet");
require("dotenv").config();
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

require("./dbconnection"); // This will initiate the MongoDB connection
const recordRoute = require("./routes/record");

const app = express();
const PORT = process.env.PORT || 5000;

// Core middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet()); // CORS (keep permissive for dev only)

// siluni
// ✅ Restrict CORS origins
const allowedOrigins = [
  "http://localhost:5173",         // dev frontend
  "https://your-production-domain.com" // prod frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser clients (curl, Postman)
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy: origin not allowed"), false);
      }
      return callback(null, origin);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// daham X frame-option
// anti-clickjacking
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 200,              // 200 requests per IP per minute
  standardHeaders: true, // adds RateLimit-* headers
  legacyHeaders: false,
  message: { error: "Too many requests, please slow down." },
});

// Sensitive limiter – tighter limits for auth-ish / heavy routes
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                   // 30 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication requests, try again later." },
});

// Apply BEFORE routes:
app.use("/api", apiLimiter);             
app.use("/user", apiLimiter);       
app.use("/api/users", apiLimiter); 
// app.use("/appointment", sensitiveLimiter);
app.use("/api/reports", apiLimiter);
app.use("/record", apiLimiter);

// add this in server.js
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});


// Static files (⚠️ consider removing public /uploads in production)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.use("/doctor", doctorRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/api/reports", labReportRoutes);
app.use("/api/users", userRoutes);
app.use("/record", recordRoute);

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
