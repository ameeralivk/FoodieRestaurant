import express from "express"
import { asyncHandler } from "../middleware/asyncHandler"
import { container } from "../DI/container"
import { NotificationController } from "../Controller/notificationController/implimentation/notificationController"
import { TYPES } from "../DI/types"

const router = express.Router()


const notificationController =  container.get<NotificationController>(TYPES.NotificationController)


router.route("/getNotification/:recipientId").get(asyncHandler(notificationController.getAllNotification))
router.route("/:notificationId").patch(asyncHandler(notificationController.markAsRead))


export default router