import { type z } from 'zod'

import { db } from '~/lib/db.server'
import {
  type createMedicationSchema,
  type editMedicationSchema,
} from '~/utils/zod.schema'

export async function getMedications() {
  return db.medication.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export async function createMedication(
  data: z.infer<typeof createMedicationSchema>,
) {
  const createdMedication = await db.medication.create({
    data,
  })

  return createdMedication
}

export async function editMedication({
  medicationId,
  ...otherFields
}: z.infer<typeof editMedicationSchema>) {
  const updatedMedication = await db.medication.update({
    data: otherFields,
    where: {
      id: medicationId,
    },
  })

  return updatedMedication
}

export async function getLowStockMedications() {
  return db.medication.findMany({
    where: {
      quantity: {
        lt: 10,
      },
    },
    select: {
      id: true,
      name: true,
      brand: true,
      quantity: true,
    },
  })
}

export async function getMedicationCount() {
  return db.medication.count()
}
