// Single notification type
export interface Notification {
  _id: string;
  recipientId: string;
  recipientModel: "User" | "staff";
  message: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
  __v: number;
}

// API response type
export interface NotificationResponse {
  success: boolean;
  data: Notification[];
}