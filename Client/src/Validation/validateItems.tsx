import { showErrorToast } from "../Components/Elements/ErrorToast";
import type { IItem } from "../types/Items";

export const validateItem = (data: IItem) => {
  const errors: Record<string, string> = {};
  // Item Name
  if (!data.name || data.name.trim() === "") {
    errors.name = "Item name is required";
  } else if (data.name.trim().length < 3) {
    errors.name = "Item name must be at least 3 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Item name must be at most 100 characters";
  }

  // Price
  if (data.price === undefined || data.price === null) {
    errors.price = "Price is required";
  } else if (Number(data.price) <= 0) {
    errors.price = "Price must be greater than 0";
  }

  // Stock (OPTIONAL)
  if (data.stock !== undefined && data.stock !== null) {
    if (Number(data.stock) < 0) {
      errors.stock = "Stock cannot be negative";
    }
  }

  // Points (OPTIONAL)
  if (data.points !== undefined && data.points !== null) {
    if (Number(data.points) < 0) {
      errors.points = "Points cannot be negative";
    }
  }

  // Category (MANDATORY)
  const categoryId = data.categoryId ? true : false;
  if (!data.categoryName && !categoryId) {
    errors.categoryName = "Please select a main category";
  }
  if (!data.categoryId && categoryId) {
    errors.categoryName = "Please select a main category";
  }

  // SubCategory (OPTIONAL → no validation needed)
  const imageError = validateImages(data.images);
  if (imageError) {
    errors.images = imageError;
  }
  // Images (MAX 3)
  if (data.images && Array.isArray(data.images)) {
    if (data.images.length > 3) {
      errors.images = "You can upload a maximum of 3 images";
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateImages = (images?: File[]) => {
  if (!images) return null;
  if (!images.length) {
    return "Atleast one image is required";
  }
  if (images.length != 3) {
    return "You wand to updload minimum 3 images";
  }
  for (const image of images) {
    if (image.type) {
      if (!image.type.startsWith("image/")) {
        showErrorToast("Only image files are allowed");
      }
      if (image.size > 5 * 1024 * 1024) {
        showErrorToast("Each image must be less than 2MB");
      }
    }
  }

  return null;
};
