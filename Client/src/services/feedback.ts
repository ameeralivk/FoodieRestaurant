import { apiRequest } from "../api/apiRequest";

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
  return apiRequest("POST", "/user/feedback", {
    restaurantId,
    orderId,
    itemId,
    rating,
    comment,
  });
};

export const getRating = (restataurantId:string):Promise<GetRatingsResponse>=>{
    return apiRequest("GET",`/user/feedback/items/${restataurantId}`)
}
