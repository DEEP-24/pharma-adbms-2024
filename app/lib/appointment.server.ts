import { Appointment, Patient } from '@prisma/client'
import { z } from 'zod'
import { db } from '~/lib/db.server'
import { createAppointmentSchema } from '~/utils/zod.schema'

export async function createAppointment(
  data: z.infer<typeof createAppointmentSchema>,
) {
  return db.appointment.create({
    data: {
      doctor: {
        connect: {
          id: data.doctorId,
        },
      },
      patient: {
        connect: {
          id: data.patientId,
        },
      },
    },
  })
}

export async function getAppointmentsByPatientId(patientId: Patient['id']) {
  return db.appointment.findMany({
    where: {
      patientId,
    },
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          qualification: true,
          specialization: true,
        },
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })
}

export async function getAppointmentById(patientId: Appointment['id']) {
  return db.appointment.findMany({
    where: {
      patientId,
    },
    select: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          qualification: true,
          specialization: true,
        },
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })
}

export type PatientAppointmentById = Awaited<
  ReturnType<typeof getAppointmentById>
>[number]
