const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    console.log(`Incoming Request Method: ${req.method}`);

    // Bypass OPTIONS requests
    if (req.method === "OPTIONS") {
      console.log("Bypassing authentication for OPTIONS request.");
      return next();
    }

    // Extract token from the Authorization header (e.g., "Bearer <token>")
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("Authentication failed: No token provided.");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Verify and decode the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT Payload:", decode);

    // Set user details based on decoded token
    req.user = { id: decode.userId || decode.id };
    console.log(`Authenticated User ID: ${req.user.id}`);

    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = { isAuthenticated };
