import { Medication } from '@prisma/client'
import { toast } from 'sonner'
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

export async function getNonPrescribedMedications() {
  return db.medication.findMany({
    where: {
      prescriptionRequired: false,
    },
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
  const updatedMedication = await db.medication
    .update({
      data: otherFields,
      where: {
        id: medicationId,
      },
    })
    .then(() => {
      toast.success('Medication updated successfully!')
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

export async function updateMedicationStock({
  medicationId,
  quantitySold,
}: {
  medicationId: Medication['id']
  quantitySold: number
}) {
  try {
    const medicationExists = await db.medication.findUnique({
      where: {
        id: medicationId,
      },
    })

    if (!medicationExists) {
      console.error(`No medication found with ID: ${medicationId}`)
      throw new Error(`No medication found with ID: ${medicationId}`)
    }

    return await db.medication.update({
      where: {
        id: medicationId,
      },
      data: {
        quantity: {
          decrement: quantitySold,
        },
      },
    })
  } catch (error) {
    console.error('Failed to update medication stock:', error)
    throw error
  }
}
