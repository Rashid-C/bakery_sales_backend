import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        priceType: {
            type: String,
            enum: ["KG", "ITEM"],
            required: true,
        },

        basePrice: {
            type: Number,
            required: true,
            min: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
