import express from "express";
import { AiController } from "../../Controller/aiController/implementation/aiController";
import { container } from "../../DI/container";
import { TYPES } from "../../DI/types";
import { CartController } from "../../Controller/cartController/implementation/cartController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { verifyAccessToken } from "../../middleware/jwt";
import { UserController } from "../../Controller/userController/implementation/userController";
import { updateProfile } from "../../config/multerConfig";
import { PaymentController } from "../../Controller/paymentController/Implementation/paymentController";
import { OrderController } from "../../Controller/orderController/implementation/orderController";
import { UserWalletController } from "../../Controller/userWalletController/implementation/userWalletController";
import { VarientController } from "../../Controller/varientController/implementation/varientController";
import { FeedbackController } from "../../Controller/feedbackController/implementation/feedbackController";
import { TableController } from "../../Controller/tableController/implementation/tableController";
const aiController = container.get<AiController>(TYPES.aiController);
const cartController = container.get<CartController>(TYPES.cartController);
const tableController = container.get<TableController>(TYPES.tableController);
const userController = container.get<UserController>(TYPES.userController);
const paymentController = container.get<PaymentController>(
  TYPES.PaymentController,
);
const orderController = container.get<OrderController>(TYPES.orderController);
const userWalletController = container.get<UserWalletController>(
  TYPES.userWalletController,
);
const varientController = container.get<VarientController>(
  TYPES.VarientController,
);
const feedbackController = container.get<FeedbackController>(
  TYPES.FeedbackController,
);
const Router = express.Router();

Router.route("/ai").post(
  verifyAccessToken,
  asyncHandler(aiController.sendResponse),
);

//cart
Router.route("/cart").post(
  verifyAccessToken,
  asyncHandler(cartController.addToCart),
);
Router.route("/cart/update-quantity").put(
  verifyAccessToken,
  asyncHandler(cartController.updateQuantity),
);
Router.route("/cart/:cartId/:restaurantId").delete(
  verifyAccessToken,
  asyncHandler(cartController.deleteCart),
);
Router.route("/cart/:userId/:restaurantId").get(
  verifyAccessToken,
  asyncHandler(cartController.getCart),
);

//user
Router.route("/profile/verify-email-otp").post(
  verifyAccessToken,
  asyncHandler(userController.verifyEmailOtp),
);
Router.route("/profile/:userId/image").put(
  verifyAccessToken,
  updateProfile,
  asyncHandler(userController.updateImage),
);
Router.route("/profile/:userId")
  .get(verifyAccessToken, asyncHandler(userController.getAllUsers))
  .put(verifyAccessToken, asyncHandler(userController.updateProfile))
  .post(verifyAccessToken, asyncHandler(userController.changePassword));

//order
Router.route("/order/payment").post(
  verifyAccessToken,
  asyncHandler(paymentController.createOrderPayment),
);
Router.route("/orders").get(
  verifyAccessToken,
  asyncHandler(orderController.getAllOrders),
);
Router.route("/orders/:orderId").get(
  verifyAccessToken,
  asyncHandler(orderController.getOrder),
);
Router.route("/orders/:orderId/estimate").get(
  verifyAccessToken,
  asyncHandler(orderController.getEstimate),
);
Router.route("/orders/:orderId/cancell").post(
  verifyAccessToken,
  asyncHandler(orderController.cancelOrder),
);

//wallet
Router.route("/wallet").get(
  verifyAccessToken,
  asyncHandler(userWalletController.getWallet),
);
Router.route("/wallet/pay").post(
  verifyAccessToken,
  asyncHandler(userWalletController.payWithWallet),
);

//user Varient
Router.route("/varients")
  .post(verifyAccessToken, asyncHandler(varientController.addVarient))
  .get(verifyAccessToken, asyncHandler(varientController.getAllVarient));
Router.route("/varients/:varientId")
  .put(verifyAccessToken, asyncHandler(varientController.editVarient))
  .delete(verifyAccessToken, asyncHandler(varientController.deleteVarient));

//feedback
Router.route("/feedback").post(
  verifyAccessToken,
  asyncHandler(feedbackController.addFeedback),
);
Router.route("/feedback/items/:restaurantId").get(
  verifyAccessToken,
  asyncHandler(feedbackController.getItemsRating),
);

//table check
Router.route("/check-table").post(
  verifyAccessToken,
  asyncHandler(tableController.checkTable),
);

//instraction
Router.route("/instruction").patch(
  verifyAccessToken,
  asyncHandler(cartController.addInstruction),
);

export default Router;
