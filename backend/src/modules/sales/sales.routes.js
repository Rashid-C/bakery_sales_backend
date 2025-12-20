import express from "express";
import { createSale } from "./sales.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Admin + Employee
router.post("/", authMiddleware, createSale);

export default router;
