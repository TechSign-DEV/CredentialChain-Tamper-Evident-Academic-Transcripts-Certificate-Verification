const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(req.query.limit) || 20)
    );

    const [logs, total] = await Promise.all([
      AuditLog.find()
        .populate("actorId", "name email role")
        .populate("targetId", "studentName rollNumber degree")
        .sort({ timestamp: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      AuditLog.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuditLogs };