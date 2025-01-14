// controllers/shiprocketController.js
const {
  createShiprocketOrder,
  requestShipmentPickup,
  trackShipment,
  cancelShipment,
} = require("../services/shiprocketService");
const prisma = require("../DB/db.config");

/**
 * Request a shipment pickup
 * POST /api/shiprocket/request-pickup
 */
const requestPickup = async (req, res) => {
  try {
    const { shipmentId } = req.body;

    if (!shipmentId) {
      return res
        .status(400)
        .json({ error: "Missing required field: shipmentId" });
    }

    const pickupResponse = await requestShipmentPickup(shipmentId);
    return res.status(200).json({ success: true, pickup: pickupResponse });
  } catch (error) {
    console.error("Error requesting shipment pickup:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Track a shipment
 * GET /api/shiprocket/track-shipment/:shipmentId
 */
const trackShipmentStatus = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    if (!shipmentId) {
      return res
        .status(400)
        .json({ error: "Missing required parameter: shipmentId" });
    }

    const trackingInfo = await trackShipment(shipmentId);
    return res.status(200).json({ success: true, tracking: trackingInfo });
  } catch (error) {
    console.error("Error tracking shipment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handle Shiprocket webhooks
 * POST /api/shiprocket/webhook
 */
const handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Optional: Validate webhook signature if Shiprocket provides one
    // const isValid = validateShiprocketSignature(req.headers, req.body);
    // if (!isValid) return res.status(400).json({ error: "Invalid signature" });

    // Handle different event types
    switch (event.event) {
      case "shipment.status.update":
        const { shipment_id, status } = event.data;
        await prisma.order.updateMany({
          where: { shiprocketShipmentId: shipment_id },
          data: { status: status.toUpperCase() }, // Adjust status as per your schema
        });
        break;
      // Handle other event types as needed
      default:
        console.warn("Unhandled Shiprocket event type:", event.event);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling Shiprocket webhook:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Cancel a shipment
 * POST /api/shiprocket/cancel-shipment
 */
const cancelShiprocketShipment = async (req, res) => {
  try {
    const { shipmentId } = req.body;

    if (!shipmentId) {
      return res
        .status(400)
        .json({ error: "Missing required field: shipmentId" });
    }

    const cancelResponse = await cancelShipment(shipmentId);

    // Optionally, update your database to reflect the cancellation
    await prisma.order.updateMany({
      where: { shiprocketShipmentId: shipmentId },
      data: { status: "CANCELLED" },
    });

    return res
      .status(200)
      .json({ success: true, cancellation: cancelResponse });
  } catch (error) {
    console.error("Error cancelling shipment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  requestPickup,
  trackShipmentStatus,
  handleWebhook,
  cancelShiprocketShipment,
};
