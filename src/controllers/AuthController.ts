import { Request, Response } from "express";
import {
  CreateUserRequestBody,
  LoginUserRequestBody,
  TokenData,
} from "../types/types";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { UserRoles } from "../constants/UserRoles";
import { AppDataSource } from "../database/data-source";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

// -----------------------------------------------------------------------------

export class AuthController {
  async register(
    req: Request<{}, {}, CreateUserRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    const userRepository = AppDataSource.getRepository(User);
    const { first_name, last_name, phone, email, password } = req.body;
    try {
      // Crear nuevo usuario
      const newUser = userRepository.create({
        first_name,
        last_name,
        phone,
        email,
        password: bcrypt.hashSync(password, 10),
        role: [UserRoles.User],
      });
      await userRepository.save(newUser);

      res.status(StatusCodes.CREATED).json({
        message: "Usuario creado con éxito",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error al crear usuario",
      });
    }
  }

  async login(
    req: Request<{}, {}, LoginUserRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    const userRepository = AppDataSource.getRepository(User);
    const { password, email } = req.body;
    try {
      // Validar existencia de email y contraseña
      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Se requiere correo electrónico o contraseña",
        });
      }

      // Encontrar un usuario por email
      const user = await userRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          role: true,
        },
        select: {
          role: {
            role_name: true,
          },
        },
      });

      // Verificar usuario inexistente
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Correo electrónico o contraseña incorrectos",
        });
      }

      // Verificar contraseña si el usuario existe
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      // Verificar contraseña valida
      if (!isPasswordValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Correo electrónico o contraseña incorrectos",
        });
      }

      // Generar token
      const roles = user.role.map((role) => role.role_name);
      const tokenPayload: TokenData = {
        userId: user.id?.toString() as string,
        userRoles: roles,
      };

      const token = jwt.sign(tokenPayload, "1012", {
        expiresIn: "1h",
      });

      res.status(StatusCodes.OK).json({
        message: "Iniciar sesión exitosamente",
        token,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error al iniciar sesión",
        error,
      });
    }
  }
}
