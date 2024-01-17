import express from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { auth } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";

// --------------------------------------------------

const router = express.Router();
const appointmentController = new AppointmentController();

router.get("/get", auth, isAdmin, appointmentController.getAll);
router.post("/newAppointment", auth, appointmentController.create);
router.get("/mysessions/:id", auth, appointmentController.getById);
router.get("/myappointments/:id", auth, isAdmin, appointmentController.getByArtist);
router.patch("/:id", auth, appointmentController.updateAppointment);
router.delete("/:id", auth, isAdmin, appointmentController.deleteAppointment);

export default router;
