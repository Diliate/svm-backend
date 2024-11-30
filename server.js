const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

dotenv.config();

// Import Routes
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const addressRoutes = require("./routes/addressRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
// const razorpayRoutes = require("./routes/razorpayRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Set security HTTP headers
app.use(helmet());

// Logger middleware using morgan
app.use(morgan("dev"));

// Rate limiting middleware to prevent brute-force attacks and denial-of-service attacks
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: {
//     status: 429,
//     error: "Too many requests from this IP, please try again after 15 minutes",
//   },
// });
// app.use(limiter);

// Enable CORS with default settings
app.use(cors());

// Body parser to parse JSON bodies
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Authentication Middleware
// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Authentication failed" });
//   }

//   const token = authHeader.split(" ")[1];

//   // Dummy verification - replace with real JWT verification
//   if (token !== "valid_token") {
//     return res.status(401).json({ error: "Authentication failed" });
//   }

//   // If token is valid
//   req.user = { id: 1, name: "John Doe" }; // Example user
//   next();
// };

// Apply authentication middleware to protected routes only
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
// app.use("/api/razorpay", razorpayRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});

// 404 Handler
// app.use((req, res, next) => {
//   res.status(404).json({
//     status: 404,
//     error: "Not Found",
//     message: "The requested resource was not found on this server.",
//   });
//   console.warn(`404 Not Found: ${req.originalUrl}`);
// });

// Global Error Handler
// app.use((err, req, res, next) => {
//   console.error(`Error: ${err.message}`);
//   console.error(err.stack);

//   const statusCode = err.statusCode || 500;

//   const message =
//     process.env.NODE_ENV === "production" && statusCode === 500
//       ? "Internal Server Error"
//       : err.message;

//   res.status(statusCode).json({
//     status: statusCode,
//     error: message,
//   });
// });

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle Uncaught Exceptions
// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
//   process.exit(1);
// });

// Handle Unhandled Promise Rejections
// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection at:", promise, "reason:", reason);
//   process.exit(1);
// });
