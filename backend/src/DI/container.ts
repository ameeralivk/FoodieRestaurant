import { Container } from "inversify";
import { TYPES } from "../DI/types";

import { PaymentRepository } from "../Repositories/payment/implementation/implimentation";
import { PaymentController } from "../Controller/paymentController/Implementation/paymentController";
import { PaymentService } from "../services/paymentService/Implementation/paymentService";
import { PlanController } from "../Controller/SuperAdmin/planController/Implementation/planController";
import { AdminPlanService } from "../services/planService/Implementation/adminPlanService";
import { AdminPlanRepository } from "../Repositories/planRepositories/implementation/adminPlanRepositories";
import { AdminAuthRepository } from "../Repositories/Admin/implementation/adminRepositories";
import { SuperAdminService } from "../services/superAdmin/implementation/superAdminService";
import { SuperAdminController } from "../Controller/authController/superAdmin/implementation/superAdminController";
import { AdminAuthController } from "../Controller/authController/admin/implementation/adminAuthController";
import { UserAuthController } from "../Controller/authController/user/auth/implementation/userAuthController";
import { UserAuthService } from "../services/userAuthService/auth/implementation/userAuthService";
import { UserAuthRepository } from "../Repositories/userAuth/auth/implementation/userRepository";
import { AdminAuthService } from "../services/admin/implementation/adminAuthService";
import { SubscriptionRepo } from "../Repositories/Subscription/Implementation/SubscriptionRepo";
import { SubcriptionServer } from "../services/subscription/implementation/subscriptionService";
import { SubcriptionController } from "../Controller/Restaurent/subscriptionController/implementation/subsciptionController";
import { StaffController } from "../Controller/staffController/implementation/staffController";
import { StaffRepository } from "../Repositories/staff/implemention/staffRepository";
import { StaffService } from "../services/staff/implementation/staffService";
import { StaffAuthService } from "../services/staffAuthService/implementation/staffAuthservice";
import { StaffAuthController } from "../Controller/authController/staff/implementation/staffAuthController";
import { TableRepository } from "../Repositories/Table/implementation/tableRepository";
import { TableController } from "../Controller/tableController/implementation/tableController";
import { TableService } from "../services/tableService/implementation/tableService";
import { UserController } from "../Controller/userController/implementation/userController";
import { UserService } from "../services/user/implementation/userService";
import { UserRepository } from "../Repositories/user/implementation/userRepository";
import { ItemController } from "../Controller/itemController/implementation/itemController";
import { ItemsService } from "../services/itemService/implementation/itemsService";
import { ItemsRepository } from "../Repositories/items/implementation/implementation";
import { CategoryController } from "../Controller/categoryController/implementation/categoryController";
import { CategoryService } from "../services/categoryService/implementation/categoryService";
import { CategoryRepository } from "../Repositories/category/implementation/categoryRepository";
import { SubCategoryController } from "../Controller/subCategoryController/implementation/subCategoryControlller";
import { SubCategoryService } from "../services/subCategoryService/implementation/subCategoryService";
import { SubCategoryRepository } from "../Repositories/subCategory/implementation/subCategoryRepository";
import { AiController } from "../Controller/aiController/implementation/aiController";
import { AIService } from "../services/aiService/implimentation/aiService";
import { CartController } from "../Controller/cartController/implementation/cartController";
import { CartService } from "../services/cart/implementation/cartService";
import { CartRepository } from "../Repositories/cart/implementation/cartRepository";
import { OrderRepository } from "../Repositories/order/implementation/implimentation";
import { OrderController } from "../Controller/orderController/implementation/orderController";
import { OrderService } from "../services/orderService/implimentation/orderService";
import { UserWalletRepository } from "../Repositories/userWallet/implementation/implementation";
import { UserWalletController } from "../Controller/userWalletController/implementation/userWalletController";
import { UserWalletService } from "../services/userWalletService/implementation/UserWalletService";
import { VarientController } from "../Controller/varientController/implementation/varientController";
import { VarientService } from "../services/varientService/implementation/varientService";
import { VarientRepository } from "../Repositories/varient/implementation/varientRepository";
import { FeedbackController } from "../Controller/feedbackController/implementation/feedbackController";
import { FeedbackService } from "../services/feedback/implementation/feedbackService";
import { FeedbackRepository } from "../Repositories/feedback/implementation/feedbackRepository";
import { NotificationController } from "../Controller/notificationController/implementation/notificationController";
import { NotificationService } from "../services/notificationService/implementation/notificationService";
import { NotificationRepository } from "../Repositories/notificationRepo/implementation/notificationRepo";
import { UserRefreshHandler } from "../services/admin/handler/user.handle";
import { AdminRefreshHandler } from "../services/admin/handler/admin.handler";
import { SuperAdminRefreshHandler } from "../services/admin/handler/superadmin.handle";
import { StaffRefreshHandler } from "../services/admin/handler/staff.handler";
import { RefreshTokenFactory } from "../services/admin/handler/refreshtokenFactory/refreshTokenFactory";

const container = new Container();
//payment
container.bind(TYPES.PaymentController).to(PaymentController);
container.bind(TYPES.PaymentRepository).to(PaymentRepository);
container.bind(TYPES.PaymentService).to(PaymentService);
//plan
container.bind(TYPES.AdminPlanControler).to(PlanController);
container.bind(TYPES.AdminPlanService).to(AdminPlanService);
container.bind(TYPES.AdminPlanRepository).to(AdminPlanRepository);
//superadminAuth
container.bind(TYPES.AdminAuthRepository).to(AdminAuthRepository);
container.bind(TYPES.SuperAdminService).to(SuperAdminService);
container.bind(TYPES.SuperAdminController).to(SuperAdminController);
//userAuth
container.bind(TYPES.UserAuthController).to(UserAuthController);
container.bind(TYPES.UserAuthService).to(UserAuthService);
container.bind(TYPES.UserAuthRepository).to(UserAuthRepository);

//adminAuth
container.bind(TYPES.AdminAuthController).to(AdminAuthController);
container.bind(TYPES.AdminAuthService).to(AdminAuthService);

//subscription
container.bind(TYPES.SubcriptionRepo).to(SubscriptionRepo);
container.bind(TYPES.SubcriptionService).to(SubcriptionServer);
container.bind(TYPES.SubscriptionController).to(SubcriptionController);

//staff
container.bind(TYPES.staffController).to(StaffController);
container.bind(TYPES.staffRepository).to(StaffRepository);
container.bind(TYPES.staffService).to(StaffService);

//staffAuth
container.bind(TYPES.staffAuthService).to(StaffAuthService);
container.bind(TYPES.staffAuthController).to(StaffAuthController);

//table
container.bind(TYPES.tableRepository).to(TableRepository);
container.bind(TYPES.tableController).to(TableController);
container.bind(TYPES.tableService).to(TableService);

//user
container.bind(TYPES.userController).to(UserController);
container.bind(TYPES.userService).to(UserService);
container.bind(TYPES.userRepository).to(UserRepository);

//items
container.bind(TYPES.itemsController).to(ItemController);
container.bind(TYPES.itemsService).to(ItemsService);
container.bind(TYPES.itemsRepository).to(ItemsRepository);

//category
container.bind(TYPES.categoryController).to(CategoryController);
container.bind(TYPES.categoryService).to(CategoryService);
container.bind(TYPES.categoryRepository).to(CategoryRepository);

//subCategory
container.bind(TYPES.SubCategoryController).to(SubCategoryController);
container.bind(TYPES.subCategoryService).to(SubCategoryService);
container.bind(TYPES.subCategoryRepository).to(SubCategoryRepository);

//Ai
container.bind(TYPES.aiController).to(AiController);
container.bind(TYPES.aiService).to(AIService);

//cart
container.bind(TYPES.cartController).to(CartController);
container.bind(TYPES.CartService).to(CartService);
container.bind(TYPES.cartRepository).to(CartRepository);

//order
container.bind(TYPES.orderRepository).to(OrderRepository);
container.bind(TYPES.orderController).to(OrderController);
container.bind(TYPES.orderService).to(OrderService);

//userWallet
container.bind(TYPES.userWalletRepository).to(UserWalletRepository);
container.bind(TYPES.userWalletController).to(UserWalletController);
container.bind(TYPES.userWalletService).to(UserWalletService);

//Items Varients
container.bind(TYPES.VarientController).to(VarientController);
container.bind(TYPES.VarientService).to(VarientService);
container.bind(TYPES.VarientRepository).to(VarientRepository);

//feedback
container.bind(TYPES.FeedbackController).to(FeedbackController);
container.bind(TYPES.FeedbackService).to(FeedbackService);
container.bind(TYPES.FeedbackRepository).to(FeedbackRepository);

//notification
container.bind(TYPES.NotificationController).to(NotificationController);
container.bind(TYPES.NotificationService).to(NotificationService);
container.bind(TYPES.NotificationRepository).to(NotificationRepository);


//refreshHandler
container.bind(TYPES.UserRefreshHandler).to(UserRefreshHandler);
container.bind(TYPES.AdminRefreshHandler).to(AdminRefreshHandler);
container.bind(TYPES.SuperAdminRefreshHandler).to(SuperAdminRefreshHandler);
container.bind(TYPES.StaffRefreshHandler).to(StaffRefreshHandler)
container.bind(TYPES.RefreshTokenFactory).to(RefreshTokenFactory)
export { container };
