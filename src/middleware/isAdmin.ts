import { NextFunction, Request, Response } from "express";

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.token.role_name !== "admin") {
      return res.json({
        success: false,
        message: "No tienes permisos suficientes",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se ha podido realizar la acción",
    });
  }
};
