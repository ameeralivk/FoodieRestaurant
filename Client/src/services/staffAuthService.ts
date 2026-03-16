import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
import type { Staff } from "../types/staffTypes";

export const staffLogin = async (
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; data: Staff }> => {
  return apiRequest(HTTP_METHOD.POST, API_ROUTES.STAFF_AUTH.LOGIN, {
    email,
    password,
  });
};

export const sendStaffResetEmail = async (
  email: string,
): Promise<{ succes: true; message: string }> => {
  return await apiRequest(HTTP_METHOD.POST,API_ROUTES.STAFF_AUTH.FORGOT_PASSWORD, {
    email,
  });
};
