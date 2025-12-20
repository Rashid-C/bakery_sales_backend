import Shop from "./shop.model.js";
import { logAudit } from "../audit/audit.service.js";

// ------------------------------------
// ADMIN — CREATE SHOP
// ------------------------------------
export const createShop = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Shop name is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Shop image required" });
        }

        const shop = await Shop.create({
            name,
            imageUrl: `/uploads/${req.file.filename}`,
        });

        // 🔒 AUDIT LOG
        await logAudit({
            action: "CREATE_SHOP",
            entity: "SHOP",
            entityId: shop._id,
            performedBy: req.user.id,
            meta: { name },
        });

        return res.status(201).json(shop);
    } catch (error) {
        console.error("CREATE SHOP ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ------------------------------------
// ADMIN + EMPLOYEE — GET ACTIVE SHOPS
// ------------------------------------
export const getActiveShops = async (req, res) => {
    try {
        const shops = await Shop.find({ isActive: true }).select("name imageUrl");
        return res.json(shops);
    } catch (error) {
        console.error("GET SHOPS ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
