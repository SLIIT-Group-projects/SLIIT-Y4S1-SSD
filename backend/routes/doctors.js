// /routes/blogRoutes.js
const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const Doctor = require("../models/doctor");

const router = express.Router();

// POST request to create a new doctor
router.post(
  "/create-doctor",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    const clerkUserId = req.auth.userId;
    try {
      // Retrieve the logged-in user's name and email from Clerk
      const name = req.auth.firstName + " " + req.auth.lastName;
      const email = "test@gmail.com"; // Note: This is hardcoded. Adjust as necessary.

      // Get day, slot, and experience from request body, expecting them as arrays
      const { day, slot, experience, bio } = req.body;

      // Ensure day and slot are arrays
      if (!Array.isArray(day) || !Array.isArray(slot)) {
        return res.status(400).json({ message: "Day and slot should be arrays" });
      }

      // Ensure experience and bio are defined
      if (!experience || typeof experience !== 'string') {
        return res.status(400).json({ message: "Experience is required and should be a string." });
      }
      if (!bio || typeof bio !== 'string') {
        return res.status(400).json({ message: "Bio is required and should be a string." });
      }

      // Create a new doctor record
      const newDoctor = new Doctor({
        clerkUserId,
        name,
        experience,
        bio,
        email,
        day,
        slot,
      });

      // Save the doctor record to the database
      await newDoctor.save();

      res.status(201).json({ message: "Doctor created successfully", doctor: newDoctor });
    } catch (err) {
      console.error("Error creating doctor:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


// all doctor selection
router.get("/all-doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find(); // Assuming you're using Mongoose
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching doctors" });
  }
});

// get one doctor details
router.get("/doctor-details/:name", async (req, res) => {
  const doctorName = req.params.name; // Get the doctor's name from the URL parameters

  try {
      // Find doctors that match the name (case insensitive)
      const doctors = await Doctor.find({ name: { $regex: new RegExp(doctorName, "i") } });

      if (doctors.length === 0) {
          return res.status(404).json({ message: "No doctors found with that name" });
      }

      res.json(doctors);
  } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ error: "Error fetching doctors" });
  }
});


module.exports = router;
