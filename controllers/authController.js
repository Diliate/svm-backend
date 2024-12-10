const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const {
  findUserByEmail,
  createUser,
  updateUser,
} = require("../helpers/userHelper");
const prisma = require("../DB/db.config");

// Registration Controller
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(`Validation errors: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }

  let { name, email, password, phone } = req.body;

  // Normalize email to lowercase
  email = email.toLowerCase();

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.warn(`Registration attempt with existing email: ${email}`);
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await createUser(name, email, hashedPassword, phone);

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Login Controller
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Logged in successfully.",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Update User Details Controller
const updateUserDetails = async (req, res) => {
  const { id } = req.user;
  const { name, email, phone } = req.body;

  try {
    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Name, email and phone no. are required fields." });
    }

    // Update user details
    const updatedUser = await updateUser(id, { name, email, phone });

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
  updateUserDetails,
  getUserWithAddresses,
};
