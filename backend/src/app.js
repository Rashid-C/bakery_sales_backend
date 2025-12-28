import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import shopRouter from "./modules/shops/shop.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import salesRoutes from "./modules/sales/sales.routes.js";
import reportRoutes from "./modules/reports/report.routes.js";
import reportExportRoutes from "./modules/reports/report.export.routes.js";
import auditRoutes from "./modules/audit/audit.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ EXPLICIT ROUTE MOUNTING (IMPORTANT)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shops", shopRouter);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reports/export", reportExportRoutes);
app.use("/api/audit-logs", auditRoutes);

// Static uploads
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

export default app;
