import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClient";
const BASE = "customer";

export const createCustomer = async (data) => {
  return handleApiResponse(() =>
    apiClient.post(`/${BASE}/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};
export const getCusomers = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/get`));
};
export const deleteCustomer = async (id) => {
  return handleApiResponse(() => apiClient.delete(`/${BASE}/delete/${id}`));
};
export const updateCustomer = async (data) => {
  return handleApiResponse(() =>
    apiClient.patch(`/${BASE}/update`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};
export const getCustomer = async (id) => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/get/${id}`));
};

export const getme = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/getme`));
};
