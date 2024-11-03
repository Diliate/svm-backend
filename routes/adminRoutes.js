const express = require("express");
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/admin", protect, requireAdmin, (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin Dashboard",
    user: req.user,
  });
});

module.exports = router;
