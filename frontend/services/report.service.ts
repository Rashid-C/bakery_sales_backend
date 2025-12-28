// services/report.service.ts
import api from "../api/api";

export const getReportSummary = async (
  type: "daily" | "monthly" | "yearly",
  value: string
) => {
  const res = await api.get(
    `/reports/summary?type=${type}&value=${value}`
  );
  return res.data;
};

// ✅ FIXED PATHS (export)
export const getReportPdfUrl = (
  type: "daily" | "monthly" | "yearly",
  value: string
) =>
  `${process.env.EXPO_PUBLIC_API_URL}/reports/export/pdf?type=${type}&value=${value}`;

export const getReportExcelUrl = (
  type: "daily" | "monthly" | "yearly",
  value: string
) =>
  `${process.env.EXPO_PUBLIC_API_URL}/reports/export/excel?type=${type}&value=${value}`;
