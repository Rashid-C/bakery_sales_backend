import AuditLog from "./audit.model.js";

export const getAuditLogs = async (req, res) => {
    const logs = await AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .populate("performedBy", "name role");

    res.json(logs);
};
