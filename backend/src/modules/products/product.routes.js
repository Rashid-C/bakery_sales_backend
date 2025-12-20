import express from "express";
import {
    createProduct,
    getActiveProducts,
    updateProduct,
    disableProduct,
} from "./product.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

// Admin only
router.post("/", authMiddleware, requireRole("ADMIN"), createProduct);
router.put("/:id", authMiddleware, requireRole("ADMIN"), updateProduct);
router.delete("/:id", authMiddleware, requireRole("ADMIN"), disableProduct);

// Admin + Employee
router.get("/", authMiddleware, getActiveProducts);

export default router;
