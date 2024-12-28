const express = require("express");
const {
  register,
  login,
  updateUserDetails,
  getUserWithAddresses,
  logout,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Registration Route with Validation
router.post("/register", register);

// Login Route with Validation
router.post("/login", login);

// Update User Details Route
router.put("/update", isAuthenticated, updateUserDetails);

// Get User with Addresses Route
router.get("/user", isAuthenticated, getUserWithAddresses);

router.post("/logout", logout);

module.exports = router;
