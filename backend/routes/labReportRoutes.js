const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const {
  uploadReport,
  getUserReports,
  getReport,
  addDoctorComment,
  getAllReportsWithUserInfo,
  deleteReport,
  updateReport
} = require('../controllers/labReportController');

const router = express.Router();

// ================== POST: Upload a report (doctor only) ==================
router.post(
  '/upload',
  ClerkExpressRequireAuth(),
  async (req, res, next) => {
    // Check role: doctor
    if (req.auth.userRole !== 'doctor') {
      return res.status(403).json({ message: 'Forbidden: Doctors only' });
    }
    next();
  },
  uploadReport
);

// ================== GET: All reports with user info (admin only) ==================
router.get(
  '/all-reports',
  ClerkExpressRequireAuth(),
  async (req, res, next) => {
    if (req.auth.userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
  },
  getAllReportsWithUserInfo
);

// ================== GET: Current logged-in user’s reports (patient only) ==================
router.get(
  '/user',
  ClerkExpressRequireAuth(),
  async (req, res, next) => {
    if (req.auth.userRole !== 'patient') {
      return res.status(403).json({ message: 'Forbidden: Patients only' });
    }
    next();
  },
  getUserReports
);

// ================== GET: Single report by ID ==================
router.get(
  '/:id',
  ClerkExpressRequireAuth(),
  getReport
  // You can add ownership check inside controller if patient should only access their own report
);

// ================== POST: Add a doctor’s comment ==================
router.post(
  '/:id/comment',
  ClerkExpressRequireAuth(),
  async (req, res, next) => {
    if (req.auth.userRole !== 'doctor') {
      return res.status(403).json({ message: 'Forbidden: Doctors only' });
    }
    next();
  },
  addDoctorComment
);

// ================== PUT: Update a report by ID ==================
router.put(
  '/:id',
  ClerkExpressRequireAuth(),
  async (req, res, next) => {
    // Only the doctor who created it or admin can update
    const role = req.auth.userRole;
    if (role !== 'doctor' && role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Only doctor or admin can update' });
    }
    next();
  },
  updateReport
);

// ================== DELETE: Delete a report by ID ==================
router.delete(
  '/:id',
  ClerkExpressRequireAuth(),
  async (req, res, next) => {
    if (req.auth.userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
  },
  deleteReport
);

module.exports = router;
