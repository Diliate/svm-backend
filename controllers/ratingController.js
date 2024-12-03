const prisma = require("../DB/db.config");

// Add a new rating
const addRating = async (req, res) => {
  const { productId, userId, rating, feedback } = req.body;

  try {
    const newRating = await prisma.rating.create({
      data: {
        productId,
        userId,
        rating,
        feedback,
      },
    });
    res.status(201).json(newRating);
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ error: "Failed to add rating." });
  }
};

module.exports = {
  addRating,
};
