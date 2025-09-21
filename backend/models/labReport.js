const mongoose = require('mongoose');

const doctorCommentSchema = new mongoose.Schema({
  doctorName: String,
  comment: String,
  date: { type: Date, default: Date.now }
});

const labReportSchema = new mongoose.Schema({
  reportID: { type: String, required: true },
  clerkUserId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Associate with user
  fileUrl: { type: String, required: true },
  fileSize: { type: String },
  fileType: { type: String, default: 'PDF' },
  uploadDate: { type: Date, default: Date.now },
  doctorComments: [doctorCommentSchema],

});

module.exports = mongoose.model('LabReport', labReportSchema);
