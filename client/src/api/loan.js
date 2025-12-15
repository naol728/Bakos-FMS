import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClient";
const BASE = "loan";
export const getLoans = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/getloans`));
};
export const myloans = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/myloans`));
};
export const loandepesment = async (data) => {
  return handleApiResponse(() =>
    apiClient.post(`/${BASE}/loandepesment`, data)
  );
};
export const loanrepayment = async (data) => {
  return handleApiResponse(() => apiClient.post(`/${BASE}/repayloan`, data));
};
export const getLoanRequests = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/getloanrequests`));
};
export const updateStatusLoanCommite = async (data) => {
  return handleApiResponse(() =>
    apiClient.post(`/${BASE}/commiteaproval/${data.id}`, data)
  );
};
export const updateStausManager = async (data) => {
  return handleApiResponse(() =>
    apiClient.post(`/${BASE}/manageraproval/${data.id}`, data)
  );
};
export const getuserLoanrequest = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/myrequests`));
};
export const createrequest = async (data) => {
  return handleApiResponse(() =>
    apiClient.post(`/${BASE}/createrequest`, data)
  );
};
export const updaterequest = async (data) => {
  return handleApiResponse(() =>
    apiClient.post(`/${BASE}/updaterequest`, data)
  );
};
export const deleterequest = async (id) => {
  return handleApiResponse(() =>
    apiClient.delete(`/${BASE}/deleterequest/${id}`)
  );
};
