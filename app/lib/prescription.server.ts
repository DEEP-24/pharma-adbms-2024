import { Appointment, Doctor, Prescription, type Patient } from '@prisma/client'
import { z } from 'zod'

import { db } from '~/lib/db.server'
import { prescriptionMedicationSchema } from '~/utils/hooks/use-prescription-medication-state'

export async function upsertMedicationsInPrescription({
  patientId,
  doctorId,
  medications,
  name,
  startDate,
  expiryDate,
  appointmentId,
}: {
  prescriptionId?: Prescription['id']
  patientId: Patient['id']
  doctorId: Doctor['id']
  name: Prescription['name']
  startDate: Prescription['startDate']
  expiryDate: Prescription['expiryDate']
  appointmentId: Appointment['id']

  medications: z.infer<typeof prescriptionMedicationSchema>[]
}) {
  return db.prescription.create({
    data: {
      name,
      startDate,
      expiryDate,
      doctorId,
      patientId,
      appointmentId,
      medications: {
        createMany: {
          data: medications.map(med => ({
            dosage: med.dosage,
            durationNumber: med.durationNumber,
            durationUnit: med.durationUnit,
            frequency: med.frequency,
            frequencyTimings: med.frequencyTimings,
            remarks: med.remarks,
            medicationId: med.medication.id,
            timing: med.timing,
            unit: med.unit,
            quantity: med.quantity,
          })),
        },
      },
    },
  })
}

export function getAllPrescription() {
  return db.prescription.findMany({
    include: {
      doctor: true,
      patient: true,
      medications: {
        include: {
          medication: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

export const getPrescriptionDetails = ({
  prescriptionId,
  patientId,
}: {
  prescriptionId: Prescription['id']
  patientId: Patient['id']
}) => {
  return db.prescription.findUnique({
    include: {
      medications: {
        select: {
          id: true,
          dosage: true,
          durationUnit: true,
          frequencyTimings: true,
          frequency: true,
          durationNumber: true,
          unit: true,
          timing: true,
          remarks: true,
          medication: {
            select: {
              id: true,
              name: true,
              dosage: true,
              unit: true,
              brand: true,
            },
          },
        },
      },
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    where: {
      id: prescriptionId,
      patientId,
    },
  })
}
