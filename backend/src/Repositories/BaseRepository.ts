// import { Model, FilterQuery, UpdateQuery } from "mongoose";
// export class BaseRepository<T> {
//   protected model: Model<T>;
//   constructor(model: Model<T>) {
//     this.model = model;
//   }
//   async create(data: Partial<T>): Promise<T> {
//     return await this.model.create(data);
//   }
//   async getByFilter(filter: FilterQuery<T>): Promise<T | null> {
//     return await this.model.findOne(filter);
//   }
//   async getById(id: string): Promise<T | null> {
//     return await this.model.findById(id, { isDeleted: false });
//   }

//   async updateOne(
//     filter: FilterQuery<T>,
//     update: UpdateQuery<T>
//   ): Promise<T | null> {
//     return this.model.findOneAndUpdate(filter, update, { new: true });
//   }
//   async findByIdAndUpdate(
//     id: string,
//     update: UpdateQuery<T>
//   ): Promise<T | null> {
//     return await this.model.findByIdAndUpdate(id, update, { new: true });
//   }

//   async getByEmailWithFields(
//     email: string,
//     fields: (keyof T)[]
//   ): Promise<Partial<T> | null> {
//     const selectedFields = fields.join(" ");
//     const document = await this.model
//       .findOne({ email } as FilterQuery<T>)
//       .select(selectedFields)
//       .lean<T>();
//     return document || null;
//   }
//   async getAll(
//     filter: any = {},
//     options: { page?: number; limit?: number } = {}
//   ): Promise<{ data: T[]; total: number }> {
//     const page = options.page || 1;
//     const limit = options.limit || 10;
//     const skip = (page - 1) * limit;
//     const dataPromise = this.model
//       .find(filter)
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .exec();

//     const totalPromise = this.model.countDocuments(filter).exec();
//     const [data, total] = await Promise.all([dataPromise, totalPromise]);
//     return { data, total };
//   }
//   async findByIdAndDel(
//     id: string,
//     statusField?: keyof T,
//     statusValue: boolean = false
//   ): Promise<T | null> {
//     try {
//       if (statusField) {
//         return await this.model.findByIdAndUpdate(
//           id,
//           { [statusField]: statusValue } as UpdateQuery<T>,
//           { new: true }
//         );
//       }
//       return await this.model.findByIdAndDelete(id);
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   async findByEmail(email: string): Promise<T | null> {
//     try {
//       return await this.model.findOne({ email, status: true });
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }

//   // BaseRepository.ts
// async findOneAndUpdateUpsert(
//   filter: FilterQuery<T>,
//   update: UpdateQuery<T>
// ): Promise<T | null> {
//   return this.model.findOneAndUpdate(filter, update, {
//     new: true,
//     upsert: true,
//     setDefaultsOnInsert: true,
//   });
// }

// }

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
