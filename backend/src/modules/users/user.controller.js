import User from "./user.model.js";
import { hashPassword } from "../../utils/password.js";
import { logAudit } from "../audit/audit.service.js";

// ------------------------------------
// ADMIN ONLY — CREATE USER
// ------------------------------------
export const createUser = async (req, res) => {
    try {
        const { name, username, password, role } = req.body;

        // 1️⃣ Validation
        if (!name || !username || !password) {
            return res.status(400).json({
                message: "name, username and password are required",
            });
        }

        // 2️⃣ Check existing user
        const exists = await User.findOne({ username });
        if (exists) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        // 3️⃣ Hash password
        const passwordHash = await hashPassword(password);

        // 4️⃣ Create user
        const user = await User.create({
            name,
            username,
            passwordHash,
            role: role === "ADMIN" ? "ADMIN" : "EMPLOYEE",
            isActive: true,
        });

        // 5️⃣ Audit log
        await logAudit({
            action: "CREATE_USER",
            entity: "USER",
            entityId: user._id,
            performedBy: req.user.id, // ADMIN ID
            meta: {
                username,
                role: user.role,
            },
        });

        // 6️⃣ Response
        res.status(201).json({
            message: "User created successfully",
            userId: user._id,
        });
    } catch (err) {
        console.error("CREATE USER ERROR:", err);
        res.status(500).json({
            message: "Server error",
        });
    }
};
