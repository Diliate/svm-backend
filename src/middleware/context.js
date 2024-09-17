import { verify } from "jsonwebtoken";
const prisma = require("path")
export const contextMiddleware = async ({ req }) => {
  let user = null;

  // Extract JWT token from the Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Get the token from the 'Bearer <token>' format
    if (token) {
      try {
        // Verify the token and attach user info to the request
        user = verify(token, process.env.JWT_SECRET);
        req.user = user;  // Attach user to request (optional but helpful for other middleware)
      } catch (err) {
        console.error("Invalid token:", err.message);
      }
    }
  }

  return {
    req,   // Access to request object
    user,  // Access to authenticated user
    prisma // Prisma client for DB operations
  };
};

