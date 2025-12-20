import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
    {
        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },

        soldBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        saleDate: {
            type: String, // YYYY-MM-DD
            required: true,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
