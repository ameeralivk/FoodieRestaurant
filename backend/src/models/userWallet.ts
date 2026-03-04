import mongoose, { Schema } from "mongoose";
import { IWalletTransaction } from "../types/wallet";
import { IUserWallet } from "../types/wallet";

const TransactionSchema = new Schema<IWalletTransaction>(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const UserWalletSchema = new Schema<IUserWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    transaction: {
      type: [TransactionSchema],
      default: [],
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
export const UserWallet = mongoose.model<IUserWallet>(
  "UserWallet",
  UserWalletSchema
);
