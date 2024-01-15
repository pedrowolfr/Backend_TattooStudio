import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenData } from "../types/types";

// -----------------------------------------------------------------------------

export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.json({
      message: "Requiere autorización",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    // Decodificar el token
    const decoded = jwt.verify(token, "1012") as JwtPayload;

    // Modificar el objeto Request con los datos del payload
    const decodedPayload: TokenData = {
      userId: decoded.userId,
      userRoles: decoded.userRoles,
    };

    req.tokenData = decodedPayload;

    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "NO AUTORIZADO",
    });
  }
};
