const express = require("express");
const {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/cart", addToCart);
router.get("/cart/:userId", getUserCart);
router.put("/cart/item", updateCartItem);
router.delete("/cart/item", removeFromCart);

module.exports = router;
