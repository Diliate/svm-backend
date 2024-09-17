import { verify } from "jsonwebtoken";

// Middleware for authentication
export const authenticate = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw new Error("Authentication token is required");
  }

  const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'
  
  if (!token) {
    throw new Error("Token missing from header");
  }

  try {
    // Verify the JWT token
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user information to the request
  } catch (error) {
    console.error("JWT verification failed:", error.message);  // Log the error for debugging
    throw new Error("Invalid or expired token");
  }
};

// Middleware for role-based authorization
export const authorize = (roles) => (req) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new Error("Unauthorized access - insufficient role");
  }
};

