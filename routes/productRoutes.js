const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

router.get("/", productController.getAllProducts);
router.get("/filtered", productController.getFilteredProducts);

router.post("/", upload.array("images", 5), productController.addProduct);
router.delete("/:id", productController.deleteProduct);
router.put("/:id", upload.array("images", 5), productController.updateProduct);

module.exports = router;
