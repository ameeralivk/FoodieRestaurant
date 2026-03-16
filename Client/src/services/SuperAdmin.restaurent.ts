import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";

export const changeRestaurantStatus = async (
  restaurantId: string,
  status: boolean,
): Promise<{ success: boolean; message: string }> => {
  const action = status ? "block" : "unblock";
  return apiRequest(
    HTTP_METHOD.PATCH,
    API_ROUTES.SUPERADMIN_RESTAURANT.CHANGE_STATUS(restaurantId,action),
  );
};
