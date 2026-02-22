
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function StaffPrivateRoute({ children }: any) {

  const user = useSelector((state: any) => state.userAuth.user);

  // not logged in
  if (!user) {
    return <Navigate to="/staff/login" replace />;
  }

  // role based redirect
  if (user.role === "chef") {
    return children; // allow staff routes
  }

  if (user.role === "staff") {
    return <Navigate to="/staff/staffdashboard" replace />;
  }

  // fallback
  return <Navigate to="/staff/login" replace />;
}
