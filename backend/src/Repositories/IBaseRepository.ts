import { FilterQuery, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;

  getByFilter(filter: FilterQuery<T>): Promise<T | null>;

  getById(id: string): Promise<T | null>;

  updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<T | null>;

  findOneAndUpdateUpsert(
  filter: FilterQuery<T>,
  update: UpdateQuery<T>
): Promise<T | null>;

  findByIdAndUpdate(
    id: string,
    update: UpdateQuery<T>
  ): Promise<T | null>;

  getAll(
    filter: any,
    options?: { page?: number; limit?: number }
  ): Promise<{ data: T[]; total: number }>;

  findByIdAndDel(
    id: string,
    statusField?: keyof T,
    statusValue?: boolean
  ): Promise<T | null>;
}