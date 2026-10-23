const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      default: null
    },

    uploadedFileHash: {
      type: String,
      required: true
    },

    result: {
      type: String,
      enum: ["VERIFIED", "NOT_MATCHED", "REVOKED"],
      required: true
    },

    verifiedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Verification",
  verificationSchema
);