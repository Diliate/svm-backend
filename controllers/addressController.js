const prisma = require("../DB/db.config");

// Add an address
const addAddress = async (req, res) => {
  const { id: userId } = req.user; // User ID from the protect middleware
  const { area, city, state, zipCode } = req.body;

  try {
    if (!area || !city || !state || !zipCode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const address = await prisma.address.create({
      data: { area, city, state, zipCode, userId },
    });

    res.status(201).json({ message: "Address added successfully.", address });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Remove an address
const removeAddress = async (req, res) => {
  const { addressId } = req.params;
  const { id: userId } = req.user; // User ID from the protect middleware

  try {
    const address = await prisma.address.findUnique({
      where: { id: parseInt(addressId) },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }

    if (address.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this address." });
    }

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
    });

    res.status(200).json(addresses);
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
