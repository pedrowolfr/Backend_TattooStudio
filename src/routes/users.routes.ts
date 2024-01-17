import express from "express";
import { UserController } from "../controllers/UserController";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { auth } from "..//middleware/auth";

// -----------------------------------------------------------------------------

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", auth, userController.login);
router.get("/:id", auth, userController.getById);
router.patch("/:id", auth, userController.update);
router.get("/artists/list", auth, isSuperAdmin, userController.getAllArtists);
router.post("/artists/create", auth, isSuperAdmin, userController.createArtist);

export default router;
