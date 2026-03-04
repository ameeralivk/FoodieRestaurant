import { Route, Routes } from "react-router-dom";
import StaffLogin from "../Pages/staff/StaffLogin";
import StaffPrivateRoute from "./staff/StaffPrivateRoute";
import Items from "../Pages/staff/Items";
import Dashboard1 from "../Pages/staff/Dashboard1";
import StaffDashboard from "../Pages/staff/StaffDashboard";
import StaffOrders from "../Pages/staff/StaffOrders";
import Profile from "../Pages/staff/StaffProfile";
import StaffHistory from "../Pages/staff/StaffHistory";
import StaffAnalytics from "../Pages/staff/StaffAnalytics";
import StaffForgotPassword from "../Pages/staff/forgetPassword";
const StaffRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<StaffLogin />} />

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
        <Route path="/history" element={<StaffHistory />} />
        <Route path="/forgot-password" element={<StaffForgotPassword />} />
        <Route path="/analytics" element={<StaffAnalytics />} />
      </Routes>
    </div>
  );
};

export default StaffRoutes;
