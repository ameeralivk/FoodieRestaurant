import type { WalletResponse } from "../types/wallet";
import { apiRequest } from "../api/apiRequest";
import { HTTP_METHOD } from "../constants/httpMethods";
import { API_ROUTES } from "../constants/ApiRoutes";

export const getWallet = async (userId: string): Promise<WalletResponse> => {
  console.log(userId,'id is here')
  return apiRequest(HTTP_METHOD.GET,API_ROUTES.WALLET.GET(userId));
};

export const payWithWallet = async (
  userId: string,
  amount: number,
  description: string
): Promise<WalletResponse> => {
  return apiRequest(HTTP_METHOD.POST,API_ROUTES.WALLET.PAY, {
    userId,
    amount,
    description,
  });
};
