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
import { Artist } from "../models/Artist";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

// -----------------------------------------------------------------------------



         // Crear un artista
         const newArtist: User = {
            user: newUser,
            name,
            portfolio,
            date_of_birth: new Date(date_of_birth),
         };
         await UserRepository.save(newUser);

         res.status(StatusCodes.CREATED).json({
            message: "User created successfully",
         });
      } catch (error) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error while creating User",
         });
      }
   }