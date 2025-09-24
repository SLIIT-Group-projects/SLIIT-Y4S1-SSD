const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

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

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use routes
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.use("/doctor", doctorRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/api/reports", labReportRoutes);
app.use("/api/users", userRoutes);
app.use("/record", recordRoute);

// Only start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for testing
module.exports = app;