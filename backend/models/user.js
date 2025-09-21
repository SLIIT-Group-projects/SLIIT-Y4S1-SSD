const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['doctor', 'user'], default: 'user' },
  labReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LabReport' }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
