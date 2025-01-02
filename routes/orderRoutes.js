// routes/orders.js
const express = require("express");
const router = express.Router();

const {
  createOrderRecord,
  getUserOrders,
  cancelOrder,
} = require("../controllers/orderController");

// POST /api/orders => create a new order record (e.g., after Razorpay payment verification)
router.post("/", createOrderRecord);

// GET /api/orders/:userId => fetch all orders for a user
router.get("/:userId", getUserOrders);

// PATCH or POST /api/orders/:orderId/cancel => cancel an order (optional)
router.patch("/:orderId/cancel", cancelOrder);

module.exports = router;
