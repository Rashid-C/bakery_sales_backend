import express from "express";
import {
    dailyReport,
    monthlyReport,
    yearlyReport,
} from "./report.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

// Admin only
router.get("/daily", authMiddleware, requireRole("ADMIN"), dailyReport);
router.get("/monthly", authMiddleware, requireRole("ADMIN"), monthlyReport);
router.get("/yearly", authMiddleware, requireRole("ADMIN"), yearlyReport);

export default router;
