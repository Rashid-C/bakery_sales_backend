import express from "express";
import { createShop, getActiveShops } from "./shop.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

// Admin only
router.post(
    "/",
    authMiddleware,
    requireRole("ADMIN"),
    upload.single("image"),
    createShop
);

// Admin + Employee (read only)
router.get(
    "/",
    authMiddleware,
    getActiveShops
);

export default router;
