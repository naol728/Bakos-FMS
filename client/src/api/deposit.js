import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClient";

export const deposit = async (data) => {
  return handleApiResponse(() => apiClient.post("/fund/deposit", data));
};
