import { Controller } from "./Controller";
import { Request, Response } from "express";
import { User } from "../models/User";
import { AppDataSource } from "../database/data-source";

export class UserController implements Controller {
  async getUsers(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const userRepository = AppDataSource.getRepository(User);

      let { page, skip } = req.query;
      let currentPage = page ? +page : 1;
      let itemsPerPage = skip ? +skip : 10;

      const users = await userRepository.findAndCount({
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        select: {
          first_name: true,
          last_name: true,
          phone: true,
          id: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  }

  async getById(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const id = +req.params.id;
      const user = await userRepository.findOneBy({
        id: id,
      });

      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  }

  async createUser(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const data = req.body;
      const newUser = await userRepository.save(data);

      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Error al crear usuario" });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void | Response<any>> {
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

  async deleteUser(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const id = +req.params.id;
      const deletedUser = await userRepository.delete(id);

      if (!deletedUser)
        return res.status(404).json({ error: "Usuario no encontrado" });
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar usuario" });
    }
  }
}
