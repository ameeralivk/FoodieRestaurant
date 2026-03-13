

import React, { Suspense} from "react";
import { Routes, Route } from "react-router-dom";
import AppLoader from "./Components/Elements/AppLoader";

// Lazy-loaded route groups
const LandingPagesRoutes = React.lazy(() => import("./Routes/LandingPageRoutes"));
const AdminRoutes = React.lazy(() => import("./Routes/AdminRoutes"));
const UserRoutes = React.lazy(() => import("./Routes/userRoutes"));
const SuperAdminRoutes = React.lazy(() => import("./Routes/SuperAdminRoutes"));
const ChefRoutes = React.lazy(() => import("./Routes/cheffRoutes"));
const StaffRoutes = React.lazy(() => import("./Routes/StaffRoutes"));
const ResetPasswordPage = React.lazy(()=>import("./Pages/auth/forgetPasswordResetPage"));

const App = () => {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route path="/*" element={<LandingPagesRoutes />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
        <Route path="/staff/*" element={<StaffRoutes />} />
        <Route path="/chef/*" element={<ChefRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default App;
