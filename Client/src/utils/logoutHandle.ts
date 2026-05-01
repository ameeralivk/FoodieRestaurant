import Swal from "sweetalert2";
import { logoutRequest } from "../services/Auth";
import { userLogoutAction } from "../redux/slice/userSlice";
import type { AppDispatch } from "../redux/store/store";

interface LogoutHandlerParams {
  dispatch: AppDispatch;
  navigate: (path: string) => void;
  showConfirm: (
    title: string,
    text: string,
    confirmText: string,
    cancelText: string
  ) => Promise<boolean>;
}

export const handleLogout = async ({
  dispatch,
  navigate,
  showConfirm,
}: LogoutHandlerParams) => {
  const confirmed = await showConfirm(
    "Logout",
    "Do you really want to logout?",
    "Logout",
    "Cancel"
  );

  if (!confirmed) return;

  const res = await logoutRequest();

  if (res) {
    dispatch(userLogoutAction());
    navigate("/user/login");
    Swal.fire("Logged out!", "You have been logged out.", "success");
  }
};
