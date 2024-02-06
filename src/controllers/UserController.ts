import { Request, Response } from "express";
import {
  CreateUserRequestBody,
  LoginUserRequestBody,
  TokenData,
} from "../types/types";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { UserRoles } from "../constants/UserRoles";
import { Artist } from "../models/Artist";
import { AppDataSource } from "../database/data-source";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

// -----------------------------------------------------------------------------

export class UserController {
  async register(req: Request<{}, {}, CreateUserRequestBody>, res: Response): Promise<void | Response<any>> {
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

  async createArtist(req: Request<{}, {}, CreateUserRequestBody>, res: Response): Promise<void | Response<any>> {
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
        role: [UserRoles.Admin],
      });
      await userRepository.save(newUser);

      if (newUser.role.includes(UserRoles.Admin)) {
        const artistRepository = AppDataSource.getRepository(Artist);
        const newArtist = artistRepository.create({
          user_id: newUser.id,
          portfolio: "https://",
        });
        await artistRepository.save(newArtist);
      }

      res.status(StatusCodes.CREATED).json({
        message: "Usuario creado con éxito",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error al crear usuario",
      });
    }
  }

  async login(req: Request<{}, {}, LoginUserRequestBody>, res: Response): Promise<void | Response<any>> {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = req.body;
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
      const tokenPayload: TokenData = {
        userId: user.id?.toString() as string,
        userRoles: ["user", "admin", "super_admin"],
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

  async getByid(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({
        id: id,
      });

      if (!user) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener usuario",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const id = +req.params.id;
      const data = req.body;
      const updateUser = await userRepository.update({ id: id }, data);

      if (!updateUser)
        return res.status(404).json({ error: "Usuario no encontrado" });
      res.status(200).json(updateUser);
    } catch (error) {
      res.status(400).json({ error: "Error al actualizar usuario" });
    }
  }

  async getAllArtists(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const ArtistRepository = AppDataSource.getRepository(Artist);

      let { page, skip } = req.query;
      let currentPage = page ? +page : 1;
      let itemsPerPage = skip ? +skip : 10;

      const [allArtists, count] = await ArtistRepository.findAndCount({
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        select: {
          id: true,
          user_id: true,
        },
      });
      res.status(200).json({
        count,
        skip: itemsPerPage,
        page: currentPage,
        results: allArtists,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener artistas",
      });
    }
  }
}
