
const express = require("express");
const router = express.Router();

const {
  registerCertificate,
  listCertificates
} = require("../controllers/certificateController");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// List certificates
router.get(
  "/",
  protect,
  authorize("ADMIN", "INSTITUTION"),
  listCertificates
);

// Register a certificate PDF
router.post(
  "/",
  protect,
  authorize("INSTITUTION"),
  upload.single("certificate"),
  registerCertificate
);

module.exports = router;
