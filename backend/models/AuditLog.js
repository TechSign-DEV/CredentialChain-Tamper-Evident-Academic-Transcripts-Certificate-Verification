const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    action: {
      type: String,
      enum: [
        "CERTIFICATE_REGISTERED",
        "CERTIFICATE_VERIFIED",
        "CERTIFICATE_REVOKED"
      ],
      required: true
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      default: null
    },

    details: {
      type: String,
      default: ""
    },

    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true
    }
  },
  {
    timestamps: false
  }
);

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ targetId: 1, timestamp: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);