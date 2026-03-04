import { verifyOtp, resendOtp } from "../../../services/Auth";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { showErrorToast } from "../../Elements/ErrorToast";
import type { AdminType } from "../../../types/AdminTypes";
import { userResendOtp, userVerifyOtp } from "../../../services/userAuth";
import { userLoginAction } from "../../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";

export const createOtpHandlers = (dispatch: any, email: string) => {
  const navigate = useNavigate();
  const handleAdminVerifyOtp = async (otp: string) => {
    try {
      const res = await verifyOtp(otp, email);
      showSuccessToast(res.message);

      // const data: AdminType = {
      //   _id: res.data.admin._id,
      //   restaurantName: res.data.admin.restaurantName,
      //   email: res.data.admin.email,
      //   role: res.data.admin.role,
      //   googleId: "",
      //   imageUrl: "",
      //   status: res.data.admin.status,
      // };
      // dispatch(loginAction({ admin: data, token: res.accesstoken }));
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (err: any) {
      showErrorToast(err.message);
    }
  };

  const handleAdminResendOtp = async () => {
    try {
      const res = await resendOtp(email);
      showSuccessToast(res.message);
    } catch (err: any) {
      showErrorToast(err.message);
    }
  };
  const handleUserVerifyOtp = async (otp: string) => {
    try {
      const res = await userVerifyOtp(otp, email);
      showSuccessToast(res.message);
      const data: AdminType = {
        _id: res.data.user._id,
        restaurantName: res.data.user.restaurantName,
        email: res.data.user.email,
        role: res.data.user.role,
        googleId: "",
        imageUrl: "",
        status: res.data.user.status || "",
      };
      dispatch(userLoginAction({ user: data }));
      navigate("/user");
    } catch (err: any) {
      showErrorToast(err.message);
    }
  };

  const handleUserResendOtp = async () => {
    try {
      const res = await userResendOtp(email);
      showSuccessToast(res.message);
    } catch (err: any) {
      showErrorToast(err.message);
    }
  };

  return {
    handleAdminVerifyOtp,
    handleAdminResendOtp,
    handleUserVerifyOtp,
    handleUserResendOtp,
  };
};
