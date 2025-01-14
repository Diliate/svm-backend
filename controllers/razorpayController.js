const razorpay = require("../services/razorpay");
const crypto = require("crypto");
const prisma = require("../DB/db.config");

// 1) Import the Shiprocket service
const { createShiprocketOrder } = require("../services/shiprocketService");

/**
 * Create a new Razorpay order
 * POST /api/razorpay/create-order
 */
const createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, userId } = req.body;

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
        amount, // in paise
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

    // ------------------------------
    // TEMPORARILY DISABLED SIGNATURE CHECK:
    // ------------------------------
    // // Step 1: Validate Razorpay signature
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

    // Step 2: Payment is verified => update the existing order to "PAID"
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

    // -----------------------------------------------
    // SHIPROCKET INTEGRATION BELOW
    // -----------------------------------------------

    // (a) Fetch the user info (for shipping details)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // (b) Fetch an address record for that user
    const address = await prisma.address.findFirst({
      where: { userId },
    });

    // We'll split that into first + last:
    const fullName = user?.name || "Mohd Fahad";
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.length ? rest.join(" ") : "User"; // if only one name, fallback

    // Build the phone so it's always 10 digits:
    const phone = user?.mobile || "9667073396"; // ensure it's 10 digits

    // Now set the pickup_location to "Home" (the address nickname in your screenshot)
    const shippingData = {
      order_id: updatedOrder.orderId,
      order_date: new Date().toISOString(),
      pickup_location:
        "325 Batla House, Okhla, Near Hari Masjid, South Delhi, Delhi, India, 110025", // EXACT nickname from Shiprocket Dashboard

      // Instead of billing_customer_name, we do:
      billing_first_name: firstName,
      billing_last_name: lastName,

      // The rest of the address
      billing_customer_name: user?.name || "Mohd Fahad",
      billing_address:
        address?.area || "325 Batla House, Okhla, Near Hari Masjid",
      billing_city: address?.city || "South Delhi",
      billing_pincode: address?.zipCode || "110025",
      billing_state: address?.state || "Delhi",
      billing_country: "India",
      billing_email: user?.email || "fahadmohammad312@example.com",
      billing_phone: phone,

      shipping_is_billing: true,

      order_items: cartItems.map((item) => ({
        name: "Product 6", // or real product name
        sku: item.productId,
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: 0,
      })),

      payment_method: "Prepaid",
      sub_total: updatedOrder.amount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };

    // (d) Create the order on Shiprocket
    const shiprocketRes = await createShiprocketOrder(shippingData);

    // (e) Optionally store the Shiprocket references in your DB
    await prisma.order.update({
      where: { id: updatedOrder.id },
      data: {
        shiprocketOrderId: shiprocketRes?.order_id || null,
        shiprocketShipmentId: shiprocketRes?.shipment_id || null,
      },
    });

    // Return success response
    return res.json({
      status: "success",
      message: "Payment verified successfully & Shiprocket order created",
      order: updatedOrder,
      shiprocket: shiprocketRes,
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
