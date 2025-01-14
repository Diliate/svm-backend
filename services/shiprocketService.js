// services/shiprocketService.js
const axios = require("axios");

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

let shiprocketToken = null;

/**
 * Authenticate with Shiprocket
 */
async function authenticateShiprocket() {
  try {
    const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    });

    if (response.data && response.data.token) {
      shiprocketToken = response.data.token;
      return shiprocketToken;
    } else {
      throw new Error("Failed to get Shiprocket token");
    }
  } catch (error) {
    console.error(
      "Shiprocket auth error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Get a valid Shiprocket token
 */
async function getShiprocketToken() {
  if (!shiprocketToken) {
    shiprocketToken = await authenticateShiprocket();
  }
  return shiprocketToken;
}

/**
 * Create a Shiprocket order
 */
async function createShiprocketOrder(orderData) {
  try {
    const token = await getShiprocketToken();

    const response = await axios.post(
      `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating Shiprocket order:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Request shipment pickup
 */
async function requestShipmentPickup(shipmentId) {
  try {
    const token = await getShiprocketToken();
    const response = await axios.post(
      `${SHIPROCKET_BASE_URL}/courier/generate/pickup`,
      { shipment_id: [shipmentId] },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error requesting shipment pickup:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Track shipment status
 */
async function trackShipment(shipmentId) {
  try {
    const token = await getShiprocketToken();
    const response = await axios.get(
      `${SHIPROCKET_BASE_URL}/courier/track/shipment/${shipmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error tracking shipment:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Cancel a shipment
 */
async function cancelShipment(shipmentId) {
  try {
    const token = await getShiprocketToken();
    const response = await axios.post(
      `${SHIPROCKET_BASE_URL}/shipments/cancel`, // Replace with actual endpoint if different
      { shipment_id: shipmentId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error cancelling shipment:",
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = {
  createShiprocketOrder,
  requestShipmentPickup,
  trackShipment,
  cancelShipment, // Export the new function
};
