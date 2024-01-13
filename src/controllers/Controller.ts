import { Request, Response } from "express";

// -----------------------------------------------------------------------------

export interface Controller {
   getUsers(req: Request, res: Response): Promise<void | Response<any>>;
   getById(req: Request, res: Response): Promise<void | Response<any>>;
   createUser(req: Request, res: Response): Promise<void | Response<any>>;
   updateUser(req: Request, res: Response): Promise<void | Response<any>>;
   deleteUser(req: Request, res: Response): Promise<void | Response<any>>;
}