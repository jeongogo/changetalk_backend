const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const checkLoggedIn = (req, res, next) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token empty' });
  };
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ msg: 'User verify failed' });
      }
    });

    return next();
  } catch (e) {
    return next();
  }
};

module.exports = checkLoggedIn;