import { BaseRepository } from "../../../BaseRepository";
import IUserAuthRepository from "../interface/IUserAuthRepository";
import { UserDocument } from "../../../../models/user";
import User from "../../../../models/user";

export class UserAuthRepository
  extends BaseRepository<UserDocument>
  implements IUserAuthRepository
{
  constructor() {
    super(User);
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; user: UserDocument }> {
    try {
      let res = await this.model.create({
        Name: name ? name : "",
        Email: email,
        password: password,
      });

      return { success: true, user: res };
    } catch (error) {
      let err = error as Error;
      throw new Error(err.message);
    }
  }
  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.model.findOne({ Email: email });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async googleregister(userData: {
    name: String;
    email: String;
    password?: String;
    googleID?: string;
    imageUrl?: string;
  }): Promise<{ user: UserDocument }> {
    try {
      const user = await this.model.create({
        Name: userData.name,
        Email: userData.email,
        password: userData.password ? userData.password : "",
        googleID: userData.googleID,
        imageUrl: userData.imageUrl,
      });

      return { user };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updatePasswordByEmail(
    email: string,
    hashedPassword: string,
  ): Promise<UserDocument | null> {
    return this.updateOne(
      { Email: email.trim().toLowerCase() },
      { password: hashedPassword },
    );
  }
}
