import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClient";
const BASE = "admin";
export const createEmployee = async (data) => {
  return handleApiResponse(() =>
    apiClient.post(`/${BASE}/createemployee`, data)
  );
};
export const getEmployee = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/getemployee`));
};

export const getmeetings = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/getmettings`));
};
export const updateEmployee = async (data) => {
  return handleApiResponse(() =>
    apiClient.patch(`/${BASE}/updateemployee`, data)
  );
};
export const deleteEmployee = async (id) => {
  return handleApiResponse(() =>
    apiClient.delete(`/${BASE}/deleteemployee/${id}`)
  );
};

export const updateme = async (data) => {
  return handleApiResponse(() =>
    apiClient.patch(`/${BASE}/updateme`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};
export const log = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/log`));
};
export const createMeeting = async (data) => {
  return handleApiResponse(() => apiClient.post(`/meeting/create`, data));
};
