import { Doctor, Prescription, type Patient } from '@prisma/client'
import ObjectID from 'bson-objectid'
import { z } from 'zod'

import { db } from '~/lib/db.server'
import { prescriptionMedicationSchema } from '~/utils/hooks/use-prescription-medication-state'

export async function upsertMedicationsInPrescription({
  prescriptionId,
  patientId,
  doctorId,
  medications,
  name,
  totalAmount,
  startDate,
  expiryDate,
}: {
  prescriptionId?: Prescription['id']
  patientId: Patient['id']
  doctorId: Doctor['id']
  name: Prescription['name']
  totalAmount: Prescription['totalAmount']
  startDate: Prescription['startDate']
  expiryDate: Prescription['expiryDate']

  medications: z.infer<typeof prescriptionMedicationSchema>[]
}) {
  const pId = prescriptionId ?? ObjectID().toString()

  return db.prescription.upsert({
    where: {
      id: pId,
    },
    update: {
      name,
      totalAmount,
      startDate,
      expiryDate,
      medications: {
        deleteMany: {},
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
          })),
        },
      },
    },
    create: {
      name,
      totalAmount,
      startDate,
      expiryDate,
      doctorId,
      patientId,
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
          })),
        },
      },
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
          name: true,
        },
      },
    },
    where: {
      id: prescriptionId,
      patientId,
    },
  })
}
