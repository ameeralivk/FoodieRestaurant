import { inject, injectable } from "inversify";
import { ITableService } from "../../../services/tableService/interface/ITableService";
import { ITableController } from "../interface/ITableController";
import { TYPES } from "../../../DI/types";
import { Response, Request } from "express";
import { AppError } from "../../../utils/Error";
import HttpStatus from "../../../constants/htttpStatusCode";
import { MESSAGES } from "../../../constants/messages";
@injectable()
export class TableController implements ITableController {
  constructor(
    @inject(TYPES.tableService) private _tableService: ITableService,
  ) {}

  addTable = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this._tableService.createTable(req.body);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGES.TABLE_CREATED_SUCCESS,
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  };

  editTable = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { tableId } = req.params;
      const updatedTable = await this._tableService.editTable(
        tableId as string,
        req.body,
      );

      if (!updatedTable) {
        throw new AppError(MESSAGES.TABLE_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.TABLE_UPDATED_SUCCESS,
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllTables = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { restaurantId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;

      const tables = await this._tableService.getAllTables(
        restaurantId as string,
        search,
        page,
        limit,
      );

      return res.status(200).json({
        success: true,
        message: MESSAGES.TABLE_FETCH_SUCCESS,
        data: tables.data,
        total: tables.total,
        page,
        limit,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  updateAvailability = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const { tableId } = req.params;
      const { isAvailable } = req.body;

      const table = await this._tableService.updateTableAvailability(
        tableId as string,
        isAvailable,
      );

      if (!table) {
        throw new AppError(MESSAGES.TABLE_NOT_FOUND, 404);
      }

      return res.status(200).json({
        success: true,
        message: MESSAGES.TABLE_STATUS_UPDATED,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  deleteTable = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { tableId } = req.params;

      const deleted = await this._tableService.deleteTable(tableId as string);

      if (!deleted) {
        throw new AppError("Table not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Table deleted successfully",
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  checkTable = async (req: Request, res: Response): Promise<Response> => {
    const { restaurantId, tableNo } = req.body;

    if (!restaurantId || !tableNo) {
      return res
        .status(400)
        .json({
          success: false,
          message: "restaurantId and tableNo are required",
        });
    }

    try {
      const table = await this._tableService.checkTable(restaurantId, tableNo);

      if (!table) {
        return res
          .status(200)
          .json({ success: false, message: "Table not found" });
      }

      // ✅ table exists
      return res.status(200).json({ success: true, message:"Table Exist" });
    } catch (error: any) {
      throw new AppError(error);
    }
  };
}
