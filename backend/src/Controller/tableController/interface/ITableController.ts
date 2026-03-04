import { Request, Response } from "express";
export interface ITableController {
  addTable(req: Request, res: Response): Promise<Response>;
  editTable(req: Request, res: Response): Promise<Response>;
  getAllTables(req: Request, res: Response): Promise<Response>;
  deleteTable(req:Request,res:Response):Promise<Response>
  checkTable(req:Request,res:Response):Promise<Response>
}
