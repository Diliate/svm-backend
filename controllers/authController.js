const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, updateUser } = require("../helpers/userHelper");
const { generateOTP, sendResetEmail } = require("../services/emailService");
const { validatePassword } = require("../utils/validation");
const prisma = require("../DB/db.config");

const register = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  if (!name || !email || !password || !mobile) {
    return res.status(400).json({
      success: false,
      message: "All fields Required",
    });
  }

  // Password validation
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email Id already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await createUser(name, email, hashedPassword, mobile);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.log("Error registering user: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { addresses: true },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Logged in successfully.",
        user,
      });
  } catch (error) {
    console.log("Error logging User: ", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

const logout = async (_, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        path: "/",
      })
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.log("Error loggin out: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update User Details Controller
const updateUserDetails = async (req, res) => {
  const { id } = req.user;
  const { name, email, mobile } = req.body;

  try {
    if (!name || !email || !mobile) {
      return res
        .status(400)
        .json({ message: "Name, email and phone no. are required fields." });
    }

    // Update user details
    const updatedUser = await updateUser(id, { name, email, mobile });

    res.status(200).json({
      message: "User details updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

const getUserWithAddresses = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Controller to change password by providing current password
const changePassword = async (req, res) => {
  // Access userId from req.user.id
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  // Validate inputs
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required.",
    });
  }

  // Password validation
  if (!validatePassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "New password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  try {
    // Fetch user from the database
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error changing password: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Requesting a password reset OTP Controller
const requestResetOTP = async (req, res) => {
  const { email } = req.body;

  // Validate email input
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const otp = generateOTP();

    // Save OTP and expiry in the user's record
    await prisma.user.update({
      where: { email },
      data: {
        resetOtp: otp,
        resetOtpExpires: new Date(Date.now() + 15 * 60000),
      }, // 15 mins expiry
    });

    // Send the OTP to the user's email
    await sendResetEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "Reset OTP sent to your email.",
    });
  } catch (error) {
    console.error("Error requesting reset OTP: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// resetting password using OTP Controller
const resetPasswordWithOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Validate required fields
  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Password validation
  if (!validatePassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "New password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verify OTP and its expiry
    if (user.resetOtp !== otp || new Date() > user.resetOtpExpires) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and clear OTP
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, resetOtp: null, resetOtpExpires: null },
    });

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  updateUserDetails,
  getUserWithAddresses,
  changePassword,
  requestResetOTP,
  resetPasswordWithOTP,
};
