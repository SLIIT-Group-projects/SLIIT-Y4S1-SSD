const express = require("express");
const Record = require("../models/record");  // Assuming the Record model is in the models folder
const User = require("../models/user");      // Assuming User model exists for the patient
const router = express.Router();
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node"); // Assuming Clerk is used for authentication

// Create a new medical record for a patient
router.post("/add-record", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    // Fetch the logged-in doctor (logged-in user is a doctor)
    const doctorId = req.auth.userId;  // Using Clerk's auth (you can replace this with your auth solution)

    // Fetch patient ID from AllPatients (sent from frontend)
    const { userId, records, prescription, specialNotes } = req.body;

    // Create a new record
    const newRecord = new Record({
      doctorId,        // Fetched from the logged-in doctor
      userId,  // Patient ID fetched from User model
      records,         // Records sent from frontend
      prescription,    // Array of prescription strings
      specialNotes,    // Special notes for the patient
    });

    // Save the record
    await newRecord.save();

    // Send success response
    res.status(201).json({ message: "Record created successfully", record: newRecord });
  } catch (error) {
    console.error("Error creating record:", error);
    res.status(500).json({ error: "An error occurred while creating the record" });
  }
});

router.get("/getAllRecords",  async (req, res) => {
    try {
      console.log("Received GET /record/getAllRecords request");
  
      const reports = await Record.find().populate("userId", "firstName lastName email");
      if (!reports || reports.length === 0) {
        return res.status(404).json({ message: 'No records found.' });
      }
  
      res.status(200).json({ reports });
    } catch (error) {
      console.error("Error fetching all records:", error);
      res.status(500).json({ error: "An error occurred while fetching records" });
    }
  });

  // Route to get all records for a specific patient
router.get("/get-records/:userId", async (req, res) => {
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
});


router.get("/user-records", ClerkExpressRequireAuth(), async (req, res) => {
  console.log("Authenticated user ID:", req.auth.userId); // Log the Clerk user ID
  const clerkUserId = req.auth.userId;

  try {
    // Find the user in your database using the clerkUserId
    const user = await User.findOne({ clerkUserId: clerkUserId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use the user's ObjectId to query the records
    const records = await Record.find({ userId: user._id });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    res.status(200).json({
      message: "Records retrieved successfully",
      records
    });
  } catch (error) {
    console.error("Error fetching user records:", error);
    res.status(500).json({ message: "An error occurred while fetching user records." });
  }
});



module.exports = router;
