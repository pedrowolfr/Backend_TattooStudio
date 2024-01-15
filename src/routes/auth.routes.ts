import express from "express";
//import userRoutes from "../routes/users.routes";
//import authRoutes from "../routes/auth.routes";
import { AuthController } from "../controllers/AuthController";

// -------------------------------------------------------------------

const router = express.Router();
const authController = new AuthController();

// routes
//router.use("/api/users", userRoutes);
//router.use("/auth", authRoutes);
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;

