import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../redux/store/store";

export default function StaffPublicRoute() {
  const user = useSelector((state: RootState) => state.userAuth.user);
  if (user && (user.role == "staff" || "chef")) {
    return <Navigate to="/staff/dashboard" replace />;
  }

  return <Outlet />;
}
