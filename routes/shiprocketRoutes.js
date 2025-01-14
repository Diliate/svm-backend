// routes/shiprocketRoutes.js
const express = require("express");
const {
  requestPickup,
  trackShipmentStatus,
  handleWebhook,
  cancelShiprocketShipment,
} = require("../controllers/shiprocketController");

const router = express.Router();

// POST /api/shiprocket/request-pickup
router.post("/request-pickup", requestPickup);

// GET /api/shiprocket/track-shipment/:shipmentId
router.get("/track-shipment/:shipmentId", trackShipmentStatus);

// POST /api/shiprocket/webhook
router.post("/webhook", handleWebhook);

// POST /api/shiprocket/cancel-shipment
router.post("/cancel-shipment", cancelShiprocketShipment);

module.exports = router;
