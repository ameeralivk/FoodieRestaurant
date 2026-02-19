import express from "express";
import { OrderController } from "../../Controller/orderController/implimentation/orderController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { container } from "../../DI/container";
import { TYPES } from "../../DI/types";
import { verifyAccessToken } from "../../middleware/jwt";
import { StaffController } from "../../Controller/staffController/implementation/staffController";
const orderController = container.get<OrderController>(TYPES.orderController);
const staffAuthController = container.get<StaffController>(TYPES.staffController)
const Router = express.Router();

Router.route("/getOrders/:restaurantId").get(
  asyncHandler(orderController.getEntireOrderByStatus),
);
Router.route("/getAssignedItems/:restaurantId/:chefId").get(orderController.getAssignedItems)
Router.route("/update-item").patch(
  asyncHandler(orderController.updateItemStatus),
);
Router.route("/orders/:orderId/item/:itemId/assign-cheff").patch(verifyAccessToken,asyncHandler(orderController.assignChefToItem))
Router.route("/assignOrder/:orderId").patch(orderController.assignOrder)

Router.route("/order/updatestatus/:orderId").patch(orderController.updateOrderStatus)
//change Password
Router.route("/change-password").patch(verifyAccessToken,asyncHandler(staffAuthController.changePassword))

//get the staff
Router.route("/getstaff/:staffId").get(asyncHandler(staffAuthController.getStaff))

export default Router;
