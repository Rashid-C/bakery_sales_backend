import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import Sale from "../sales/sale.model.js";

// ------------------------------------
// COMMON QUERY BUILDER
// ------------------------------------
const buildMatchCondition = (type, value) => {
    const match = { isDeleted: false };

    if (type === "daily") match.saleDate = value;
    if (type === "monthly") match.saleDate = { $regex: `^${value}` };
    if (type === "yearly") match.saleDate = { $regex: `^${value}` };

    return match;
};

// ------------------------------------
// EXCEL EXPORT
// ------------------------------------
export const exportExcel = async (req, res) => {
    try {
        const { type, value } = req.query;

        if (!type || !value) {
            return res.status(400).json({ message: "type and value are required" });
        }

        const sales = await Sale.find(buildMatchCondition(type, value))
            .populate("shopId", "name")
            .populate("soldBy", "name")
            .lean();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Sales Report");

        sheet.columns = [
            { header: "Date", key: "saleDate", width: 15 },
            { header: "Shop", key: "shop", width: 20 },
            { header: "Sold By", key: "soldBy", width: 20 },
            { header: "Total Amount", key: "totalAmount", width: 15 },
        ];

        sales.forEach((sale) => {
            sheet.addRow({
                saleDate: sale.saleDate,
                shop: sale.shopId?.name || "N/A",
                soldBy: sale.soldBy?.name || "N/A",
                totalAmount: sale.totalAmount,
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=sales-${type}-${value}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("EXCEL EXPORT ERROR:", error);
        res.status(500).json({ message: "Failed to export Excel" });
    }
};

// ------------------------------------
// PDF EXPORT
// ------------------------------------
export const exportPDF = async (req, res) => {
    try {
        const { type, value } = req.query;

        if (!type || !value) {
            return res.status(400).json({ message: "type and value are required" });
        }

        const sales = await Sale.find(buildMatchCondition(type, value))
            .populate("shopId", "name")
            .populate("soldBy", "name")
            .lean();

        const doc = new PDFDocument({ margin: 30 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=sales-${type}-${value}.pdf`
        );

        doc.pipe(res);

        doc.fontSize(16).text("Sales Report", { align: "center" });
        doc.moveDown();

        sales.forEach((sale, index) => {
            doc
                .fontSize(10)
                .text(
                    `${index + 1}. ${sale.saleDate} | ${sale.shopId?.name} | ${sale.soldBy?.name} | ₹${sale.totalAmount}`
                );
        });

        doc.end();
    } catch (error) {
        console.error("PDF EXPORT ERROR:", error);
        res.status(500).json({ message: "Failed to export PDF" });
    }
};
