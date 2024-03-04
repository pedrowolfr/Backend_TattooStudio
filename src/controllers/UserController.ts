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
        role: UserRoles.CUSTOMER,
      });

      await userRepository.save(newUser);
      res.status(StatusCodes.CREATED).json({
        message: "Usuario creado con éxito",
      });
    } catch (error: any) {
      console.error("Error al registrarse:", error);
      res.status(500).json({
        message: "Error al registrarse",
        error: error.message,
      });
    }
  }

  async createArtist(
    req: Request<{}, {}, CreateUserRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    const userRepository = AppDataSource.getRepository(User);
    const {  first_name, last_name, phone, email, password } = req.body;
    try {
      // Crear nuevo usuario
      const dataUser: User = {
        first_name,
        last_name,
        phone,
        email,
       
        password: bcrypt.hashSync(password, 10),
        role: UserRoles.ARTIST,
        created_at: new Date(),
        updated_at: new Date(),
        customerAppointments: [],
      };
      const newUser = await userRepository.save(dataUser);

      const artistRepository = AppDataSource.getRepository(Artist);
      const newArtist = await artistRepository.save({
        user: newUser,
        portfolio: "https://",
      });
      res.status(201).json(newArtist);
    } catch (error: any) {
      console.error("Error al crear artista:", error);
      res.status(500).json({
        message: "Error al crear artista",
        error: error.message,
      });
    }
  }

  async login(
    req: Request<{}, {}, LoginUserRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
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
      const userRole = user.role.role_name;

      const tokenPayload: TokenData = {
        userId: user.id?.toString() as string,
        userRoles: userRole as string,
      };

      const token = jwt.sign(tokenPayload, "123", {
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

  async getProfile(req: Request, res: Response): Promise<void | Response<any>> {
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
      const id = +req.params.id;
      const data = req.body;

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.update({ id: id }, data);

      res.status(202).json({
        message: "Usuario actualizado con éxito",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al actualizar usuario",
      });
    }
  }

  async getAllArtists(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const artistRepository = AppDataSource.getRepository(Artist);

      const allArtists = await artistRepository.find({
        relations: ["user"],
      });

      const artistsWithDetails = allArtists.map((artist) => ({
        id: artist.id,
        name: artist.user.first_name,
      }));

      res.status(200).json(artistsWithDetails);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener artistas",
      });
    }
  }

  async getAllUsers(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const UserRepository = AppDataSource.getRepository(User);

      let { page, skip } = req.query;

      let currentPage = page ? +page : 1;
      let itemsPerPage = skip ? +skip : 10;

      const [allUsers, count] = await UserRepository.findAndCount({
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          phone: true,
          email: true,
        },
      });
      res.status(200).json({
        count,
        skip: itemsPerPage,
        page: currentPage,
        results: allUsers,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al conseguir citas",
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.delete({ id: id });

      res.status(200).json({
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al eliminar usuario",
      });
    }
  }
}
