import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClient";
const BASE = "loan";
export const getLoans = async () => {
  return handleApiResponse(() => apiClient.get(`/${BASE}/getloans`));
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
