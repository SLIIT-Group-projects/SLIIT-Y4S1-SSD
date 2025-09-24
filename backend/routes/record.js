const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const Record = require("../models/record");
const User = require("../models/user");

const router = express.Router();

// ================== POST: Add new medical record (doctor only) ==================
router.post(
  "/add-record",
  ClerkExpressRequireAuth(),
  async (req, res, next) => {
    if (req.auth.userRole !== "doctor") {
      return res.status(403).json({ message: "Forbidden: Doctors only" });
    }
    next();
  },
  async (req, res) => {
    try {
      const doctorId = req.auth.userId;
      const { userId, records, prescription, specialNotes } = req.body;

      const newRecord = new Record({
        doctorId,
        userId,
        records,
        prescription,
        specialNotes,
      });

      await newRecord.save();
      res.status(201).json({ message: "Record created successfully", record: newRecord });
    } catch (error) {
      console.error("Error creating record:", error);
      res.status(500).json({ error: "An error occurred while creating the record" });
    }
  }
);

// ================== GET: All records (admin only) ==================
router.get(
  "/getAllRecords",
  ClerkExpressRequireAuth(),
  async (req, res, next) => {
    if (req.auth.userRole !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  },
  async (req, res) => {
    try {
      const reports = await Record.find().populate("userId", "firstName lastName email");
      if (!reports || reports.length === 0) {
        return res.status(404).json({ message: "No records found." });
      }
      res.status(200).json({ reports });
    } catch (error) {
      console.error("Error fetching all records:", error);
      res.status(500).json({ error: "An error occurred while fetching records" });
    }
  }
);

// ================== GET: Records for a specific patient (doctor/admin only) ==================
router.get(
  "/get-records/:userId",
  ClerkExpressRequireAuth(),
  async (req, res, next) => {
    const role = req.auth.userRole;
    if (role !== "doctor" && role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Only doctors or admin can access" });
    }
    next();
  },
  async (req, res) => {
    try {
      const { userId } = req.params;
      const records = await Record.find({ userId }).populate("userId", "firstName lastName email");

      if (!records || records.length === 0) {
        return res.status(404).json({ message: "No records found for this patient." });
      }
      res.status(200).json({ records });
    } catch (error) {
      console.error("Error fetching records:", error);
      res.status(500).json({ error: "An error occurred while fetching records." });
    }
  }
);

// ================== GET: Records for the currently logged-in patient ==================
router.get("/user-records", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const user = await User.findOne({ clerkUserId });

    if (!user) return res.status(404).json({ message: "User not found" });

    const records = await Record.find({ userId: user._id });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    res.status(200).json({
      message: "Records retrieved successfully",
      records,
    });
  } catch (error) {
    console.error("Error fetching user records:", error);
    res.status(500).json({ message: "An error occurred while fetching user records." });
  }
});

module.exports = router;


