import express from "express";
import userRoutes from "./routes/users.routes";
import authRouter from "./routes/appointments.routes";

// --------------------------------------------------------------------

const router = express.Router();

router.use("/api", userRoutes);
router.use("/api/appointments/", authRouter);

export default router;
