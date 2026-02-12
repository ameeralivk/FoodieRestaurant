import { Route, Routes } from "react-router-dom";
import UserLandingPage from "../Pages/user/auth/LandingPage";
import UserLogin from "../Pages/user/auth/userLogin";
import UserSignUpPage from "../Pages/user/auth/registerPage";
import ForgotPassword from "../Pages/user/auth/forgetPasswordPage";
import UserPrivateRoute from "./user/userPrivateRoute";
import UserPublicRoute from "./user/userPublicRoute";
import PageNotFound from "../Pages/auth/PageNotFound";
import UserRestaurantPage from "../Pages/user/UserMenuPage";
import ItemDetailPage from "../Pages/user/ItemDetailsPage";
import CartPage from "../Pages/user/cartPage";
import UserProfile from "../Pages/user/profilePage";
import CheckoutPage from "../Pages/user/checkoutPage";
import UserOrderSuccessPage from "../Pages/user/orderSuccessPage";
import OrderHistory from "../Pages/user/orderPage";
import OrderDetail from "../Pages/user/orderDetailsPage";
import WalletPage from "../Pages/user/walletPage";
import PageWrapper from "../Components/Layouts/userLayouts/PageWrapper";
import OrderTracking from "../Pages/user/OrderTrackingPage";
const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserPublicRoute />}>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserSignUpPage />} />
        <Route path="/forgetPassword" element={<ForgotPassword />} />
      </Route>
      <Route
        path="/"
        element={
          <UserPrivateRoute>
            <PageWrapper>
              <UserLandingPage />
            </PageWrapper>
          </UserPrivateRoute>
        }
      />
      <Route path="/*" element={<PageNotFound />} />
      <Route
        path="/restaurant/:restaurantId"
        element={
          <PageWrapper>
            <UserRestaurantPage />
          </PageWrapper>
        }
      />
      <Route
        path="/:restaurantId/items/:itemId"
        element={
          <PageWrapper>
            <ItemDetailPage />
          </PageWrapper>
        }
      />
      <Route
        path="/:restaurantId/cart"
        element={
          <PageWrapper>
            <CartPage />
          </PageWrapper>
        }
      />
      <Route
        path="/profile"
        element={
          <PageWrapper>
            <UserProfile />
          </PageWrapper>
        }
      />
      <Route
        path="/checkout"
        element={
          <PageWrapper>
            <CheckoutPage />
          </PageWrapper>
        }
      />
      <Route path="/payment-success" element={<UserOrderSuccessPage />} />
      <Route
        path="/order"
        element={
          <PageWrapper>
            <OrderHistory />
          </PageWrapper>
        }
      />
      <Route
        path="/order/:orderId"
        element={
          <PageWrapper>
            <OrderDetail />
          </PageWrapper>
        }
      />
      <Route
        path="/wallet"
        element={
          <PageWrapper>
            <WalletPage />
          </PageWrapper>
        }
      />
      <Route
        path="/order/track/:orderId"
        element={
          <PageWrapper>
            <OrderTracking />
          </PageWrapper>
        }
      />
    </Routes>
  );
};

export default UserRoutes;
