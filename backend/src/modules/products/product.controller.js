import mongoose from "mongoose";
import Product from "./product.model.js";
import { logAudit } from "../audit/audit.service.js";

// ------------------------------------
// ADMIN — CREATE PRODUCT
// ------------------------------------
export const createProduct = async (req, res) => {
    try {
        const { name, priceType, basePrice } = req.body;

        if (!name || !priceType || basePrice == null) {
            return res.status(400).json({ message: "All fields required" });
        }

        const product = await Product.create({
            name,
            priceType,
            basePrice,
        });

        // 🔒 AUDIT LOG
        await logAudit({
            action: "CREATE_PRODUCT",
            entity: "PRODUCT",
            entityId: product._id,
            performedBy: req.user.id,
            meta: { name, priceType, basePrice },
        });

        return res.status(201).json(product);
    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ------------------------------------
// ADMIN + EMPLOYEE — GET ACTIVE PRODUCTS
// ------------------------------------
export const getActiveProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).select(
            "name priceType basePrice"
        );

        return res.json(products);
    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ------------------------------------
// ADMIN — UPDATE PRODUCT
// ------------------------------------
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const updated = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updated) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 🔒 AUDIT LOG
        await logAudit({
            action: "UPDATE_PRODUCT",
            entity: "PRODUCT",
            entityId: updated._id,
            performedBy: req.user.id,
            meta: req.body,
        });

        return res.json(updated);
    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ------------------------------------
// ADMIN — DISABLE PRODUCT (SOFT DELETE)
// ------------------------------------
export const disableProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 🔒 AUDIT LOG
        await logAudit({
            action: "DISABLE_PRODUCT",
            entity: "PRODUCT",
            entityId: product._id,
            performedBy: req.user.id,
        });

        return res.json({ message: "Product disabled" });
    } catch (error) {
        console.error("DISABLE PRODUCT ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
