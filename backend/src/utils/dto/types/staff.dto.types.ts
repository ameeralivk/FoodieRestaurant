export interface StaffResponseDTO {
  _id: string;
  staffName: string;
  email: string;
  role: "staff" | "chef";
  status: boolean;
  isBlocked: boolean;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}