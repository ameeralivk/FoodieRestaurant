import type { FormData } from "../types/AdminTypes";
import { emailRegex, passwordRegex } from "../constants/CommonRejex";
import type { loginForm } from "../types/AdminTypes";
import {
  passErrorMessage,
  emailErrorMessage,
  restaurentNameError,
} from "../constants/messages";
const AdminRegisterValidation = (
  name: keyof FormData,
  value: string | File | null,
): string | null => {
  switch (name) {
    case "restaurantName":
      if (!value || (typeof value === "string" && !value.trim()))
        return "Restaurant name is required.";
      if (typeof value === "string" && value.trim().length < 3)
        return restaurentNameError;
      return null;

    case "email":
      if (!value || (typeof value === "string" && !value.trim()))
        return "Email is required.";
      if (typeof value === "string" && !emailRegex.test(value))
        return emailErrorMessage;
      return null;

    case "password":
      if (!value || (typeof value === "string" && !value.trim()))
        return "Password is required.";
      if (typeof value === "string" && !passwordRegex.test(value.trim())) {
        return passErrorMessage;
      }
      return null;
    default:
      return null;
  }
};

export const validateFullForm = (formData: FormData) => {
  const errors: Partial<Record<keyof FormData, string>> = {};

  for (const key in formData) {
    const field = key as keyof FormData;
    const value = formData[field];
    const error = AdminRegisterValidation(field, value);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (formData: loginForm) => {
  const errors: Partial<Record<keyof loginForm, string>> = {};

  for (const key in formData) {
    const field = key as keyof loginForm;
    const value = formData[field];
    const error = AdminRegisterValidation(field, value);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default AdminRegisterValidation;
