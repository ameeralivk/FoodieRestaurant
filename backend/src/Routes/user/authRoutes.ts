import express from "express";
import { UserAuthController } from "../../Controller/authController/user/auth/implimentation/userAuthController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { container } from "../../DI/container";
import { TYPES } from "../../DI/types";

const userController = container.get<UserAuthController>(
  TYPES.UserAuthController
);
const router = express.Router();
router.route("/register").post(asyncHandler(userController.register));
router.route("/login").post(asyncHandler(userController.login));
router.route("/verify-otp").post(asyncHandler(userController.verifyOtp));
router.route("/googleAuth").post(asyncHandler(userController.googleAuth));
router.route("/resent-otp").post(asyncHandler(userController.resendOtp));
router
  .route("/forget-password")
  .post(asyncHandler(userController.forgetPassword))
  .patch(asyncHandler(userController.updatePassword));
export default router;
