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
               username: true,
               email: true,
               id: true,
            },
         });
          res.status(200).json(users);
        } catch (error) {
          res.status(500).json({ error: "Error al obtener usuarios" });
        }
      };
      
async getById(req: Request, res: Response): Promise<void | Response<any>> {
  try {
    const id = +req.params.id;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      id: id,
         });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

async createUser(req: Request, res: Response): Promise<void | Response<any>> {
  const userRepository = AppDataSource.getRepository(User);
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Error while creating user" });
    }
};

async updateUser(req: Request, res: Response): Promise<void | Response<any>> {
  try {
    const updatedUser = await User.update(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ error: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Error while updating user" });
  }
};

async deleteUser(req: Request, res: Response): Promise<void | Response<any>> {
  try {
    const deletedUser = await User.delete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ error: "User not found" });
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Error while deleting user" });
  }
};
}
