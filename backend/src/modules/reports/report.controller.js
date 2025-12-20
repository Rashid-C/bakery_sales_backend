import Sale from "../sales/sale.model.js";

// -----------------------------
// DAILY REPORT
// -----------------------------
export const dailyReport = async (req, res) => {
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
        return res.status(400).json({ message: "date is required" });
    }

    const result = await Sale.aggregate([
        {
            $match: {
                saleDate: date,
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: "$saleDate",
                totalSales: { $sum: "$totalAmount" },
                totalBills: { $sum: 1 },
            },
        },
    ]);

    res.json(result[0] || { totalSales: 0, totalBills: 0 });
};

// -----------------------------
// MONTHLY REPORT
// -----------------------------
export const monthlyReport = async (req, res) => {
    const { month } = req.query; // YYYY-MM

    if (!month) {
        return res.status(400).json({ message: "month is required" });
    }

    const result = await Sale.aggregate([
        {
            $match: {
                saleDate: { $regex: `^${month}` },
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: month,
                totalSales: { $sum: "$totalAmount" },
                totalBills: { $sum: 1 },
            },
        },
    ]);

    res.json(result[0] || { totalSales: 0, totalBills: 0 });
};

// -----------------------------
// YEARLY REPORT
// -----------------------------
export const yearlyReport = async (req, res) => {
    const { year } = req.query; // YYYY

    if (!year) {
        return res.status(400).json({ message: "year is required" });
    }

    const result = await Sale.aggregate([
        {
            $match: {
                saleDate: { $regex: `^${year}` },
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: year,
                totalSales: { $sum: "$totalAmount" },
                totalBills: { $sum: 1 },
            },
        },
    ]);

    res.json(result[0] || { totalSales: 0, totalBills: 0 });
};
