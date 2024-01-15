import express from "express";
import userRoutes from "./routes/users.routes";
import authRouter from "./routes/auth.routes"

// --------------------------------------------------------------------

const router = express.Router();

router.use("/api/users", userRoutes);
router.use("/auth", authRouter);


export default router;