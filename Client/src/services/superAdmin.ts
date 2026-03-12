import api from "./Api";
import { showErrorToast } from "../Components/Elements/ErrorToast";
import axios from "axios";
import { AxiosError } from "axios";
import { showSuccessToast } from "../Components/Elements/SuccessToast";
export const getAllRestaurent = async (
  approval: boolean,
  page: number,
  limit: number,
  searchTerm: string,
) => {
  try {
    const response = await api.get("/superadmin/getallrestaurent", {
      params: { page, limit, searchTerm, approval },
      withCredentials: true,
    });
    if (response) {
      return response.data;
    } else {
      showErrorToast("Something wentWrong");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data.message;
      showErrorToast(message);
      return;
    } else if (error instanceof Error) {
      showErrorToast(error.message);
    } else {
      showErrorToast("An unknown error occurred");
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const approveRestaurant = async (restaurantId: string) => {
  try {
    const response = await api.patch(
      `/superadmin/restaurent/approve/${restaurantId}`,
      null,
      {
        withCredentials: true,
      },
    );

    if (response.data.success) {
      showSuccessToast("Restaurant approved successfully!");
      return response.data;
    } else {
      showErrorToast(response.data.message || "Failed to approve restaurant!");
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      showErrorToast(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } else if (error instanceof Error) {
      showErrorToast(error.message);
    } else {
      showErrorToast("An unknown error occurred!");
    }
    throw error;
  }
};

export const rejectRestaurant = async (
  restaurantId: string,
  rejectionReason: string,
) => {
  try {
    const response = await api.patch(
      `/superadmin/restaurent/reject/${restaurantId}`,
      { reason: rejectionReason },
      {
        withCredentials: true,
      },
    );

    if (response.data.success) {
      showSuccessToast("Restaurant approved successfully!");
      return response.data;
    } else {
      showErrorToast(response.data.message || "Failed to approve restaurant!");
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      showErrorToast(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } else if (error instanceof Error) {
      showErrorToast(error.message);
    } else {
      showErrorToast("An unknown error occurred!");
    }
    throw error;
  }
};
