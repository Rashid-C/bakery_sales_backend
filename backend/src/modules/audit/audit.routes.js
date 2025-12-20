import express from "express";
import { getAuditLogs } from "./audit.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, requireRole("ADMIN"), getAuditLogs);

export default router;
