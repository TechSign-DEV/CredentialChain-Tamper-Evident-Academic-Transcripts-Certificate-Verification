const fs = require("fs/promises");

const Certificate = require("../models/Certificate");
const Verification = require("../models/Verification");
const calculateSHA256 = require("../utils/hashFile");

const verifyCertificate = async (req, res, next) => {
  let uploadedPath;

  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can verify certificates"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a certificate PDF"
      });
    }

    uploadedPath = req.file.path;

    // Calculate the hash of the uploaded PDF.
    const uploadedFileHash = calculateSHA256(uploadedPath);

    // Find a registered certificate with the exact same hash.
    const certificate = await Certificate.findOne({
      sha256Hash: uploadedFileHash
    }).populate("institutionId", "name code");

    let result = "NOT_MATCHED";

    if (certificate) {
      result =
        certificate.status === "REVOKED"
          ? "REVOKED"
          : "VERIFIED";
    }

    // Save the verification attempt for audit/history.
    const verification = await Verification.create({
      recruiterId: req.user._id,
      certificateId: certificate?._id || null,
      uploadedFileHash,
      result
    });

    const response = {
      success: true,
      result,
      verificationId: verification._id,
      verifiedAt: verification.verifiedAt,
      message:
        result === "VERIFIED"
          ? "The uploaded PDF matches an active registered certificate."
          : result === "REVOKED"
            ? "The PDF matches a revoked certificate."
            : "No matching registered certificate was found."
    };

    // Do not reveal private student or institution records
    // when the uploaded file does not match.
    if (certificate) {
      response.certificate = {
        id: certificate._id,
        studentName: certificate.studentName,
        degree: certificate.degree,
        graduationYear: certificate.graduationYear,
        institution: certificate.institutionId?.name || "Unknown",
        status: certificate.status
      };
    }

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  } finally {
    if (uploadedPath) {
      await fs.unlink(uploadedPath).catch(() => {});
    }
  }
};

const getVerificationHistory = async (req, res, next) => {
  try {
    const history = await Verification.find({
      recruiterId: req.user._id
    })
      .populate({
        path: "certificateId",
        select: "studentName degree graduationYear status"
      })
      .sort({ verifiedAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyCertificate,
  getVerificationHistory
};