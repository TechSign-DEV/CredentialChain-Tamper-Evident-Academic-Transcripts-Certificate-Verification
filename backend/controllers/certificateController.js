
const fs = require("fs/promises");
const path = require("path");

const Certificate = require("../models/Certificate");
const Institution = require("../models/Institution");
const calculateSHA256 = require("../utils/hashFile");

const writeAuditLog = require("../utils/audit");

const registerCertificate = async (req, res, next) => {
  let uploadedPath = null;
  let certificateCreated = false;

  try {
    // 1. Check uploaded PDF
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Certificate PDF is required"
      });
    }

    uploadedPath = req.file.path;

    // 2. Check user role
    if (req.user.role !== "INSTITUTION") {
      return res.status(403).json({
        success: false,
        message: "Only institution users can register certificates"
      });
    }

    // 3. Check institution account association
    if (!req.user.institutionId) {
      return res.status(403).json({
        success: false,
        message: "Your account is not linked to an institution"
      });
    }

    // 4. Institution must be approved
    const institution = await Institution.findOne({
      _id: req.user.institutionId,
      isVerified: true
    });

    if (!institution) {
      return res.status(403).json({
        success: false,
        message: "Institution is not verified or approved"
      });
    }

    // 5. Validate PDF signature instead of trusting its extension alone
    const handle = await fs.open(uploadedPath, "r");

    try {
      const signature = Buffer.alloc(5);
      const { bytesRead } = await handle.read(signature, 0, 5, 0);

      if (
        bytesRead !== 5 ||
        signature.toString("ascii") !== "%PDF-"
      ) {
        return res.status(400).json({
          success: false,
          message: "The uploaded file is not a valid PDF"
        });
      }
    } finally {
      await handle.close();
    }

    // 6. Validate form fields
    const {
      studentName,
      rollNumber,
      degree,
      graduationYear
    } = req.body;

    if (
      typeof studentName !== "string" ||
      !studentName.trim() ||
      typeof rollNumber !== "string" ||
      !rollNumber.trim() ||
      typeof degree !== "string" ||
      !degree.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Student name, roll number and degree are required"
      });
    }

    const year = Number(graduationYear);

    if (
      !Number.isInteger(year) ||
      year < 1950 ||
      year > new Date().getFullYear() + 10
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid graduation year"
      });
    }

    const cleanRollNumber = rollNumber.trim().toUpperCase();

    // 7. Prevent duplicate student records for the same institution and year
    const existing = await Certificate.findOne({
      institutionId: institution._id,
      rollNumber: cleanRollNumber,
      graduationYear: year
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "A certificate record already exists for this roll number and graduation year"
      });
    }

    // 8. Calculate the PDF's SHA-256 hash.
    // Works with an async hashFile utility that returns a Promise.
    const sha256Hash = await calculateSHA256(uploadedPath);

    // 9. Prevent duplicate exact PDF files
    const duplicateHash = await Certificate.findOne({
      sha256Hash
    });

    if (duplicateHash) {
      return res.status(409).json({
        success: false,
        message: "This exact PDF has already been registered"
      });
    }

    // 10. Store certificate metadata
    const certificate = await Certificate.create({
      studentName: studentName.trim(),
      rollNumber: cleanRollNumber,
      degree: degree.trim(),
      graduationYear: year,
      institutionId: institution._id,
      sha256Hash,
      fileStorageKey: path.basename(uploadedPath),
      issuedBy: req.user._id
    });

    certificateCreated = true;

    // 11. Add an event to the audit hash chain
    if (typeof appendAudit === "function") {
    // 11. Save the certificate registration audit event
await writeAuditLog({
  actorId: req.user._id,
  action: "CERTIFICATE_REGISTERED",
  targetId: certificate._id,
  details: `Certificate registered for roll number ${cleanRollNumber}`
});
    }

    // 12. Return safe certificate metadata
    return res.status(201).json({
      success: true,
      message: "Certificate registered successfully",
      certificate: {
        id: certificate._id,
        studentName: certificate.studentName,
        rollNumber: certificate.rollNumber,
        degree: certificate.degree,
        graduationYear: certificate.graduationYear,
        institution: institution.name,
        sha256Hash: certificate.sha256Hash,
        status: certificate.status
      }
    });
  } catch (error) {
    console.error("Certificate registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A duplicate certificate record or PDF hash already exists"
      });
    }

    return next(error);
  } finally {
    // Retain the PDF only after its certificate record was created.
    // Otherwise, remove the temporary upload.
    if (uploadedPath && !certificateCreated) {
      await fs.unlink(uploadedPath).catch(() => {});
    }
  }
};

const listCertificates = async (req, res, next) => {
  try {
    let filter;

    if (req.user.role === "INSTITUTION") {
      if (!req.user.institutionId) {
        return res.status(403).json({
          success: false,
          message: "Your account is not linked to an institution"
        });
      }

      filter = {
        institutionId: req.user.institutionId
      };
    } else if (req.user.role === "ADMIN") {
      filter = {};
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access certificate records"
      });
    }

    const certificates = await Certificate.find(filter)
      .select("-fileStorageKey -__v")
      .populate("institutionId", "name code")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      count: certificates.length,
      certificates
    });
  } catch (error) {
    console.error("List certificates error:", error);
    return next(error);
  }
};

module.exports = {
  registerCertificate,
  listCertificates
};
