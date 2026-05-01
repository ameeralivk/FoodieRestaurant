import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../redux/store/store";

export default function UserPrivateRoute({ children }: any) {
  const user = useSelector((state: RootState) => state.userAuth.user);

  return user && user.role === "user" ? (
    children
  ) : (
    <Navigate to="/user/login" replace />
  );
}
