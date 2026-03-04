import type { WalletResponse } from "../types/wallet";
import { apiRequest } from "../api/apiRequest";

export const getWallet = async (userId: string): Promise<WalletResponse> => {
  console.log(userId,'id is here')
  return apiRequest("GET", `/user/wallet?userId=${userId}`);
};

export const payWithWallet = async (
  userId: string,
  amount: number,
  description: string
): Promise<WalletResponse> => {
  return apiRequest("POST", `/user/wallet/pay`, {
    userId,
    amount,
    description,
  });
};
