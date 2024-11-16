const jwt = require("jsonwebtoken");
const { findUserById } = require("../helpers/userHelper");

const protect = async (req, res, next) => {
  let token;

  // Extract token from the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user associated with the token
    const user = await findUserById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found." });
    }

    // Attach user to the request
    req.user = user;

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(401).json({ message: "Not authorized, invalid token." });
  }
};

module.exports = { protect };
