import { Types } from "mongoose";
export type VariantOption = {
  option: string;
  price: number;
};
export type VariantPricing = {
  category: string;
  values: VariantOption[];
};

export interface IItemInterface {
  _id?: Types.ObjectId;
  isActive: boolean;
  existingImages?: string;
  name: string;
  price: number;
  restaurantId: Types.ObjectId;
  categoryId: Types.ObjectId;
  stock?: number | null;
  description?: string;
  isDeleted: boolean;
  preparationTime?: number;
  images: string[];
  subCategoryId?: Types.ObjectId;
  category: Types.ObjectId;
  isStock: boolean;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  maxQuantityPerOrder?: number;
  variant?: VariantPricing;
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}
