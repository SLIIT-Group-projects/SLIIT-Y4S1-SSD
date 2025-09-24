const { DoctorObserver, PatientObserver, NotificationSubject } = require('../observers/notificationObserver');
const LabReport = require('../models/labReport');
const User = require("../models/user");
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require("express-validator");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// Multer setup for file upload (with validation)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF, JPG, and PNG files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter }).single('report');

// Validation middleware
const validateReport = [
  body("reportID").isString().notEmpty().withMessage("Report ID is required"),
  body("doctorName").isString().notEmpty().withMessage("Doctor name is required"),
  body("comment").isString().notEmpty().withMessage("Comment is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

// Doctor uploads a lab report
exports.uploadReport = [
  ClerkExpressRequireAuth(),
  validateReport,
  (req, res) => {
    upload(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { reportID, comment, doctorName } = req.body;
      const clerkUserId = req.auth.userId; // ✅ use auth, not body

      try {
        const user = await User.findOne({ clerkUserId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newLabReport = new LabReport({
          reportID,
          fileUrl: req.file.path,
          fileSize: req.file.size,
          fileType: req.file.mimetype,
          userId: user._id,
          clerkUserId,
          doctorComments: [{ doctorName, comment }],
        });

        const savedReport = await newLabReport.save();
        user.labReports.push(savedReport._id);
        await user.save();

        res.status(201).json({ message: 'Lab report uploaded successfully', labReport: savedReport });
      } catch (err) {
        res.status(500).json({ message: 'Error uploading report', err });
      }
    });
  }
];

// Get single report
exports.getReport = [
  ClerkExpressRequireAuth(),
  async (req, res) => {
    try {
      const report = await LabReport.findById(req.params.id);
      if (!report) return res.status(404).json({ message: 'Report not found' });

      if (report.clerkUserId !== req.auth.userId && req.auth.userRole !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.status(200).json(report);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  }
];

// Get reports for current user
exports.getUserReports = [
  ClerkExpressRequireAuth(),
  async (req, res) => {
    try {
      const clerkUserId = req.auth.userId;
      const reports = await LabReport.find({ clerkUserId });
      if (!reports || reports.length === 0) return res.status(404).json({ message: 'No lab reports found' });
      res.status(200).json(reports);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching lab reports', err });
    }
  }
];

// Add doctor comment
exports.addDoctorComment = [
  ClerkExpressRequireAuth(),
  body("doctorName").isString().notEmpty(),
  body("comment").isString().notEmpty(),
  async (req, res) => {
    try {
      const { doctorName, comment } = req.body;
      const report = await LabReport.findById(req.params.id);
      if (!report) return res.status(404).json({ message: 'Report not found' });

      if (req.auth.userRole !== "doctor" && req.auth.userRole !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      report.doctorComments.push({ doctorName, comment });
      await report.save();

      res.status(200).json(report);
    } catch (err) {
      res.status(500).json({ message: 'Error adding comment', err });
    }
  }
];

// Admin-only: Get all reports
exports.getAllReportsWithUserInfo = [
  ClerkExpressRequireAuth(),
  (req, res, next) => {
    if (req.auth.userRole !== "admin") return res.status(403).json({ message: "Admins only" });
    next();
  },
  async (req, res) => {
    try {
      const reports = await LabReport.find().populate('userId', 'firstName lastName email clerkUserId');
      if (!reports || reports.length === 0) return res.status(404).json({ message: 'No reports found' });
      res.status(200).json(reports);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching reports', err });
    }
  }
];

// Delete report
exports.deleteReport = [
  ClerkExpressRequireAuth(),
  async (req, res) => {
    try {
      const reportId = req.params.id;
      const report = await LabReport.findById(reportId);
      if (!report) return res.status(404).json({ message: 'Lab report not found' });

      if (report.clerkUserId !== req.auth.userId && req.auth.userRole !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      await LabReport.findByIdAndDelete(reportId);
      await User.updateMany({ labReports: reportId }, { $pull: { labReports: reportId } });

      res.status(200).json({ message: 'Lab report deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting lab report', err });
    }
  }
];

// Update report
exports.updateReport = [
  ClerkExpressRequireAuth(),
  async (req, res) => {
    try {
      const reportId = req.params.id;
      const existingReport = await LabReport.findById(reportId);
      if (!existingReport) return res.status(404).json({ message: 'Lab report not found' });

      if (existingReport.clerkUserId !== req.auth.userId && req.auth.userRole !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (req.body.reportID) existingReport.reportID = req.body.reportID;
      if (req.body.doctorName && req.body.comment) {
        existingReport.doctorComments.push({ doctorName: req.body.doctorName, comment: req.body.comment });
      }

      if (req.file) {
        existingReport.fileUrl = req.file.path;
        existingReport.fileSize = req.file.size;
        existingReport.fileType = req.file.mimetype;
      }

      const updatedReport = await existingReport.save();

      const notificationSubject = new NotificationSubject();
      notificationSubject.attach(new DoctorObserver());
      notificationSubject.attach(new PatientObserver());
      notificationSubject.notify(updatedReport);

      res.status(200).json({ message: 'Lab report updated successfully', updatedReport });
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  }
];
