import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IUserWalletRepository } from "../../../Repositories/userWallet/interface/IImplementation";
import { IUserWalletService } from "../interface/IUserWalletService";
import { IUserWallet } from "../../../types/wallet";
import { AppError } from "../../../utils/Error";
import { MESSAGES } from "../../../constants/messages";
import { ICartRepository } from "../../../Repositories/cart/interface/ICartRepository";
import { IOrderService } from "../../orderService/interface/IOrderService";
import { IOrderRepo } from "../../../Repositories/order/interface/interface";

@injectable()
export class UserWalletService implements IUserWalletService {
  constructor(
    @inject(TYPES.userWalletRepository)
    private _userWalletRepo: IUserWalletRepository,
    @inject(TYPES.cartRepository)
    private _userCartRepo: ICartRepository,
    @inject(TYPES.orderRepository)
    private _orderService:IOrderRepo
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

  async payWithWallet(
    userId: string,
    amount: number,
    description: string,
  ): Promise<{ success: boolean; data: IUserWallet | null }> {
    if (!userId) throw new AppError("User not found");
    if (amount <= 0) throw new AppError("Invalid amount");

    // Get wallet
    let wallet = await this._userWalletRepo.getWallet(userId);

    // If wallet does not exist, throw error
    if (!wallet) {
      throw new AppError("Wallet not found. Please add funds first.");
    }

    // Check balance
    if (wallet.balance < amount) {
      throw new AppError("Insufficient wallet balance");
    }

    // Debit wallet
    const updatedWallet = await this._userWalletRepo.debitWallet(
      userId,
      amount,
      description,
      "wallet",
    );
    const cart = await this._userCartRepo.deleteByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is Empty")
    }

    // 3️⃣ Create order
    await this._orderService.addOrder(cart, `wallet-${Date.now()}`);

    await this._userCartRepo.deleteByUserId(userId);

    return { success: true, data: updatedWallet };
  }
}
