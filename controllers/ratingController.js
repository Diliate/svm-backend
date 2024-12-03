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

// Get all ratings for a product
const getProductRatings = async (req, res) => {
  const { productId } = req.params;

  try {
    const ratings = await prisma.rating.findMany({
      where: { productId },
      include: {
        user: { select: { name: true } }, // Include user name
      },
    });
    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    res.status(500).json({ error: "Failed to fetch product ratings." });
  }
};

module.exports = {
  addRating,
  getProductRatings,
};
