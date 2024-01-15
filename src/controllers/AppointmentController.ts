import { AppDataSource } from "../database/data-source";
import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";

// -----------------------------------------------------------------------------

export class AppointmentController {
  async getAll(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const appointmentRepository = AppDataSource.getRepository(Appointment);

      let { page, skip } = req.query;
      let currentPage = page ? +page : 1;
      let itemsPerPage = skip ? +skip : 15;

      const [allAppointments, count] = await appointmentRepository.findAndCount(
        {
          skip: (currentPage - 1) * itemsPerPage,
          take: itemsPerPage,
          select: {
            id: true,
            user_id: true,
            artist_id: true,
            date: true,
            time: true,
          },
        }
      );
      res.status(200).json({
        count,
        skip: itemsPerPage,
        page: currentPage,
        results: allAppointments,
      });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener cita" });
    }
  }

  async getById(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const appointmentRepository = AppDataSource.getRepository(Appointment);
      const id = +req.params.id;
      const appointment = await appointmentRepository.findOneBy({
        id: id,
      });

      if (!appointment)
        return res.status(404).json({ error: "Cita no encontrada" });
      res.status(200).json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener cita" });
    }
  }

  async create(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const appointmentRepository = AppDataSource.getRepository(Appointment);
      const data = req.body;
      const newAppointment = await appointmentRepository.save(data);

      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ error: "Error al crear cita" });
    }
  }

  async update(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const appointmentRepository = AppDataSource.getRepository(Appointment);
      const id = +req.params.id;
      const data = req.body;
      const updateAppointment = await appointmentRepository.update(
        { id: id },
        data
      );

      if (!updateAppointment)
        return res.status(404).json({ error: "Cita no encontrada" });
      res.status(200).json(updateAppointment);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar usuario" });
    }
  }

  async delete(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const appointmentRepository = AppDataSource.getRepository(Appointment);
      const id = +req.params.id;
      const deletedAppointment = await appointmentRepository.delete(id);

      if (!deletedAppointment)
        return res.status(404).json({ error: "Cita no encontrada" });
      res.status(200).json(deletedAppointment);
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar cita" });
    }
  }
}
