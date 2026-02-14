import { Route, Routes } from "react-router-dom";
import LandingPagesRoutes from "./Routes/LandingPageRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import PublicRoute from "./Routes/publicRoute";
import UserRoutes from "./Routes/userRoutes";
import SuperAdminRoutes from "./Routes/SuperAdminRoutes";
import { useEffect, useState } from "react";
import AppLoader from "./Components/Elements/AppLoader";
import StaffRoutes from "./Routes/StaffRoutes";
const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <AppLoader />;
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <PublicRoute>
            <LandingPagesRoutes />
          </PublicRoute>
        }
      />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route
        path="/user/*"
        element={
              <UserRoutes />
            
        }
      />
      <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
      <Route path="/staff/*" element={<StaffRoutes />} />
    </Routes>
  );
};

export default App;
