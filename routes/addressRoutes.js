const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const {
  addAddress,
  removeAddress,
  getAddresses,
} = require("../controllers/addressController");

const router = express.Router();

// Add a new address
router.post("/", isAuthenticated, addAddress);

// Remove an address
router.delete("/:addressId", isAuthenticated, removeAddress);

// Get all addresses for a user
router.get("/", isAuthenticated, getAddresses);

module.exports = router;
