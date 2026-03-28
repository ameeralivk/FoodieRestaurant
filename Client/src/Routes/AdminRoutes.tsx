
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import RestaurentLoginPage from "../Pages/auth/RestaurentLoginPage";
import AdminRegisterPage from "../Pages/auth/RestaurantRegisterPage";
import PageNotFound from "../Pages/auth/PageNotFound";
import ForgetPasswordPage from "../Pages/auth/ForgotPassword";
import RestaurantMainRegistration from "../Pages/auth/RestuarantRegisterMainPage";

import ProtectedRoute from "./protectedRoute";
import PublicRoute from "./publicRoute";

import PaymentSuccessModal from "../Components/Component/Admin/PaymentSuccessmodal";
import PaymentFailedPage from "../Components/Component/Admin/PaymentFailedModal";

// Lazy loaded pages
const AdminDashboard = lazy(() => import("../Pages/admin/AdminDashboard"));
const AdminSubscriptionPage = lazy(() => import("../Pages/admin/AdminSubscriptionPage"));
const StaffManagement = lazy(() => import("../Pages/admin/StaffManagement"));
const TableManagement = lazy(() => import("../Pages/admin/Table"));
const SubCategory = lazy(() => import("../Pages/admin/SubCategory"));
const Category = lazy(() => import("../Pages/admin/Category"));
const ItemsPage = lazy(() => import("../Pages/admin/ItemsPage"));
const VarientPage = lazy(() => import("../Pages/admin/varientPage"));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        <Route path="/login" element={<PublicRoute><RestaurentLoginPage /></PublicRoute>} />

        <Route path="/register" element={<PublicRoute><AdminRegisterPage /></PublicRoute>} />

        <Route path="/forgetPassword" element={<PublicRoute><ForgetPasswordPage /></PublicRoute>} />

        <Route path="/onboarding" element={<ProtectedRoute><RestaurantMainRegistration /></ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        <Route path="/subscriptionplan" element={<ProtectedRoute><AdminSubscriptionPage /></ProtectedRoute>} />

        <Route path="/staff" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />

        <Route path="/varients" element={<ProtectedRoute><VarientPage /></ProtectedRoute>} />

        <Route path="/table" element={<ProtectedRoute><TableManagement /></ProtectedRoute>} />

        <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />

        <Route path="/subcategory" element={<ProtectedRoute><SubCategory /></ProtectedRoute>} />

        <Route path="/items" element={<ProtectedRoute><ItemsPage /></ProtectedRoute>} />

        <Route path="/payment-success" element={<PaymentSuccessModal />} />

        <Route path="/admin/payment-failed" element={<PaymentFailedPage />} />

        <Route path="/*" element={<PageNotFound />} />

      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
