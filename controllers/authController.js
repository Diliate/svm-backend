const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const {
  findUserByEmail,
  createUser,
  updateUser,
} = require("../helpers/userHelper");
const prisma = require("../DB/db.config");

const register = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  if (!name || !email || !password || !mobile) {
    return res.status(400).json({
      success: false,
      message: "All fields Required",
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
      .cookie("token", token, { httpOnly: true, sameSite: "strict" })
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
        sameSite: "strict",
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

module.exports = {
  register,
  login,
  logout,
  updateUserDetails,
  getUserWithAddresses,
};
