const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authToken = req.headers['authorization'];

  if (!authToken || !authToken.startsWith('Bearer ')) {
    return res.status(401).json({
      status: false,
      message: 'Access denied. No token provided',
    });
  }

  const token = authToken.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = verifyToken;
