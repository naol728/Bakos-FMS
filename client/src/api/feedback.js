import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClient";

const BASE = "feedback";
export const createFeedback = (data) => {
  return handleApiResponse(() => apiClient.post(`/${BASE}/create`, data));
};
export const getFeedback = () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/get`));
};
