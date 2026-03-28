import express from "express";
import { AdminAuthController } from "../Controller/authController/admin/implementation/adminAuthController";
import { asyncHandler } from "../middleware/asyncHandler";
import { upload } from "../config/multerConfig";
import { verifyAccessToken } from "../middleware/jwt";
import { updateDocumentUpload } from "../config/multerConfig";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
const router = express.Router();

const authController = container.get<AdminAuthController>(
  TYPES.AdminAuthController,
);

router.route("/signup").post(asyncHandler(authController.register));
router.route("/verify-otp").post(asyncHandler(authController.verifyOtp));
router.route("/resent-otp").post(asyncHandler(authController.resendOtp));
router.route("/googleAuth").post(asyncHandler(authController.googleAuth));
router.route("/refresh-token").get(asyncHandler(authController.refreshToken));
router.route("/login").post(asyncHandler(authController.login));
router
  .route("/getStatus/:id")
  .get(verifyAccessToken, asyncHandler(authController.getStatus));
router
  .route("/update-doc/:id")
  .put(verifyAccessToken, updateDocumentUpload, authController.updateDoc);
router.get("/auth/me", verifyAccessToken, (req, res) => {
  return res.json({
    authenticated: true,
    user: (req as any).user,
  });
});
router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  // res.clearCookie("access_token", {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "strict",
  // });
  // res.clearCookie("refresh_token", {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "strict",
  // });

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: isProduction ? ".moobiworld.shop" : undefined,
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: isProduction ? ".moobiworld.shop" : undefined,
  });
  res.clearCookie("accessToken");
  return res.json({ success: true, message: "Logged out ready ayi mone" });
});

router
  .route("/forget-password")
  .post(asyncHandler(authController.forgetPassword))
  .patch(asyncHandler(authController.updatePassword));
router
  .route("/on-boarding")
  .post(
    verifyAccessToken,
    upload,
    asyncHandler(authController.registerRestaurant),
  );

export default router;
