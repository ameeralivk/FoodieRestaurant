import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";

export interface ItemRating {
  itemId: string;
  totalReviews: number;
  avgRating: number;
}

export interface GetRatingsResponse {
  success: boolean;
  data: ItemRating[];
}

export const AddFeedback = (
  restaurantId: string,
  orderId: string,
  itemId: string,
  rating: number,
  comment: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.POST,API_ROUTES.FEEDBACK.ADD, {
    restaurantId,
    orderId,
    itemId,
    rating,
    comment,
  });
};

export const getRating = (restaurantId: string):Promise<GetRatingsResponse>=>{
    return apiRequest(HTTP_METHOD.GET, API_ROUTES.FEEDBACK.GET_ITEM_RATINGS(restaurantId))
}
