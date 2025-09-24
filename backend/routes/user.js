const express = require("express"); 
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

// Validation middleware
const validateUser = [
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("firstName").optional().isString().trim().escape(),
  body("lastName").optional().isString().trim().escape(),
  body("additionalData").optional().isString().trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Role check middleware (for admin-only routes)
function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth || req.auth.userRole !== role) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  };
}

// Route to save or update user data
router.post(
  "/save-user",
  ClerkExpressRequireAuth(),
  validateUser,
  async (req, res) => {
    const clerkUserId = req.auth.userId;
    const { firstName, lastName, email, additionalData } = req.body;

    try {
      let user = await User.findOne({ clerkUserId });

      if (!user) {
        user = new User({
          clerkUserId,
          email: email || "",
          firstName: firstName || "",
          lastName: lastName || "",
          additionalData: additionalData || "",
        });
      } else {
        if (email) user.email = email;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (additionalData) user.additionalData = additionalData;
      }

      await user.save();
      res.status(201).json({ message: "User saved successfully", user });
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
);

// Route to get current user data
router.get("/get-user-data", ClerkExpressRequireAuth(), async (req, res) => {
  const clerkUserId = req.auth.userId;

  try {
    const user = await User.findOne({ clerkUserId });
    if (!user) return res.status(404).json({ message: "User not found" });

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

// Admin-only: Get all users
router.get("/all-users",
  ClerkExpressRequireAuth(),
  requireRole("admin"),
  async (req, res) => {
    try {
      const users = await User.find();
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found." });
      }
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

module.exports = router;
