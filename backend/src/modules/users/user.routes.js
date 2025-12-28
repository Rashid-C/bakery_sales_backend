import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { createUser } from "./user.controller.js";

const router = express.Router();

// ------------------------------------
// ADMIN — Create User (Employee/Admin)
// ------------------------------------
router.post(
    "/",
    authMiddleware,
    requireRole("ADMIN"),
    createUser
);

// ------------------------------------
// Admin-only test route
// ------------------------------------
router.get(
    "/admin-test",
    authMiddleware,
    requireRole("ADMIN"),
    (req, res) => {
        res.json({
            message: "Admin access granted",
            user: req.user,
        });
    }
);

// ------------------------------------
// Employee-only test route
// ------------------------------------
router.get(
    "/employee-test",
    authMiddleware,
    requireRole("EMPLOYEE"),
    (req, res) => {
        res.json({
            message: "Employee access granted",
            user: req.user,
        });
    }
);

export default router;
