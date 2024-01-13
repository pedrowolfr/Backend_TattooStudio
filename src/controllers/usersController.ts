import { Controller } from "./Controller";
import { Request, Response } from "express";
import { User } from "../models/User";


export class UserController implements Controller {
    async getUsers(req: Request, res: Response): Promise<void | Response<any>> {
        try {
          const users = await User.find();
          res.status(200).json(users);
        } catch (error) {
          res.status(500).json({ error: "Error while getting users" });
        }
      };
      
async getById(req: Request, res: Response): Promise<void | Response<any>> {
  try {
    const user = await User.findOneBy(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error while getting user" });
  }
};

async createUser(req: Request, res: Response): Promise<void | Response<any>> {
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
