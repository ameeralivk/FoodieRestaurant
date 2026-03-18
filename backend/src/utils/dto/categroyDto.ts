import { ICategory } from "./types/category.dto.types";

export const categoryDTO = (category: ICategory) => ({
  id: category._id,
  name: category.name,
  description: category.description,
  status: category.status,
  createdAt:category.createdAt
});


