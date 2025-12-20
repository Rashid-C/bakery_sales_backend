import AuditLog from "./audit.model.js";

export const logAudit = async ({
    action,
    entity,
    entityId = null,
    performedBy,
    meta = {},
}) => {
    try {
        await AuditLog.create({
            action,
            entity,
            entityId,
            performedBy,
            meta,
        });
    } catch (error) {
        console.error("AUDIT LOG FAILED:", error.message);
    }
};
