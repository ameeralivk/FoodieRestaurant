import ISuperAdminService from "../interface/ISuperAdminService";
import { IAdminAuthRepository } from "../../../Repositories/Admin/interface/IAdminRepositories";
import { IMappedAdminData } from "../../../utils/dto/types/superadmin.types";
import { AppError } from "../../../utils/Error";
import { SuperadminDataMapping } from "../../../utils/dto/SuperAdminDto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { ISubscriptionRepo } from "../../../Repositories/Subscription/Interface/ISubscriptionRepo";

@injectable()
export class SuperAdminService implements ISuperAdminService {
  constructor(
    @inject(TYPES.AdminAuthRepository)
    private _adminAuthRepository: IAdminAuthRepository,
    @inject(TYPES.SubcriptionRepo) private _subcriptionRepo: ISubscriptionRepo
  ) {}

  async getAllRestaurants(
    approval: boolean,
    page: number,
    limit: number,
    filter: string
  ): Promise<{
    success: boolean;
    data: IMappedAdminData[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    };
  }> {
    try {
      const { data, total } = await this._adminAuthRepository.getAllRestaurant(
        approval,
        page,
        limit,
        filter
      );

      const mappedRestaurants = data.map((restaurant) =>
        SuperadminDataMapping(restaurant)
      );
      const subcription = await Promise.all(
        mappedRestaurants.map((x) =>
          this._subcriptionRepo.findActivePlan(x._id.toString())
        )
      );
      const finalData = mappedRestaurants.map((restaurant, index) => ({
        ...restaurant,
        subscription: subcription[index] || null,
      }));
      return {
        success: true,
        data: finalData,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          page,
          limit,
        },
      };
    } catch (error: any) {
      throw new AppError(error.message || "Failed to fetch restaurants");
    }
  }

  async approveRestaurant(id: string) {
    const restaurant = await this._adminAuthRepository.findById(id);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    // Update status to "approved"
    const updated = await this._adminAuthRepository.updateById(id, {
      status: "approved",
    });
    return updated;
  }

  async rejectRestaurant(id: string, reason: string) {
    const restaurant = await this._adminAuthRepository.findById(id);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const updated = await this._adminAuthRepository.updateById(id, {
      status: "rejected",
      rejectionReason: reason,
      rejectedAt: new Date(),
    });
    return updated;
  }

  async changeRestaurantStatus(restaurantId: string, status: string) {
    let isBlocked: boolean;

    if (status === "block") {
      isBlocked = true;
    } else if (status === "unblock") {
      isBlocked = false;
    } else {
      throw new Error("Invalid status value");
    }

    const updatedRestaurant = await this._adminAuthRepository.changeStatus(
      restaurantId,
      isBlocked
    );

    if (!updatedRestaurant) {
      throw new Error("Restaurant not found");
    }

    return updatedRestaurant;
  }
}
