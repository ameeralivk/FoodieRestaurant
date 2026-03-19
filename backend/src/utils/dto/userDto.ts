
import { IUser } from "../../types/usert";
import { IMappedUserData } from "./types/user.dto.types";
import { IUserResponseDto } from "./types/user.dto.types";

export const mapUserToDto = (user: IUser): IUserResponseDto => {
  return {
    success: true,
    user: {
      id: user._id.toString(),
      name: user.Name,
      email: user.Email,
      phone: user.phone, 
      allergies: user.Allergies,
      dietaryRestriction: user.DietaryRestriction,
      imageUrl: user.imageUrl,
      isBlocked: user.isBlocked
    }
  };
};

export const mapUserDto = (user: IUser): IMappedUserData => {
  return {
      id: user._id.toString(),
      name: user.Name,
      email: user.Email,
      phone: user.phone,
      allergies: user.Allergies,
      dietaryRestriction: user.DietaryRestriction,
      imageUrl: user.imageUrl,
      isBlocked: user.isBlocked,
      createdAt:user.createdAt
    }
};