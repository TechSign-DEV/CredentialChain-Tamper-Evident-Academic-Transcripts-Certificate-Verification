
const express = require("express");
const router = express.Router();

const {
  listInstitutions,
  approveInstitution,
  rejectInstitution
} = require("../controllers/institutionController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Only authenticated administrators can manage institutions.
router.use(protect, authorize("ADMIN"));

router.get("/", listInstitutions);
router.patch("/:id/approve", approveInstitution);
router.patch("/:id/reject", rejectInstitution);

module.exports = router;
