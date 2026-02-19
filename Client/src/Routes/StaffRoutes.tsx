import { Route, Routes } from "react-router-dom";
import StaffLogin from "../Pages/staff/StaffLogin";
import StaffPrivateRoute from "./staff/StaffPrivateRoute";
import StaffPublicRoute from "./staff/StaffPublicRoute";
import Items from "../Pages/staff/Items";
import Dashboard1 from "../Pages/staff/Dashboard1";
import StaffDashboard from "../Pages/staff/StaffDashboard";
import StaffOrders from "../Pages/staff/StaffOrders";
import Profile from "../Pages/staff/StaffProfile";
const StaffRoutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<StaffPublicRoute />}>
          <Route path="/login" element={<StaffLogin />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <StaffPrivateRoute>
              <Dashboard1 />
            </StaffPrivateRoute>
          }
        />
        <Route
          path="/items"
          element={
            <StaffPrivateRoute>
              <Items />
            </StaffPrivateRoute>
          }
        />
        <Route path="/staffdashboard" element={<StaffDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stafforders" element={<StaffOrders />} />
      </Routes>
    </div>
  );
};

export default StaffRoutes;
