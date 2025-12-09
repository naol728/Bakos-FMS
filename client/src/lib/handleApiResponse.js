import { AxiosError } from "axios";
import { refreshToken } from "@/api/auth";

/**
 * Handles an API call globally with automatic token refresh.
 * Pass a function that performs the actual API request.
 */
export async function handleApiResponse(apiCall) {
  try {
    const response = await apiCall();
    if (!response?.data) throw new Error("Empty response from server.");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error;

      if (axiosError.response?.status === 401) {
        const storedRefreshToken = localStorage.getItem("refreshtoken");

        if (storedRefreshToken) {
          try {
            const refreshResponse = await refreshToken(storedRefreshToken);

            localStorage.setItem("token", refreshResponse.access_token);
            localStorage.setItem(
              "token_expires_at",
              refreshResponse.expires_at
            );

            return await apiCall();
          } catch (refreshError) {
            console.error("Refresh token failed", refreshError);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshtoken");
            window.location.href = "/";
            throw new Error("Session expired. Please log in again.");
          }
        } else {
          localStorage.removeItem("token");
          window.location.href = "/";
          throw new Error("Unauthorized. Please log in.");
        }
      }

      const serverMessage =
        axiosError.response?.data?.message ??
        Object.values(axiosError.response?.data?.errors || {})[0]?.[0] ??
        "An unknown error occurred.";
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unexpected error occurred.");
  }
}
