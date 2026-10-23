
const mongoose = require("mongoose");
const Institution = require("../models/Institution");

const listInstitutions = async (req, res, next) => {
  try {
    const institutions = await Institution.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: institutions.length,
      institutions
    });
  } catch (error) {
    next(error);
  }
};

const approveInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid institution ID"
      });
    }

    const institution = await Institution.findByIdAndUpdate(
      id,
      {
        $set: {
          isVerified: true,
          verificationStatus: "VERIFIED",
          rejectionReason: ""
        }
      },
      { new: true, runValidators: true }
    );

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: "Institution not found"
      });
    }

    return res.json({
      success: true,
      message: "Institution approved successfully",
      institution
    });
  } catch (error) {
    next(error);
  }
};

const rejectInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reason =
      typeof req.body.reason === "string"
        ? req.body.reason.trim()
        : "";

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid institution ID"
      });
    }

    const institution = await Institution.findByIdAndUpdate(
      id,
      {
        $set: {
          isVerified: false,
          verificationStatus: "REJECTED",
          rejectionReason: reason
        }
      },
      { new: true, runValidators: true }
    );

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: "Institution not found"
      });
    }

    return res.json({
      success: true,
      message: "Institution application rejected",
      institution
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listInstitutions,
  approveInstitution,
  rejectInstitution
};
