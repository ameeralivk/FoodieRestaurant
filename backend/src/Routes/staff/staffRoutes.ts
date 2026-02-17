import express from "express";
import { OrderController } from "../../Controller/orderController/implimentation/orderController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { container } from "../../DI/container";
import { TYPES } from "../../DI/types";
const orderController = container.get<OrderController>(TYPES.orderController);
const Router = express.Router();

Router.route("/getOrders/:restaurantId").get(
  asyncHandler(orderController.getEntireOrderByStatus),
);
Router.route("/getAssignedItems/:restaurantId/:chefId").get(orderController.getAssignedItems)
Router.route("/update-item").patch(
  asyncHandler(orderController.updateItemStatus),
);
Router.route("/orders/:orderId/item/:itemId/assign-cheff").patch(asyncHandler(orderController.assignChefToItem))
Router.route("/assignOrder/:orderId").patch(orderController.assignOrder)

Router.route("/order/updatestatus/:orderId").patch(orderController.updateOrderStatus)

export default Router;
