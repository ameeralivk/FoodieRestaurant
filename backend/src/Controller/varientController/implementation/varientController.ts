import { inject, injectable } from "inversify";
import { IVarientController } from "../interface/IVarientController";
import { TYPES } from "../../../DI/types";
import { IVarientService } from "../../../services/varientService/interface/IVarientService";
import { AppError } from "../../../utils/Error";
import { Response, Request } from "express";
import { MESSAGES } from "../../../constants/messages";
import HttpStatus from "../../../constants/htttpStatusCode";

@injectable()
export class VarientController implements IVarientController {
  constructor(
    @inject(TYPES.VarientService) private _VarientService: IVarientService,
  ) {}

  addVarient = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, Varients ,restaurantId} = req.body;
      const result = await this._VarientService.addVarient(name, Varients,restaurantId as string);
      if (result.success) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: MESSAGES.VARIENT_ADDED_SUCCESS });
      } else {
        return res
          .status(HttpStatus.BAD_GATEWAY)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      throw new AppError(error);
    }
  };

  editVarient = async (req: Request, res: Response): Promise<Response> => {
    try {
      const VarientId = req.params.varientId;
      const { name, Varients , restaurantId } = req.body;
      let result = await this._VarientService.editVarient(
        VarientId as string,
        name,
        Varients,
        restaurantId as string
      );
      if (result.success) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: MESSAGES.VARIENT_EDITED_SUCCESS });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, messsage: result.message });
      }
    } catch (error) {
      throw new AppError(error);
    }
  };

  deleteVarient = async (req: Request, res: Response): Promise<Response> => {
    try {
      const VarientId = req.params.varientId;
      let result = await this._VarientService.deleteVarient(
        VarientId as string,
      );
      if (result.success) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: MESSAGES.VARIENT_DEL_SUCCESS });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.VARIENT_DEL_FAILED });
      }
    } catch (error) {
      throw new AppError(error);
    }
  };

  getAllVarient = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search?.toString();
      const restaurantId = req.query.restaurantId?.toString();
       const result = await this._VarientService.getAllVarient(
        page,
        limit,
        search,
        restaurantId
      );
      return res.status(HttpStatus.OK).json({
        ...result
      });
    } catch (error) {
      throw new AppError(error);
    }
  };
}
