const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const User = require("../models/user"); // Import the User model
const router = express.Router();

// Middleware to validate request body for saving user data
const validateUserData = (req, res, next) => {
  const { firstName, lastName, additionalData } = req.body;

  if (!firstName && !lastName && !additionalData) {
    return res.status(400).json({
      message:
        "At least one of firstName, lastName, or additionalData is required",
    });
  }

  next();
};

// Route to save user data
router.post(
  "/save-user-data",
  ClerkExpressRequireAuth(),
  validateUserData,
  async (req, res) => {
    const clerkUserId = req.auth.userId;
    const { firstName, lastName, email } = req.body;

    try {
      let user = await User.findOne({ clerkUserId });

      if (!user) {
        // Create a new user entry if it doesn't exist
        user = new User({
          clerkUserId,
          email,
          firstName: firstName || "",
          lastName: lastName || "",
          additionalData: additionalData || "", // Ensure it's a string
        });
      } else {
        // Update existing user data
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.additionalData = additionalData || ""; // Update to a string
      }

      await user.save();
      res.status(201).json({ message: "User data saved successfully", user });
    } catch (error) {
      console.error("Error saving user data:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

router.post("/save-user", ClerkExpressRequireAuth(), async (req, res) => {
  const clerkUserId = req.auth.userId;
  const { email, firstName, lastName } = req.body;

  try {
    // Check if the user already exists in MongoDB
    const existingUser = await User.findOne({ clerkUserId });

    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    // If user doesn't exist, save them to the database
    const newUser = new User({
      clerkUserId,
      email,
      firstName,
      lastName,
    });

    await newUser.save();

    res.status(201).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error saving user to MongoDB:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get user data
router.get("/get-user-data", ClerkExpressRequireAuth(), async (req, res) => {
  const clerkUserId = req.auth.userId;

  try {
    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      additionalData: user.additionalData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find(); // Assuming you're using Mongoose
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});


//get all users- siluni
router.get('/get-all-users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

module.exports = router;
