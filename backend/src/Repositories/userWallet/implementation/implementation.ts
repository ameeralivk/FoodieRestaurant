import { IUserWallet } from "../../../types/wallet";
import { BaseRepository } from "../../IBaseRepository";
import { UserWallet } from "../../../models/userWallet";
import { IUserWalletRepository } from "../interface/IImplementation";
import mongoose from "mongoose";

export class UserWalletRepository
  extends BaseRepository<IUserWallet>
  implements IUserWalletRepository
{
  constructor() {
    super(UserWallet);
  }

  async creditWallet(
    userId: string,
    amount: number,
    description: string,
    method: string,
  ): Promise<IUserWallet | null> {
    return this.findOneAndUpdateUpsert(
      { userId },
      {
        $push: {
          transaction: {
            amount,
            description,
            method,
            type: "credit",
            createdAt: new Date(),
          },
        },
        $inc: {
          balance: amount,
        },
      },
    );
  }

  getWallet(userId: String): Promise<IUserWallet | null> {
    return this.getByFilter({ userId: userId });
  }

  async createWallet(userId: string): Promise<IUserWallet> {
    return this.create({
      userId:new mongoose.Types.ObjectId(userId),
      balance: 0,
      transaction: [],
    });
  }

    async debitWallet(
    userId: string,
    amount: number,
    description: string,
    method: string
  ): Promise<IUserWallet | null> {
    return this.model.findOneAndUpdate(
      { userId, balance: { $gte: amount } }, 
      {
        $push: {
          transaction: {
            amount,
            description,
            method,
            type: "debit",
            createdAt: new Date(),
          },
        },
        $inc: { balance: -amount },
      },
      { new: true }
    );
  }

}
