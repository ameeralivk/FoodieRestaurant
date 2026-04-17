import { JwtPayload } from "jsonwebtoken";

export interface IDecoded extends JwtPayload {
  id: string;
  role: string;
}
export interface IRefreshTokenHandler {
    handle(decoded:IDecoded):Promise<string>
}
