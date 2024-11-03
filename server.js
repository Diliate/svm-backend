const express = require("express");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Auth API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
