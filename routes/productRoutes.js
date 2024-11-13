const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");
router.get("/", productController.getAllProducts);
router.get("/filtered", productController.getFilteredProducts);
router.post("/", upload.single("image"), productController.addProduct);
router.delete("/:id", productController.deleteProduct);
router.put("/:id", upload.single("image"), productController.updateProduct);

module.exports = router;
