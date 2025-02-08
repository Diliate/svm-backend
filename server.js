const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();

// Import Routes
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const addressRoutes = require("./routes/addressRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shiprocketRoutes = require("./routes/shiprocketRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Set security HTTP headers
app.use(helmet());

// Logger middleware using morgan
app.use(morgan("dev"));

// Enable CORS with default settings
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Body parser to parse JSON bodies
app.use(express.json());

app.use(cookieParser());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shiprocket", shiprocketRoutes);
app.use("/api/users", userRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
