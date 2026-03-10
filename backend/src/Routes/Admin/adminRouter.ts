import express from "express";
import { PaymentController } from "../../Controller/paymentController/Implimentation/paymentController";
import { asyncHandler } from "../../middleware/asyncHandler";
import { verifyAccessToken } from "../../middleware/jwt";
import { container } from "../../DI/container";
import { TYPES } from "../../DI/types";
import { SubcriptionController } from "../../Controller/Restaurent/subscriptionController/implimentation/subsciptionController";
import { StaffController } from "../../Controller/staffController/implementation/staffController";
import { checkActivePlan } from "../../middleware/planCheckMiddleware";
import { TableController } from "../../Controller/tableController/implement/tableController";
import { ItemController } from "../../Controller/itemController/implementation/itemController";
import { CategoryController } from "../../Controller/categoryController/implementation/categoryController";
import { SubCategoryController } from "../../Controller/subCategoryController/implementation/subCategoryControlller";
import { uploadItemImages } from "../../config/multerConfig";
import { updateItemImagesUpload } from "../../config/multerConfig";
import { authorizeRoles } from "../../middleware/authorizeRole";
const paymentController = container.get<PaymentController>(
  TYPES.PaymentController
);
const subcriptionController = container.get<SubcriptionController>(
  TYPES.SubscriptionController
);
const tableController = container.get<TableController>(TYPES.tableController);
const staffController = container.get<StaffController>(TYPES.staffController);
const itemsController = container.get<ItemController>(TYPES.itemsController);
const categoryController = container.get<CategoryController>(
  TYPES.categoryController
);
const subCategoryController = container.get<SubCategoryController>(
  TYPES.SubCategoryController
);

const Router = express.Router();

Router.route("/create-payment").post(
  verifyAccessToken,
  authorizeRoles("admin"),
  asyncHandler(paymentController.createPayment)
);

//subcription
Router.route("/getplan/:restaurantId").get(
  verifyAccessToken,
  authorizeRoles("admin","user"),
  asyncHandler(subcriptionController.getPlan)
);

Router.route("/subscription/upgrade").post(
  verifyAccessToken,
  authorizeRoles("admin"),
  asyncHandler(paymentController.upgrade)
);

//staff
Router.route("/staff").post(
  verifyAccessToken,
  authorizeRoles("admin"),
  checkActivePlan,
  asyncHandler(staffController.addStaff)
);

Router.route("/staff/:staffId")
  .put(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(staffController.editStaff)
  )
  .delete(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(staffController.deleteStaff)
  )
  .patch(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(staffController.changeStatus)
  );

Router.route("/staff/:restaurantId").get(
  verifyAccessToken,
  authorizeRoles("admin"),
  asyncHandler(staffController.getAllStaff)
);

//table
Router.route("/table").post(
  verifyAccessToken,
  authorizeRoles("admin"),
  checkActivePlan,
  asyncHandler(tableController.addTable)
);

Router.route("/table/:tableId")
  .put(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(tableController.editTable)
  )
  .delete(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(tableController.deleteTable)
  )
  .patch(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(tableController.updateAvailability)
  );

Router.route("/table/:restaurantId").get(
  verifyAccessToken,
  authorizeRoles("admin"),
  asyncHandler(tableController.getAllTables)
);

//items
Router.route("/items").post(
  verifyAccessToken,
  authorizeRoles("admin"),
  checkActivePlan,
  uploadItemImages,
  asyncHandler(itemsController.addItems)
);

Router.route("/items/:itemId")
  .patch(
    verifyAccessToken,
    authorizeRoles("admin"),
    updateItemImagesUpload,
    asyncHandler(itemsController.editItem)
  )
  .delete(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(itemsController.deleteItem)
  )
  .get(
    verifyAccessToken,
    authorizeRoles("admin", "user"),
    asyncHandler(itemsController.getItem)
  );

Router.route("/items/:itemId/status").patch(
  verifyAccessToken,
  authorizeRoles("admin"),
  asyncHandler(itemsController.changeStatus)
);
Router.route("/restaurants/items/:restaurantId").get(
  verifyAccessToken,
  authorizeRoles("admin", "user"),
  asyncHandler(itemsController.getAllItems)
);

//category
Router.route("/category").post(
  verifyAccessToken,
  authorizeRoles("admin"),
  asyncHandler(categoryController.addCategory)
);

Router.route("/category/:restaurantId").get(
  verifyAccessToken,
  authorizeRoles("admin","user"),
  asyncHandler(categoryController.getAllCategory)
);

Router.route("/category/:restaurantId/:categoryId")
  .patch(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(categoryController.editCategory)
  )
  .delete(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(categoryController.deleteCategory)
  );

//subcategory

Router.route("/subcategory").post(
  verifyAccessToken,
  authorizeRoles("admin"),
  asyncHandler(subCategoryController.addSubCategory)
);

Router.route("/subcategory/:restaurantId").get(
  verifyAccessToken,
  authorizeRoles("admin","user"),
  asyncHandler(subCategoryController.getAllByRestaurant)
);

Router.route("/subcategory/:categoryId")
  .patch(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(subCategoryController.editSubCategory)
  )
  .delete(
    verifyAccessToken,
    authorizeRoles("admin"),
    asyncHandler(subCategoryController.deleteSubCategory)
  );
Router.route("/subcategory/:restaurantId/:categoryId").get(
  verifyAccessToken,
  authorizeRoles("admin"),
  asyncHandler(subCategoryController.getAllSubCategories)
);

//Ai

export default Router;
