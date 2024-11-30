const prisma = require("../DB/db.config");

// Add product to cart
const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Find or create the cart for the user
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if the product already exists in the cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      // Update the quantity of the existing item
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new product to cart
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    res.status(200).json({ message: "Product added to cart successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product to cart." });
  }
};

module.exports = {
  addToCart,
};
