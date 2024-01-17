import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { AppDataSource } from "../database/data-source";
import { CreateAppointmentsRequestBody } from "../types/types";

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
      const appointment = await appointmentRepository.findBy({
        id: id,
      });

      if (!appointment)
        return res.status(404).json({ error: "Cita no encontrada" });
      res.status(200).json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener cita" });
    }
  }

  async getByArtist(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const appointmentRepository = AppDataSource.getRepository(Appointment);
      const appointments = await appointmentRepository.findBy({
        artist_id: id,
      });

      if (!appointments) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({
        message: "Error while getting appointments",
      });
    }
  }

  async create(
    req: Request<{}, {}, CreateAppointmentsRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const appointmentRepository = AppDataSource.getRepository(Appointment);
      const data = req.body;
      const newAppointment = await appointmentRepository.save(data);

      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ error: "Error al crear cita" });
    }
  }

  async updateAppointment(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
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

  async deleteAppointment(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
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
