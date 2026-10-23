
const mongoose = require("mongoose");
const Certificate = require("../models/Certificate");
const AuditLog = require("../models/AuditLog");

exports.revokeCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID",
      });
    }

    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (certificate.status === "REVOKED") {
      return res.status(409).json({
        success: false,
        message: "Certificate has already been revoked",
      });
    }

    certificate.status = "REVOKED";
    certificate.revokedAt = new Date();
    certificate.revokedBy = req.user._id;

    await certificate.save();

    // Record the revocation in the audit log.
    await AuditLog.create({
      actorId: req.user._id,
      action: "CERTIFICATE_REVOKED",
      targetId: certificate._id,
      details: `Certificate ${certificate.rollNumber} revoked`,
    });

    return res.status(200).json({
      success: true,
      message: "Certificate revoked successfully",
      certificate: {
        id: certificate._id,
        rollNumber: certificate.rollNumber,
        status: certificate.status,
        revokedAt: certificate.revokedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
