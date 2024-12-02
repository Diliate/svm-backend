const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

// General product routes (FETCH ALL & FILTERED PRODUCTS)
router.get("/", productController.getAllProducts); // Fetch all products
router.get("/filtered", productController.getFilteredProducts); // Fetch filtered products

// Specific product type routes (FETCH FEATURED, DISCOUNTED, & LIMITED OFFER PRODUCTS)
router.get("/featured", productController.getFeaturedProducts); // Fetch featured products
router.get("/limited-offers", productController.getLimitedOfferProducts); // Fetch limited offer products
router.get("/discounted", productController.getDiscountedProducts); // Fetch discounted products

// Search products
router.get("/search", productController.searchProducts); // Search products by query

// Fetch product details by ID (supports `userId` query for favourite status)
router.get("/:id", productController.getProductById);

// CRUD operations (ADD, UPDATE, DELETE PRODUCTS)
router.post("/", upload.array("images", 5), productController.addProduct); // Add a new product
router.put("/:id", upload.array("images", 5), productController.updateProduct); // Update a product
router.delete("/:id", productController.deleteProduct); // Delete a product

module.exports = router;
