
const AuditLog = require("../models/AuditLog");

async function writeAuditLog({
  actorId,
  action,
  targetId = null,
  details = ""
}) {
  return AuditLog.create({
    actorId,
    action,
    targetId,
    details
  });
}

module.exports = writeAuditLog;
