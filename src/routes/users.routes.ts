import express from "express";
import { UserController } from "../controllers/UsersController";
import { auth } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";

// -----------------------------------------------------------------------------

const router = express.Router();
const userController = new UserController();

router.get("/", auth, isAdmin, userController.getAll);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.patch("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;
