import mongoose from "mongoose";
import Sale from "./sale.model.js";
import SaleItem from "./saleItem.model.js";
import Product from "../products/product.model.js";
import Shop from "../shops/shop.model.js";
import { logAudit } from "../audit/audit.service.js";

// ADMIN + EMPLOYEE
export const createSale = async (req, res) => {
  try {
    const { shopId, saleDate, items } = req.body;

    // -------------------------------
    // 1️⃣ BASIC VALIDATION
    // -------------------------------
    if (!shopId || !saleDate || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "shopId, saleDate and items are required",
      });
    }

    // -------------------------------
    // 2️⃣ OBJECT ID VALIDATION
    // -------------------------------
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid shopId" });
    }

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: "Invalid productId" });
      }
    }

    // -------------------------------
    // 3️⃣ VALIDATE SHOP
    // -------------------------------
    const shop = await Shop.findOne({ _id: shopId, isActive: true });
    if (!shop) {
      return res.status(400).json({ message: "Shop not found or inactive" });
    }

    // -------------------------------
    // 4️⃣ PROCESS ITEMS & CALCULATE TOTAL
    // -------------------------------
    let totalAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const { productId, quantity } = item;

      if (quantity <= 0) {
        return res.status(400).json({
          message: "Quantity must be greater than zero",
        });
      }

      const product = await Product.findOne({
        _id: productId,
        isActive: true,
      });

      if (!product) {
        return res.status(400).json({
          message: "Product not found or inactive",
        });
      }

      // ITEM vs KG validation
      if (product.priceType === "ITEM" && !Number.isInteger(quantity)) {
        return res.status(400).json({
          message: `${product.name} quantity must be an integer`,
        });
      }

      const lineTotal = quantity * product.basePrice;
      totalAmount += lineTotal;

      saleItems.push({
        productId: product._id,
        quantity,
        priceAtSale: product.basePrice,
        lineTotal,
      });
    }

    // -------------------------------
    // 5️⃣ CREATE SALE (MASTER)
    // -------------------------------
    const sale = await Sale.create({
      shopId,
      soldBy: req.user.id,
      saleDate,
      totalAmount,
    });

    // -------------------------------
    // 6️⃣ CREATE SALE ITEMS
    // -------------------------------
    await SaleItem.insertMany(
      saleItems.map((item) => ({
        ...item,
        saleId: sale._id,
      }))
    );

    // -------------------------------
    // 7️⃣ AUDIT LOG
    // -------------------------------
    await logAudit({
      action: "CREATE_SALE",
      entity: "SALE",
      entityId: sale._id,
      performedBy: req.user.id,
      meta: { totalAmount, saleDate, shopId },
    });

  
    return res.status(201).json({
      saleId: sale._id,
      totalAmount,
    });
  } catch (error) {
    console.error("CREATE SALE ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
