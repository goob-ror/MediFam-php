const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid",
    });
  }
};

const requireBidan = (req, res, next) => {
  if (req.user.role !== "bidan") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya bidan yang dapat mengakses resource ini.",
    });
  }
  next();
};

// Export both as named exports and default
module.exports = authenticateToken;
module.exports.authenticateToken = authenticateToken;
module.exports.requireBidan = requireBidan;
