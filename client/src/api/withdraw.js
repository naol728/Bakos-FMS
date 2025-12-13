import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClient";
const BASE = "withdraw";
export const getUserwithdraw = async (data) => {
  return handleApiResponse(() =>
    apiClient.get(`/${BASE}/userrequest/${data.user_id}`)
  );
};
export const withdraw = async (data) => {
  return handleApiResponse(() => apiClient.post(`/${BASE}/withdraw`, data));
};
