import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
    {
        saleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sale",
            required: true,
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
        },

        priceAtSale: {
            type: Number,
            required: true,
        },

        lineTotal: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("SaleItem", saleItemSchema);
