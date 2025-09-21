const express = require('express');
const multer = require('multer');  // Import multer
const path = require('path');
const { uploadReport, getUserReports, getReport, addDoctorComment, getAllLabReports, getAllReportsWithUserInfo, deleteReport, updateReport } = require('../controllers/labReportController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Appends extension
    }
  });
  const upload = multer({ storage: storage });  // Multer instance

router.post('/upload', uploadReport);  // Admin uploads reports
router.get('/all-reports', getAllReportsWithUserInfo);
router.get('/user', getUserReports);  // Logged-in user fetches reports
router.get('/:id', getReport);
router.delete('/:id', deleteReport);  // Delete a specific lab report by ID
router.put('/:id', upload.single('report'), updateReport);  // Update a specific lab report by ID (file is optional)

router.post('/:id/comment', addDoctorComment);
//router.get('/', getAllLabReports);

router.get('/all-reports', getAllReportsWithUserInfo);

module.exports = router;
