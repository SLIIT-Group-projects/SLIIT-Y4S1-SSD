const { DoctorObserver, PatientObserver, NotificationSubject } = require('../observers/notificationObserver');
const LabReport = require('../models/labReport');
const User= require("../models/user");
const multer = require('multer');
const path = require('path');

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Appends extension
  }
});

const upload = multer({ storage: storage }).single('report');

// Doctor Upload a lab report for a specific user
exports.uploadReport = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    
    const { reportID,clerkUserId, comment, doctorName } = req.body;
    try {
        // Find the user by clerkUserId
        const user = await User.findOne({ clerkUserId });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
     // Create a new lab report
     const newLabReport = new LabReport({
        reportID,
        fileUrl: req.file.path,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        userId: user._id,
        clerkUserId,   
        doctorComments: [{ doctorName, comment }],
      });

      // Save the lab report and associate it with the user
      const savedReport = await newLabReport.save();
      user.labReports.push(savedReport._id);
      await user.save();

      res.status(201).json({ message: 'Lab report uploaded successfully', labReport: savedReport });
    } catch (err) {
      res.status(500).json({ message: 'Error uploading report', err });
    }
  });
};

// Fetch a report
exports.getReport = async (req, res) => {
  try {
    const report = await LabReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

// Fetch lab reports for a specific user
exports.getUserReports = async (req, res) => {
  try {
    // Assuming req.user.clerkUserId is available after login
    const { clerkUserId } = req.query;  // Get clerkUserId from query parameters

    // Find the user with this clerkUserId
    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all lab reports for this user
    const reports = await LabReport.find({ clerkUserId });
    if (reports.length === 0) {
      return res.status(404).json({ message: 'No lab reports found' });
    }

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lab reports', err });
  }
};

// Add a doctor's comment
exports.addDoctorComment = async (req, res) => {
  try {
    const { doctorName, comment } = req.body;
    const report = await LabReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
//Add new comment
    report.doctorComments.push({ doctorName, comment });
    await report.save();

    res.status(200).json(report);  // Return updated report with comments
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', err });
  }

};
    //Fetch all lab reports
exports.getAllLabReports = async (req, res) => {
      try {
        const reports = await LabReport.find();
        console.log('Fetched reports:', reports); // Log fetched reports
        res.status(200).json(reports);
      } catch (err) {
        console.log('Error fetching reports:', err); // Log any error
        res.status(500).json({ message: 'Error fetching reports', err });
      }
};

// Fetch all lab reports with user information
exports.getAllReportsWithUserInfo = async (req, res) => {
  try {
    //console.log('Fetching all lab reports...');
    const reports = await LabReport.find().populate('userId', 'firstName lastName email clerkUserId');
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: 'No reports found' });
    }
    //console.log('Reports fetched successfully:', reports);
    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Error fetching reports', err });
  }
};
//Delete a lab report
exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const deletedReport = await LabReport.findByIdAndDelete(reportId);

    if (!deletedReport) {
      return res.status(404).json({ message: 'Lab report not found' });
    }

    // Optionally, remove the reference from the user as well
    await User.updateMany({ labReports: reportId }, { $pull: { labReports: reportId } });

    res.status(200).json({ message: 'Lab report deleted successfully' });
  } catch (err) {
    console.error('Error deleting lab report:', err);
    res.status(500).json({ message: 'Error deleting lab report', err });
  }
};

// Update a lab report
exports.updateReport = async (req, res) => {
  try {
    //const { reportID, clerkUserId, comment, doctorName } = req.body;
    console.log(req.file);  // Check if the file is being received
    console.log(req.body);  // Check the rest of the form data
    
    const reportId = req.params.id;

  // Find the existing lab report
  const existingReport = await LabReport.findById(reportId);
  if (!existingReport) {
    return res.status(404).json({ message: 'Lab report not found' });
  }

  // Update the basic fields
  existingReport.reportID = req.body.reportID;
  existingReport.clerkUserId = req.body.clerkUserId;
  existingReport.doctorComments = [{ doctorName: req.body.doctorName, comment: req.body.comment }];

  // If a new file is uploaded, update the file fields
  if (req.file) {
    existingReport.fileUrl = req.file.path;
    existingReport.fileSize = req.file.size;
    existingReport.fileType = req.file.mimetype;
  }

  // Save the updated report
  const updatedReport = await existingReport.save();
  // Initialize the NotificationSubject
  const notificationSubject = new NotificationSubject();

  // Attach observers (Doctors and Patients)
  const doctorObserver = new DoctorObserver();
  const patientObserver = new PatientObserver();

  notificationSubject.attach(doctorObserver);
  notificationSubject.attach(patientObserver);

  // Notify observers after updating the report
  notificationSubject.notify(updatedReport);
  res.status(200).json({ message: 'Lab report updated successfully', updatedReport });
} catch (err) {
  res.status(500).json({ message: 'Server error', err });
}
};
