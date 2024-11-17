const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addAddress,
  removeAddress,
  getAddresses,
} = require("../controllers/addressController");

const router = express.Router();

// Add a new address
router.post("/", protect, addAddress);

// Remove an address
router.delete("/:addressId", protect, removeAddress);

// Get all addresses for a user
router.get("/", protect, getAddresses);

module.exports = router;
