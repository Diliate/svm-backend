const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

// General product routes (FETCH ALL & FILTERED PRODUCTS)
router.get("/", productController.getAllProducts);
router.get("/filtered", productController.getFilteredProducts);

// Specific product type routes (FETCH FEATURED & DISCOUNTED PRODUTS)
router.get("/featured", productController.getFeaturedProducts);
router.get("/limited-offers", productController.getLimitedOfferProducts);
router.get("/discounted", productController.getDiscountedProducts);

// Get searched products
router.get("/search", productController.searchProducts);

// CRUD operations (ADD, UPDATE, DELETE PRODUCTS)
router.post("/", upload.array("images", 5), productController.addProduct);
router.put("/:id", upload.array("images", 5), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
