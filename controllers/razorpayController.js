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

    const options = {
      amount: amount, // Amount in the smallest currency unit (e.g., paise)
      currency: currency,
      receipt: receipt,
    };

    // Create order with Razorpay
    const order = await razorpay.orders.create(options);

    const newOrder = await prisma.order.create({
      data: {
        orderId: order.id,
        userId,
        receipt,
        amount: amount,
        currency: currency,
        status: "CREATED",
      },
    });

    // Respond with order details
    res.status(201).json({ order, newOrder });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);

    // Determine if the error is from Razorpay
    if (error.error && error.error.description) {
      return res.status(400).json({ error: error.error.description });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Verify Razorpay payment signature
 * POST /api/razorpay/verify-payment
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Input Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: "Missing required fields.",
      });
    }

    // Generate expected signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    // Compare signatures
    if (expectedSignature === razorpay_signature) {
      await prisma.order.update({
        where: {
          orderId: razorpay_order_id,
        },
        data: {
          status: "PAID",
        },
      });
      return res.json({
        status: "success",
        message: "Payment verified successfully",
      });
    } else {
      await prisma.order.update({
        where: {
          orderId: razorpay_order_id,
        },
        data: {
          status: "FAILED",
        },
      });
      return res
        .status(400)
        .json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
