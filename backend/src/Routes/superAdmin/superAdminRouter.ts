import exprees from "express";
import { SuperAdminController } from "../../Controller/authController/superAdmin/implementation/superAdminController";
import { verifyAccessToken } from "../../middleware/jwt";
import { asyncHandler } from "../../middleware/asyncHandler";
import { PlanController } from "../../Controller/SuperAdmin/planController/Implimentation/planController";
import { container } from "../../DI/container";
import { TYPES } from "../../DI/types";
import { UserController } from "../../Controller/userController/implementation/userController";
import { authorizeRoles } from "../../middleware/authorizeRole";

const superAdminController = container.get<SuperAdminController>(
  TYPES.SuperAdminController
);
const superAdminPlanController = container.get<PlanController>(
  TYPES.AdminPlanControler
);

const userController = container.get<UserController>(TYPES.userController);


const router = exprees.Router();
// router
//   .route("/getallrestaurent")
//   .get(asyncHandler(superAdminController.getAllRestaurent));
router
  .route("/getallrestaurent")
  .get((req,res,next)=>{
     console.log("ROUTE HIT");
     next();
  }, asyncHandler(superAdminController.getAllRestaurent));

router
  .route("/restaurent/approve/:id")
  .patch(
    verifyAccessToken,
    authorizeRoles("superadmin"),
    asyncHandler(superAdminController.approveRestaurant)
  );
router
  .route("/restaurent/reject/:id")
  .patch(
    verifyAccessToken,
    authorizeRoles("superadmin"),
    asyncHandler(superAdminController.rejectRestaurant)
  );

router
  .route("/plan")
  .get(verifyAccessToken,authorizeRoles("superadmin","admin"), asyncHandler(superAdminPlanController.getAllPlan))
  .post(verifyAccessToken,authorizeRoles("superadmin"), asyncHandler(superAdminPlanController.addPlan));

router
  .route("/plan/:id")
  .put(verifyAccessToken,authorizeRoles("superadmin"), asyncHandler(superAdminPlanController.editPlan))
  .delete(verifyAccessToken,authorizeRoles("superadmin"), asyncHandler(superAdminPlanController.delPlan));


//Block and unblock restaurant
router
  .route("/restaurant/:restaurantId/:status")
  .patch(verifyAccessToken,authorizeRoles("superadmin"),asyncHandler(superAdminController.changeStatus));

//users
router
  .route("/user")
  .get(verifyAccessToken,authorizeRoles("superadmin"), asyncHandler(userController.getAllUsers));
router
  .route("/user/:userId/status")
  .patch(verifyAccessToken,authorizeRoles("superadmin"), asyncHandler(userController.updateUserStatus));


export default router;
