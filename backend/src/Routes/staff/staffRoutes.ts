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
Router.route("/update-item").patch(asyncHandler(orderController.updateItemStatus))

export default Router;
