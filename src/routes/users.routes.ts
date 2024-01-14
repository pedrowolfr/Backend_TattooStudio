import express from "express";
import { UserController } from "../controllers/UsersController";
import { sampleMiddleware } from "../middlewares/sampleMiddleware";
import { auth } from "../middlewares/auth";
import { isAdmin } from "../middlewares/isAdmin";

// -----------------------------------------------------------------------------

const router = express.Router();
const userController = new UserController();

router.get("/", auth, isAdmin, userController.getUsers);
router.get("/:id", userController.getById);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;