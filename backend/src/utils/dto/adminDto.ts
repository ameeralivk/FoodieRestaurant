import { AdminDocument } from "../../models/admin";
import { AdminDTO, AdminStatusDTO } from "./types/admin.dto.types";

export const adminDTO = (admin: AdminDocument): AdminDTO => {
  return {
    _id: admin.id,
    role: admin.role,
    restaurantName: admin.restaurantName,
    email: admin.email,
    googleId: admin.googleID || null,
    imageUrl: admin.imageUrl || null,
    status: admin.status ?? "",
    rejectedAt: admin.rejectedAt || null,
    rejectionReason: admin.rejectionReason || null,
  };
};

export const mapAdminStatusDTO = (admin: AdminDocument): AdminStatusDTO => {
  const dto: AdminStatusDTO = {
    status: admin.status,
    role: admin.role,
    isBlocked: admin.isBlocked,
    restaurantName: admin.restaurantName,
    email: admin.email,
  };

  if (admin.status === "rejected") {
    dto.rejectionReason = admin.rejectionReason || "";
    dto.rejectedAt = admin.rejectedAt || null;
  }

  return dto;
};
