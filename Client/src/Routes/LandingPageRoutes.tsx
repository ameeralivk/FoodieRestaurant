import { Route, Routes } from "react-router-dom";
import LandingPage from "../Pages/LandingPages";
import PageNotFound from "../Pages/auth/PageNotFound";
import StaffResetPasswordPage from "../Pages/auth/forgetStaffPasswordResetPage";

const LandingPagesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/staff/reset-password"
        element={
            <StaffResetPasswordPage />
        }
      />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
};

export default LandingPagesRoutes;
