import { IUserWallet } from "../../../types/wallet";

export interface IUserWalletRepository {
  creditWallet(
    userId: string,
    amount: number,
    description: string,
    method: string,
  ): Promise<IUserWallet | null>;
  getWallet(userId: String): Promise<IUserWallet | null>;
  createWallet(userId: string): Promise<IUserWallet>;
  debitWallet(
    userId: string,
    amount: number,
    description: string,
    method: string,
  ): Promise<IUserWallet | null>;
}
