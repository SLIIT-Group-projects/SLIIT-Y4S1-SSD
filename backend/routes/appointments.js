const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { body, validationResult } = require("express-validator");

const Appointment = require("../models/appointment");
const AppointmentFactory = require("../factory/AppointmentFactory");

const router = express.Router();

// ================== Validation Middleware ==================
const validateAppointment = [
  body("date").isISO8601().withMessage("Invalid or missing date"),
  body("time").isString().notEmpty().withMessage("Time is required"),
  body("doctorId").isString().notEmpty().withMessage("Doctor ID is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// ================== Ownership Middleware ==================
async function requireAppointmentOwnership(req, res, next) {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.clerkUserId !== req.auth.userId) {
      return res.status(403).json({ message: "Forbidden: You do not own this appointment" });
    }
    req.appointment = appointment;
    next();
  } catch (err) {
    console.error("Ownership check error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ================== Role Middleware ==================
function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth || req.auth.userRole !== role) {
      return res.status(403).json({ message: `Forbidden: ${role} only` });
    }
    next();
  };
}

// ================== Routes ==================

// POST: Create new appointment (patient)
router.post(
  "/create-appointment",
  ClerkExpressRequireAuth(),
  validateAppointment,
  async (req, res) => {
    const clerkUserId = req.auth.userId;
    try {
      const { date, time, doctorId } = req.body;
      const newAppointment = AppointmentFactory.createAppointment({
        date,
        time,
        doctorId,
        clerkUserId,
        status: "Pending"
      });
      await newAppointment.save();

      res.status(201).json({
        message: "Appointment created successfully",
        appointment: newAppointment,
      });
    } catch (err) {
      console.error("Error creating appointment:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET: Doctor's pending appointments (doctor only)
router.get(
  "/get-doctor-appointments",
  ClerkExpressRequireAuth(),
  requireRole("doctor"),
  async (req, res) => {
    const doctorId = req.auth.userId;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const appointments = await Appointment.find({
        doc_id: doctorId,
        status: "Pending",
        appointment_date: { $gte: today, $lt: tomorrow },
      });

      if (!appointments.length) {
        return res.status(404).json({ message: "No pending appointments for today." });
      }

      res.status(200).json({
        message: "Today's pending appointments retrieved successfully.",
        appointments,
      });
    } catch (err) {
      console.error("Error fetching doctor appointments:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// GET: Patient appointments (patient only)
router.get(
  "/get-patient-appointments",
  ClerkExpressRequireAuth(),
  requireRole("patient"),
  async (req, res) => {
    const clerkUserId = req.auth.userId;
    try {
      const appointments = await Appointment.find({ clerkUserId });
      if (!appointments.length) {
        return res.status(404).json({ message: "No appointments found" });
      }

      res.status(200).json({
        message: "Appointments retrieved successfully",
        appointments
      });
    } catch (err) {
      console.error("Error fetching patient appointments:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// GET: All appointments (admin only)
router.get(
  "/get-all-appointments",
  ClerkExpressRequireAuth(),
  requireRole("admin"),
  async (req, res) => {
    try {
      const appointments = await Appointment.find();
      if (!appointments.length) {
        return res.status(404).json({ message: "No appointments found" });
      }

      res.status(200).json({
        message: "Appointments retrieved successfully",
        appointments
      });
    } catch (err) {
      console.error("Error fetching all appointments:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// PUT: Update appointment status (owner only)
router.put(
  "/appointment-update/:id",
  ClerkExpressRequireAuth(),
  requireAppointmentOwnership,
  async (req, res) => {
    try {
      req.appointment.status = "Completed";
      const updated = await req.appointment.save();
      res.status(200).json({
        status: "Appointment status updated to completed",
        appointment: updated
      });
    } catch (err) {
      console.error("Error updating appointment:", err);
      res.status(500).json({ status: "Error updating appointment", error: err.message });
    }
  }
);

// DELETE: Delete appointment (owner only)
router.delete(
  "/delete-appointment/:id",
  ClerkExpressRequireAuth(),
  requireAppointmentOwnership,
  async (req, res) => {
    try {
      await Appointment.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (err) {
      console.error("Error deleting appointment:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
