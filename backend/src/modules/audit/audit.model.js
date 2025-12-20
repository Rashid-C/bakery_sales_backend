import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            index: true,
        },

        entity: {
            type: String,
            required: true,
        },

        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },

        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        meta: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("AuditLog", auditSchema);
