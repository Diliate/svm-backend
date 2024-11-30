const express = require("express");
const {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/", addToCart);
router.get("/:userId", getUserCart);
router.put("/item", updateCartItem);
router.delete("/item", removeFromCart);

module.exports = router;
