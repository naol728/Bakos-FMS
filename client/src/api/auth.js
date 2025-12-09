import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClient";
const BASE = "/auth";
export const login = (data) => {
  return handleApiResponse(() => apiClient.post(`${BASE}/login`, data));
};

export const me = () => {
  return handleApiResponse(() => apiClient.get(`${BASE}/me`));
};
export const refreshToken = (refresh_token) => {
  return handleApiResponse(() =>
    apiClient.post(`${BASE}/refreshtoken`, { refresh_token })
  );
};
