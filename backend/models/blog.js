const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  title: { type: String, required: true },
  introduction: { type: String, required: true },
  symptoms: { type: String, required: true },
  causes: { type: String, required: true },
  prevention: { type: String, required: true },
  treatment: { type: String, required: true },
  caseStudy: { type: String },
  callToAction: { type: String, required: true },
  images: [{ type: String }], // Will store file paths for images
  videos: [{ type: String }], // Will store file paths for videos
  references: { type: String },
  relatedLinks: { type: String },
  disclaimer: { type: String },
});

module.exports = mongoose.model("Blog", BlogSchema);
