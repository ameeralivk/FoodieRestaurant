import api from "../services/Api";
import axios, { type AxiosRequestConfig } from "axios";
import { showErrorToast } from "../Components/Elements/ErrorToast";

export const apiRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });
    return response.data as T;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      showErrorToast(message ?? "Request failed");
    } else if (error instanceof Error) {
      showErrorToast(error.message);
    } else {
      showErrorToast("An unknown error occurred");
    }

    throw error;
  }
};
