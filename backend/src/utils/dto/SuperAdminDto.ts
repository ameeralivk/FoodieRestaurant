import { AdminDocument } from "../../models/admin";
import { IMappedAdminData } from "./types/superadmin.types";
export const SuperadminDataMapping = (
  restaurant: AdminDocument
): IMappedAdminData => {
  return {
    _id: restaurant.id,
    restaurantName: restaurant.restaurantName,
    ownerName: restaurant.ownerName,
    email: restaurant.email,
    role: restaurant.role,
    status: restaurant.status as "pending" | "approved" | "rejected" | "resubmitted",
    isBlocked: restaurant.isBlocked,
    contactNumber: restaurant.contactNumber,
    placeName: restaurant.placeName,
    location: restaurant.location,
    imageUrl: restaurant.imageUrl,
    restaurantPhoto: restaurant.restaurantPhoto,
    openingTime: restaurant.openingTime,
    closingTime: restaurant.closingTime,
    proofDocument: restaurant.proofDocument,
    rejectedAt:restaurant.rejectedAt?restaurant.rejectedAt:null,
    reason:restaurant.rejectionReason?restaurant.rejectionReason:""
  };
};


