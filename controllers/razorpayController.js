const razorpay = require("../services/razorpay");
const crypto = require("crypto");
const prisma = require("../DB/db.config");

/**
 * Create a new Razorpay order
 * POST /api/razorpay/create-order
 */
const createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, userId } = req.body;

    // Input Validation
    if (
      amount === undefined ||
      currency === undefined ||
      receipt === undefined ||
      userId === undefined
    ) {
      return res.status(400).json({
        error: "Missing required fields: amount, currency, receipt, userId",
      });
    }

    // 1) Create an order on Razorpay
    const options = {
      amount, // in paise
      currency, // e.g. "INR"
      receipt, // e.g. "receipt_123"
    };
    const order = await razorpay.orders.create(options);

    // 2) Store the order in your DB with status="CREATED"
    const newOrder = await prisma.order.create({
      data: {
        orderId: order.id, // same as Razorpay order.id
        userId,
        receipt,
        amount, // in paise if you choose
        currency,
        status: "CREATED",
      },
    });

    // 3) Return both the Razorpay order + your DB record
    return res.status(201).json({ order, newOrder });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);

    if (error.error && error.error.description) {
      return res.status(400).json({ error: error.error.description });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Verify Razorpay payment signature
 * POST /api/razorpay/verify-payment
 */
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      cartItems, // e.g. [{ productId, quantity, price }, ...]
      amount,
      currency,
      receipt,
    } = req.body;

    // Step 1: Validate Razorpay signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ status: "failure", message: "Invalid signature" });
    }

    // Step 2: Payment is verified — update the existing order to "PAID"
    //         and optionally add the line items now.
    const updatedOrder = await prisma.order.update({
      where: { orderId: razorpay_order_id }, // The unique field in your schema
      data: {
        status: "PAID",
        // If you want to store the purchased items now:
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return res.json({
      status: "success",
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
