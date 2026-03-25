import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IUserWalletRepository } from "../../../Repositories/userWallet/interface/IImplementation";
import { IUserWalletService } from "../interface/IUserWalletService";
import { IUserWallet } from "../../../types/wallet";
import { AppError } from "../../../utils/Error";
import { MESSAGES } from "../../../constants/messages";
import { ICartRepository } from "../../../Repositories/cart/interface/ICartRepository";
import { IOrderService } from "../../orderService/interface/IOrderService";
import { getIO } from "../../../config/socket";
import { IOrderRepo } from "../../../Repositories/order/interface/interface";
import { INotificationService } from "../../notificationService/interface/INotificationService";
import { generateOrderId } from "../../../helpers/generateOrderId";

@injectable()
export class UserWalletService implements IUserWalletService {
  constructor(
    @inject(TYPES.userWalletRepository)
    private _userWalletRepo: IUserWalletRepository,
    @inject(TYPES.cartRepository)
    private _userCartRepo: ICartRepository,
    @inject(TYPES.orderRepository)
    private _orderRepo: IOrderRepo,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.orderService) private _orderService: IOrderService,
  ) {}

  async getWallet(
    userId: string,
  ): Promise<{ success: boolean; data: IUserWallet }> {
    if (!userId) {
      throw new AppError(MESSAGES.USER_NOT_FOUND);
    }
    let wallet = await this._userWalletRepo.getWallet(userId);
    if (!wallet) {
      wallet = await this._userWalletRepo.createWallet(userId);
    }
    return {
      success: true,
      data: wallet,
    };
  }

  // async payWithWallet(
  //   userId: string,
  //   amount: number,
  //   description: string,
  // ): Promise<{ success: boolean; data: IUserWallet | null }> {
  //   if (!userId) throw new AppError("User not found");
  //   if (amount <= 0) throw new AppError("Invalid amount");

  //   // Get wallet
  //   let wallet = await this._userWalletRepo.getWallet(userId);

  //   // If wallet does not exist, throw error
  //   if (!wallet) {
  //     throw new AppError("Wallet not found. Please add funds first.");
  //   }

  //   // Check balance
  //   if (wallet.balance < amount) {
  //     throw new AppError("Insufficient wallet balance");
  //   }

  //   // Debit wallet
  //   const updatedWallet = await this._userWalletRepo.debitWallet(
  //     userId,
  //     amount,
  //     description,
  //     "wallet",
  //   );
  //   const cart = await this._userCartRepo.deleteByUserId(userId);
  //   if (!cart || cart.items.length === 0) {
  //     throw new AppError("Cart is Empty");
  //   }

  //   // 3️⃣ Create order
  //   await this._orderRepo.addOrder(cart, `wallet-${Date.now()}`);

  //   await this._userCartRepo.deleteByUserId(userId);

  //   return { success: true, data: updatedWallet };
  // }

   async payUsingWallet(userId: string, restaurantId: string, amount: number): Promise<{ success: boolean; message: string }> {
      const wallet = await this._userWalletRepo.getWallet(userId);
      if (!wallet || wallet.balance < amount) {
         throw new AppError("Insufficient wallet balance");
      }

      const cart = await this._userCartRepo.findCart(userId, restaurantId);
      if (!cart) {
         throw new AppError(MESSAGES.CART_NOT_FOUND);
      }

      const orderId = generateOrderId();
      const result = await this._userWalletRepo.debitWallet(
         userId,
         amount,
         `Order payment for ${orderId}`,
         "WALLET"
      );

      if (result) {
          let time = cart.items.reduce(
          (acc, val) => acc + (val.preparationTime ?? 0),
          0,
        );
         let estimate = await this._orderService.calculateEstimatedPrepTime(restaurantId,time);
         let res = await this._orderRepo.addOrder(cart, orderId, estimate.estimatedPrepTime, estimate.estimatedReadyAt);
         if (res) {
            await this._userCartRepo.deleteCart(cart._id.toString());
            const io = getIO();
            io.to(`${restaurantId}-chef`).emit("order:new", {
               orderId: res.orderId,
               restaurantId,
               tableId: res.tableId,
               items: res.items,
               total: res.totalAmount,
               status: res.orderStatus,
               createdAt: res.createdAt,
            });
            await this._notificationService.createNotification(
               restaurantId,
               "User",
               `New Order ${res.orderId} Received`
            );
            return { success: true, message: MESSAGES.ORDER_PLACED_SUCCESSFULLY };
         }
      }
      return { success: false, message: "Order placement failed" };
   }
}
 