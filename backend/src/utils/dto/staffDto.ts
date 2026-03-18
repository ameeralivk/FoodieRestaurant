import { IStaff } from "../../types/staff";
import { StaffResponseDTO } from "./types/staff.dto.types";

export const mapStaffToDTO = (staff: IStaff): StaffResponseDTO => {
  return {
    _id: staff._id.toString(),
    staffName: staff.staffName,
    email: staff.email,
    role: staff.role,
    status: staff.status,
    isBlocked: staff.isBlocked,
    restaurantId: staff.restaurantId.toString(),
    createdAt: staff.createdAt,
    updatedAt: staff.updatedAt,
  };
};
