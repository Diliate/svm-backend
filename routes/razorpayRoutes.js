const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require("../controllers/razorpayController");

// Route to create a new order with validation
router.post(
  "/create-order",
  [
    body("amount")
      .isInt({ gt: 0 })
      .withMessage("Amount must be a positive integer"),
    body("currency")
      .isString()
      .isLength({ min: 3, max: 3 })
      .withMessage("Currency must be a 3-letter code"),
    body("receipt").isString().notEmpty().withMessage("Receipt is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Create Order Validation Failed:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createOrder
);

// Route to verify payment with validation
router.post(
  "/verify-payment",
  [
    body("razorpay_order_id")
      .isString()
      .notEmpty()
      .withMessage("Order ID is required"),
    body("razorpay_payment_id")
      .isString()
      .notEmpty()
      .withMessage("Payment ID is required"),
    body("razorpay_signature")
      .isString()
      .notEmpty()
      .withMessage("Signature is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Verify Payment Validation Failed:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  verifyPayment
);

module.exports = router;
