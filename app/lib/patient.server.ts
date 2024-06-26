import type { Patient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { db } from '~/lib/db.server'
import { getPatientId, getUserId, logout } from '~/lib/session.server'

export async function getPatients() {
  return db.patient.findMany({
    orderBy: {
      firstName: 'asc',
    },
  })
}

export async function getPatientPrescriptions({
  patientId,
  doctorId,
}: {
  patientId: Patient['id']
  doctorId: Patient['id']
}) {
  return db.prescription.findMany({
    where: {
      patientId,
      doctorId,
    },
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

export type PatientPrescription = Awaited<
  ReturnType<typeof getPatientPrescriptions>
>[number]

export async function getPatientPrescriptionsById(patientId: Patient['id']) {
  const prescriptions = await db.prescription.findMany({
    where: {
      patientId,
    },
    include: {
      medications: {
        select: {
          id: true,
          dosage: true,
          unit: true,
          durationNumber: true,
          durationUnit: true,
          frequency: true,
          frequencyTimings: true,
          remarks: true,
          timing: true,
          medication: {
            select: {
              id: true,
              name: true,
              brand: true,
              price: true,
              quantity: true,
            },
          },
        },
      },
      doctor: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const updatedPrescriptions = await Promise.all(
    prescriptions.map(async prescription => {
      const order = await db.order.findFirst({
        where: {
          medications: {
            some: {
              medicationId: prescription.medications[0].medication.id,
            },
          },
        },
        include: {
          payment: true,
        },
      })

      if (!order) {
        throw new Error('Order not found')
      }

      return {
        ...prescription,
        order,
      }
    }),
  )

  return updatedPrescriptions
}

export type PatientPrescriptionsById = Awaited<
  ReturnType<typeof getPatientPrescriptionsById>
>[number]

export async function verifyPatientLogin({
  email,
  password,
}: {
  email: Patient['email']
  password: string
}) {
  const patientWithPassword = await db.patient.findUnique({
    where: { email },
  })

  if (!patientWithPassword || !patientWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(password, patientWithPassword.password)

  if (!isValid) {
    return null
  }

  const { password: _password, ...patientWithoutPassword } = patientWithPassword

  return patientWithoutPassword
}

export async function getPatientById(id: Patient['id']) {
  return db.patient.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      height: true,
      weight: true,
      dob: true,
      address: true,
      gender: true,
      age: true,
      prescriptions: true,
      createdAt: true,
      updatedAt: true,
      appointments: {
        select: {
          doctor: true,
          patient: true,
          createdAt: true,
        },
      },
    },
  })
}

export async function getPatientByEmail(email: Patient['email']) {
  return db.patient.findUnique({
    where: { email },
  })
}

export async function getPatient(request: Request) {
  const patientId = await getPatientId(request)
  if (patientId === undefined) return null

  const patient = await getPatientById(patientId)
  if (patient) return patient

  throw await logout(request)
}

export async function getOptionalPatient(
  request: Request,
): Promise<Awaited<ReturnType<typeof getPatientById>> | null> {
  const userId = await getUserId(request)
  if (userId === undefined) return null

  const patient = await getPatientById(userId)
  if (patient) return patient

  return null
}
