

import { Model, FilterQuery, UpdateQuery } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async getByFilter(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async getById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async findByIdAndUpdate(
    id: string,
    update: UpdateQuery<T>
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async findOneAndUpdateUpsert(
  filter: FilterQuery<T>,
  update: UpdateQuery<T>
): Promise<T | null> {
  return this.model.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
}

  async getAll(
    filter: any = {},
    options: { page?: number; limit?: number } = {}
  ): Promise<{ data: T[]; total: number }> {

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const dataPromise = this.model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPromise = this.model.countDocuments(filter);

    const [data, total] = await Promise.all([dataPromise, totalPromise]);

    return { data, total };
  }

  async findByIdAndDel(
    id: string,
    statusField?: keyof T,
    statusValue: boolean = false
  ): Promise<T | null> {

    if (statusField) {
      return this.model.findByIdAndUpdate(
        id,
        { [statusField]: statusValue } as UpdateQuery<T>,
        { new: true }
      );
    }

    return this.model.findByIdAndDelete(id);
  }
}
