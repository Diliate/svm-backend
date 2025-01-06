const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.addCategory);
router.delete("/:id", categoryController.deleteCategory);
router.put("/:id", categoryController.updateCategory);
router.get("/search", categoryController.searchCategory);

module.exports = router;
