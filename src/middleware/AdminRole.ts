import { NextFunction, Request, Response } from "express";

const isAdmin = (req: any, res: Response, next: NextFunction) => {

    if (req.token.role_name !== ('admin')) {
        return res.json({
            success: false,
            message: "No tienes permisos suficientes",
            });
        }

    next();
}

export { isAdmin }