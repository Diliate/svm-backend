// controllers/addressController.js
const prisma = require("../DB/db.config");

const ALLOWED_ADDRESS_TYPES = ["HOME", "OFFICE", "OTHER"];

// Add an address
const addAddress = async (req, res) => {
  // Check if user is authenticated
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User information missing." });
  }

  const { id: userId } = req.user;
  // Destructure new address fields from the request body
  const { addressLine1, addressLine2, city, state, zipCode, type } = req.body;

  try {
    // Validate required fields (addressLine2 is optional)
    if (!addressLine1 || !city || !state || !zipCode || !type) {
      return res.status(400).json({
        message:
          "All fields (addressLine1, city, state, zipCode, type) are required.",
      });
    }

    // Check if the zip code is exactly 6 digits
    if (!/^\d{6}$/.test(zipCode.toString())) {
      return res
        .status(400)
        .json({ message: "Zip code must be exactly 6 digits." });
    }

    // Validate address type
    if (!ALLOWED_ADDRESS_TYPES.includes(type.toUpperCase())) {
      return res.status(400).json({
        message: `Invalid address type. Allowed types are: ${ALLOWED_ADDRESS_TYPES.join(
          ", "
        )}.`,
      });
    }

    // Create a new address using the new schema fields
    const address = await prisma.address.create({
      data: {
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        userId,
        type: type.toUpperCase(),
      },
    });

    res.status(201).json({ message: "Address added successfully.", address });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Remove an address
const removeAddress = async (req, res) => {
  // Defensive check for req.user
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User information missing." });
  }

  const { addressId } = req.params;
  const { id: userId } = req.user; // User ID from the authentication middleware

  try {
    // Find the address to ensure it exists and belongs to the user
    const address = await prisma.address.findUnique({
      where: { id: parseInt(addressId) },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }

    if (address.userId !== userId) {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to delete this address.",
      });
    }

    // Delete the address
    await prisma.address.delete({ where: { id: parseInt(addressId) } });
    res.status(200).json({ message: "Address removed successfully." });
  } catch (error) {
    console.error("Error removing address:", error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Get all addresses for a user
const getAddresses = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

module.exports = {
  addAddress,
  removeAddress,
  getAddresses,
};
