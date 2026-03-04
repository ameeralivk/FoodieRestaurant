import express from "express"
import { container } from "../../DI/container"
import { StaffAuthController } from "../../Controller/authController/staff/implementation/staffAuthController"
import { TYPES } from "../../DI/types"
import { asyncHandler } from "../../middleware/asyncHandler"
const staffAuthController = container.get<StaffAuthController>(TYPES.staffAuthController)

const Router = express.Router()

Router.route("/login").post(asyncHandler(staffAuthController.login))
Router.route("/forgot-password").post(asyncHandler(staffAuthController.forgetPassword))
      .patch(asyncHandler(staffAuthController.updatePassword))

export default Router
