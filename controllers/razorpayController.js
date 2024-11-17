
const razorpay = require("../services/razorpay");
const crypto = require("crypto");

/**
 * Create a new Razorpay order
 * POST /api/razorpay/create-order
 */
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    // Input Validation
    if (amount === undefined || currency === undefined || receipt === undefined) {
      return res.status(400).json({
        error: "Missing required fields: amount, currency, receipt",
      });
    }

    // Validate amount
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        error: "Amount must be a positive integer in the smallest currency unit (e.g., paise)",
      });
    }

    // Validate currency
    if (typeof currency !== "string" || currency.length !== 3) {
      return res.status(400).json({
        error: "Currency must be a 3-letter code (e.g., 'INR')",
      });
    }

    // Validate receipt
    if (typeof receipt !== "string" || receipt.trim() === "") {
      return res.status(400).json({
        error: "Receipt must be a non-empty string",
      });
    }

    const options = {
      amount: amount, // Amount in the smallest currency unit (e.g., paise)
      currency: currency,
      receipt: receipt,
    };

    // Create order with Razorpay
    const order = await razorpay.orders.create(options);

    // Respond with order details
    res.status(201).json(order);
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
exports.verifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Input Validation
    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string"
    ) {
      return res.status(400).json({
        error: "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature",
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
      res.json({ status: "success", message: "Payment verified successfully" });
    } else {
      res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
