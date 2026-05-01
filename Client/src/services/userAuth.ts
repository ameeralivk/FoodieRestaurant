import api from "./Api";
import { showErrorToast } from "../Components/Elements/ErrorToast";
import { AxiosError } from "axios";
import axios from "axios";
import type { AppDispatch } from "../redux/store/store";
import { useGoogleLogin } from "@react-oauth/google";
import { showSuccessToast } from "../Components/Elements/SuccessToast";
import type { AdminType } from "../types/AdminTypes";
import { userLoginAction } from "../redux/slice/userSlice";
import type { ForgetPasswordFormData } from "../types/AdminTypes";
import { AfterLoading } from "../Components/Elements/Loading";
import { loadingToast } from "../Components/Elements/Loading";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const handleUserLogin = async (
  email: string,
  password: string,
  dispatch: AppDispatch,
) => {
  try {
    const data = { email, password };

    const response = await api.post("/user/auth/login", data, {
      withCredentials: true,
    });

    if (response.status === 200) {
      const userData: AdminType = {
        phone: response.data.user.phone,
        name: response.data.user.name,
        _id: response.data.user._id,
        restaurantName: response.data.user.restaurantName,
        email: response.data.user.Email,
        role: "user",
        googleId: "",
        imageUrl: "",
        status: response.data.user.status || "",
      };

      dispatch(
        userLoginAction({
          user: userData,
        }),
      );

      return { success: true, data: response.data };
    } else {
      showErrorToast("Something went wrong");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      showErrorToast(message || "Login failed");
      return;
    }

    showErrorToast("An unknown error occurred");
    throw new Error("Something went wrong, please try again.");
  }
};

export const handleUserRegister = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const data = { name, email, password };
    const response = await api.post("/user/auth/register", data, {
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

export const userVerifyOtp = async (otp: string, email: string) => {
  try {
    const data = { otp: otp, email: email };
    const response = await api.post("/user/auth/verify-otp", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("SignUp Error:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const userResendOtp = async (email: string) => {
  try {
    const data = { email };
    const response = await api.post("/user/auth/resent-otp", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("SignUp Error:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

// export const userGoogleLoginHandler = (dispatch: AppDispatch) => {
//   const navigate = useNavigate();
//   return useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       try {
//         const res = await api.post("/user/auth/googleAuth", {
//           token: tokenResponse.access_token,
//         });
//         if (res.data.success) {
//           const saveddata: AdminType = {
//             name: res.data.data.name,
//             phone: res.data.data.phone,
//             _id: res.data.data._id,
//             restaurantName: res.data.data.restaurantName,
//             email: res.data.data.email,
//             role: res.data.data.role,
//             googleId: res.data.data.googleId,
//             imageUrl: res.data.data.imageUrl,
//             status: res.data.data.status,
//           };

//           dispatch(
//             userLoginAction({
//               user: saveddata,
//             }),
//           );

//           showSuccessToast("Google login successful!");
//           navigate("/user");
//         } else {
//           showErrorToast("Google authentication failed!");
//         }
//       } catch (err: unknown) {
//         console.error(err);

//         if (err instanceof Error) {
//           showErrorToast(err.message);
//         }
//       }
//     },
//     onError: () => showErrorToast("Google authentication failed"),
//   });
// };

export const userGoogleLoginHandler = (dispatch: AppDispatch) => {
  const navigate = useNavigate();

  return useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post("/user/auth/googleAuth", {
          token: tokenResponse.access_token,
        });

        if (res.data.success) {
          const saveddata: AdminType = {
            name: res.data.data.name,
            phone: res.data.data.phone,
            _id: res.data.data._id,
            restaurantName: res.data.data.restaurantName,
            email: res.data.data.email,
            role: res.data.data.role,
            googleId: res.data.data.googleId,
            imageUrl: res.data.data.imageUrl,
            status: res.data.data.status,
          };

          dispatch(userLoginAction({ user: saveddata }));

          showSuccessToast("Google login successful!");
          navigate("/user");
        } else {
          showErrorToast("Google authentication failed!");
        }
      } catch (err: unknown) {
        console.error(err);

        if (err instanceof Error) {
          showErrorToast(err.message);
        }
      }
    },

    onError: () => {
      showErrorToast("Google authentication failed");
    },
  });
};

export const handleUserForgetPasswordSubmit = async (
  formData: ForgetPasswordFormData,
) => {
  const loadingId = loadingToast();

  try {
    const response = await api.post("/user/auth/forget-password", {
      email: formData.email,
    });
    if (response.data.success || response.data.succes) {
      await AfterLoading(
        "Sending reset link...",
        response.data.message || "Password reset link sent successfully!",
      );
      toast.dismiss(loadingId);
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      toast.update(loadingId, {
        render: response.data.message || "Failed to send reset link!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return false;
    }
  } catch (error: unknown) {
    toast.update(loadingId, {
      render: axios.isAxiosError(error)
        ? error.response?.data?.message || "Something went wrong!"
        : error instanceof Error
          ? error.message
          : "An unknown error occurred",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};
