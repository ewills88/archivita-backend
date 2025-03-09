const express = require("express");
const router = express.Router();

// Test Route for /auth/data
router.get("/data", (req, res) => {
  res.json({
    success: true,
    message: "API is working!",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
