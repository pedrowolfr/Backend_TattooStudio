import express from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { auth } from "../middleware/Auth";
import { isAdmin } from "../middleware/isAdmin";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

// --------------------------------------------------

const router = express.Router();
const appointmentController = new AppointmentController();

router.get("/get", auth, isSuperAdmin, appointmentController.getAll)
router.post("/newAppointment", auth, appointmentController.create)
router.get("/mysessions/:id", auth, appointmentController.getById)
router.get("/myappointments/:id",auth, isAdmin, appointmentController.getByArtist)
router.patch("/:id", auth, appointmentController.updateAppointment);
router.delete("/:id", auth, appointmentController.deleteAppointment);

export default router;
