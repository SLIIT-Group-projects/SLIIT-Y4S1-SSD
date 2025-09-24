const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const Doctor = require("../models/doctor");

const router = express.Router();

// ================== POST: Create a new doctor (authenticated) ==================
router.post(
  "/create-doctor",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    const clerkUserId = req.auth.userId;

    try {
      const name = req.auth.firstName + " " + req.auth.lastName;
      const email = "test@gmail.com"; // Adjust as needed

      const { day, slot, experience, bio } = req.body;

      // Validate inputs
      if (!Array.isArray(day) || !Array.isArray(slot)) {
        return res.status(400).json({ message: "Day and slot should be arrays" });
      }
      if (!experience || typeof experience !== "string") {
        return res.status(400).json({ message: "Experience is required and should be a string" });
      }
      if (!bio || typeof bio !== "string") {
        return res.status(400).json({ message: "Bio is required and should be a string" });
      }

      const newDoctor = new Doctor({
        clerkUserId,
        name,
        experience,
        bio,
        email,
        day,
        slot,
      });

      await newDoctor.save();
      res.status(201).json({ message: "Doctor created successfully", doctor: newDoctor });
    } catch (err) {
      console.error("Error creating doctor:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// ================== GET: All doctors (public) ==================
router.get("/all-doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// ================== GET: Doctor details by name (public) ==================
router.get("/doctor-details/:name", async (req, res) => {
  const doctorName = req.params.name;

  try {
    const doctors = await Doctor.find({ name: { $regex: new RegExp(doctorName, "i") } });
    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found with that name" });
    }
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctor details:", err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

module.exports = router;
