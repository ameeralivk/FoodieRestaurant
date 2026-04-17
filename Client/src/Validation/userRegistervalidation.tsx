interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
import { passwordRegex } from "../constants/CommonRejex";

export const validateUserRegister = (data: FormData, field?: string) => {
  let errors: any = {};

  if (!field || field === "name") {
    if (!data.name.trim()) {
      errors.name = "Name is required";
    } else if (data.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
  }

  if (!field || field === "email") {
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = "Invalid email format";
    }
  }

  if (!field || field === "password") {
    if (!data.password.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if(!passwordRegex.test(data.password)){
       errors.password =
      "Password must include uppercase, lowercase, number, and special character";
    }
  }

  if (!field || field === "confirmPassword") {
    if (!data.confirmPassword?.trim()) {
      errors.confirmPasswordError = "Confirm Password is required";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPasswordError = "Passwords do not match";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
