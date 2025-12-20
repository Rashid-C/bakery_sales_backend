import express from "express";
import { exportExcel, exportPDF } from "./report.export.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
    "/excel",
    authMiddleware,
    requireRole("ADMIN"),
    exportExcel
);

router.get(
    "/pdf",
    authMiddleware,
    requireRole("ADMIN"),
    exportPDF
);

export default router;
