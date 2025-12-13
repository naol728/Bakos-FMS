import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClient";
const BASE = "loan";
export const getLoans = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/getloans`));
};
