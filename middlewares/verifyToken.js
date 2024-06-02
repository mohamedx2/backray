const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decodedToken = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decodedToken = decoded;
    if(!decoded.isAdmin) return res.status(400).json({ message: 'Invalid token' });
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};


module.exports = {verifyToken,verifyAdminToken};
