const express = require("express");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/admin",
  protect,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to the Admin Dashboard"
    });
  }
);

router.get(
  "/institution",
  protect,
  authorize("INSTITUTION"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to the Institution Dashboard"
    });
  }
);

router.get(
  "/recruiter",
  protect,
  authorize("RECRUITER"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to the Recruiter Dashboard"
    });
  }
);

module.exports = router;