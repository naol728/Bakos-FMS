import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClient";

export const getFinancereport = async () => {
  return handleApiResponse(() => apiClient.get("/finance/report"));
};

export const getdepositreport = async () => {
  return handleApiResponse(() => apiClient.get("/finance/deposit"));
};
export const getloanreport = async () => {
  return handleApiResponse(() => apiClient.get("/finance/loan"));
};
