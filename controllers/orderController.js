const prisma = require("../DB/db.config");

const createOrderRecord = async (req, res) => {
  try {
    const {
      razorpay_order_id, // The Razorpay order ID
      userId, // ID of the user placing the order
      cartItems, // Array of items: [{ productId, quantity, price }, ...]
      amount, // Total amount (in smallest currency unit if you prefer)
      currency, // e.g. "INR"
      receipt, // e.g. "receipt_123"
    } = req.body;

    // Create the order in the DB
    // We set `status = "PAID"` here, assuming you're calling this AFTER successful payment verification.
    const newOrder = await prisma.order.create({
      data: {
        orderId: razorpay_order_id,
        userId: userId,
        receipt: receipt,
        amount: amount,
        currency: currency,
        status: "PAID",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true }, // so we can see order items in the response
    });

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order record:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

/**
 * Get all orders for a specific user
 */
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId: Number(userId) },
      include: {
        items: {
          include: {
            product: true, // so you can display product details
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

/**
 * (Optional) Cancel an order
 */
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Mark order as cancelled
    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: "CANCELLED" },
    });

    return res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel order",
    });
  }
};

module.exports = {
  createOrderRecord,
  getUserOrders,
  cancelOrder,
};
