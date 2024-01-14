import express from "express";
import { UserController } from "../controllers/UsersController";
import { auth } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";

// -----------------------------------------------------------------------------

const router = express.Router();
const userController = new UserController();

router.get("/", auth, isAdmin, userController.getUsers);
router.get("/:id", userController.getById);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;