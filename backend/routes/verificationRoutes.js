const express = require("express");

const {
  verifyCertificate,
  getVerificationHistory
} = require("../controllers/verificationController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// POST /api/verify
router.post(
  "/",
  protect,
  authorize("RECRUITER"),
  upload.single("certificate"),
  verifyCertificate
);

// GET /api/verify/history
router.get(
  "/history",
  protect,
  authorize("RECRUITER"),
  getVerificationHistory
);

module.exports = router;