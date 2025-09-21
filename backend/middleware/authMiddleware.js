const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to check if the user is authenticated
exports.user = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;  // Add user data to the request object
    next();
  });
};

// Middleware to check if the user is an admin
exports.doctor = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id);
    if (user.role !== 'doctor') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = decoded;
    next();
  });
};
