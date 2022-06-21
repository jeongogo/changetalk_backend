const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const checkLoggedIn = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ msg: 'Token empty' });
  };
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ msg: 'User verify failed' });
      } else {
        const now = Math.floor(Date.now() / 1000);
    
        if (decodedToken.exp - now < 60 * 60 * 24 * 3.5) {
          const user = await User.findById(decodedToken._id);
          const token = user.generateToken();
          res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          });
        }
      }
    });

    return next();
  } catch (e) {
    return next();
  }
};

module.exports = checkLoggedIn;