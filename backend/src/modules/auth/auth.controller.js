import User from "../users/user.model.js";
import { comparePassword } from "../../utils/password.js";
import { generateAccessToken } from "../../utils/jwt.js";
import { logAudit } from "../audit/audit.service.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // -------------------------------
        // 1️⃣ BASIC VALIDATION
        // -------------------------------
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username and password required" });
        }

        // -------------------------------
        // 2️⃣ FIND USER
        // -------------------------------
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Account blocked" });
        }

        // -------------------------------
        // 3️⃣ PASSWORD CHECK
        // -------------------------------
        const isMatch = await comparePassword(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // -------------------------------
        // 4️⃣ GENERATE TOKEN
        // -------------------------------
        const token = generateAccessToken({
            userId: user._id,
            role: user.role,
        });

        // -------------------------------
        // 5️⃣ AUDIT LOG (✅ CORRECT PLACE)
        // -------------------------------
        await logAudit({
            action: "LOGIN",
            entity: "USER",
            entityId: user._id,
            performedBy: user._id,
            meta: {
                role: user.role,
            },
        });

        // -------------------------------
        // 6️⃣ RESPONSE
        // -------------------------------
        return res.json({
            token,
            role: user.role,
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
