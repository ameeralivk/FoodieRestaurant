import { IUserWallet } from "../../../types/wallet";

export interface IUserWalletService {
  getWallet(
    userId: string,
  ): Promise<{ success: boolean; data: IUserWallet | [] }>;
  //   payWithWallet(
  //   userId: string,
  //   amount: number,
  //   description: string,
  // ): Promise<{ success: boolean; data: IUserWallet | null }>
  payUsingWallet(userId: string, restaurantId: string, amount: number): Promise<{ success: boolean; message: string }>;
}
