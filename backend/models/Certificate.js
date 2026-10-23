const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true
    },

    rollNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    degree: {
      type: String,
      required: true,
      trim: true
    },

    graduationYear: {
      type: Number,
      required: true,
      min: 1950,
      max: 2100
    },

    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true
    },

    sha256Hash: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    fileStorageKey: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED"],
      default: "ACTIVE"
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    issuedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

certificateSchema.index({
  institutionId: 1,
  rollNumber: 1,
  graduationYear: 1
});

module.exports = mongoose.model("Certificate", certificateSchema);