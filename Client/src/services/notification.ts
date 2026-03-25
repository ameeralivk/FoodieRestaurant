import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
import type { NotificationResponse } from "../types/notification";

export const getAllNotification = (
  recipientId: string,
  waiterId?: string,
  model?: string,
): Promise<NotificationResponse> => {
  return apiRequest(
    HTTP_METHOD.GET,
    API_ROUTES.NOTIFICATION.GET_ALL(recipientId,waiterId, model),
  );
};
export const markAsRead = (
  notificationId?: string,
  isAll?: string,
  WorkerId?:string
): Promise<{ success: boolean; message: string }> => {
  console.log(isAll);
  return apiRequest(
    HTTP_METHOD.PATCH,
    API_ROUTES.NOTIFICATION.MARK_AS_READ(notificationId),
    { isAll,WorkerId },
  );
};
