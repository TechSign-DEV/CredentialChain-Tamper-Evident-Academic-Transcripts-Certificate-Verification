
const router = require("express").Router();

const {
  revokeCertificate,
} = require("../controllers/revocationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.patch(
  "/:id/revoke",
  protect,
  authorize("ADMIN"),
  revokeCertificate
);

module.exports = router;
