// import { Route, Routes } from "react-router-dom";
// import LandingPagesRoutes from "./Routes/LandingPageRoutes";
// import AdminRoutes from "./Routes/AdminRoutes";
// import PublicRoute from "./Routes/publicRoute";
// import UserRoutes from "./Routes/userRoutes";
// import SuperAdminRoutes from "./Routes/SuperAdminRoutes";
// import StaffResetPasswordPage from "./Pages/auth/forgetStaffPasswordResetPage";
// import { useEffect, useState } from "react";
// import AppLoader from "./Components/Elements/AppLoader";
// import ChefRoutes from "./Routes/cheffRoutes";
// import StaffRoutes from "./Routes/StaffRoutes";
// const App = () => {
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) return <AppLoader />;
//   return (
//     <Routes>
//       <Route path="/*" element={<PublicRoute><LandingPagesRoutes /></PublicRoute>} />
//       <Route
//         path="/staff/reset-password"
//         element={<StaffResetPasswordPage />}
//       />
//       <Route path="/admin/*" element={<AdminRoutes />} />
//       <Route path="/user/*" element={<UserRoutes />} />
//       <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
//       <Route path="/staff/*" element={<StaffRoutes />} />
//       <Route path="/chef/*" element={<ChefRoutes />} />
//     </Routes>
//   );
// };

// export default Appp;

import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AppLoader from "./Components/Elements/AppLoader";

// Lazy-loaded route groups
const LandingPagesRoutes = React.lazy(() => import("./Routes/LandingPageRoutes"));
const AdminRoutes = React.lazy(() => import("./Routes/AdminRoutes"));
const UserRoutes = React.lazy(() => import("./Routes/userRoutes"));
const SuperAdminRoutes = React.lazy(() => import("./Routes/SuperAdminRoutes"));
const ChefRoutes = React.lazy(() => import("./Routes/cheffRoutes"));
const StaffRoutes = React.lazy(() => import("./Routes/StaffRoutes"));

// Small page
import StaffResetPasswordPage from "./Pages/auth/forgetStaffPasswordResetPage";

const App = () => {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route path="/*" element={<LandingPagesRoutes />} />
        <Route path="/staff/reset-password" element={<StaffResetPasswordPage />} />
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
