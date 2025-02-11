const express = require("express");
const {
  register,
  login,
  updateUserDetails,
  getUserWithAddresses,
  logout,
  requestResetOTP,
  resetPasswordWithOTP,
  changePassword,
} = require("../controllers/authController");
// const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// POST: Registration Route with Validation
router.post("/register", register);

// POST: Login Route with Validation
router.post("/login", login);

// UPDATE: User Details Route
router.put("/update", updateUserDetails);

// GET: User with Addresses Route
router.get("/user", getUserWithAddresses);

// POST:
router.post("/logout", logout);

// POST: Change password through current password
router.post("/change-password", changePassword);

// Request Reset OTP Route
router.post("/request-reset-otp", requestResetOTP);

// Reset Password with OTP Route
router.post("/reset-password-with-otp", resetPasswordWithOTP);

module.exports = router;
