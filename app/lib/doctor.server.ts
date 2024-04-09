import type { Doctor } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { db } from '~/lib/db.server'
import { getDoctorId, getUserId, logout } from '~/lib/session.server'

export async function verifyDoctorLogin({
  email,
  password,
}: {
  email: Doctor['email']
  password: string
}) {
  const doctorWithPassword = await db.doctor.findUnique({
    where: { email },
  })

  if (!doctorWithPassword || !doctorWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(password, doctorWithPassword.password)

  if (!isValid) {
    return null
  }

  const { password: _password, ...doctorWithoutPassword } = doctorWithPassword

  return doctorWithoutPassword
}

export async function getDoctorById(id: Doctor['id']) {
  return db.doctor.findUnique({
    where: { id },
  })
}

export async function getDoctorByEmail(email: Doctor['email']) {
  return db.doctor.findUnique({
    where: { email },
  })
}

export async function getDoctor(request: Request) {
  const doctorId = await getDoctorId(request)
  if (doctorId === undefined) return null

  const doctor = await getDoctorById(doctorId)
  if (doctor) return doctor

  throw await logout(request)
}

export async function getOptionalDoctor(
  request: Request,
): Promise<Awaited<ReturnType<typeof getDoctorById>> | null> {
  const userId = await getUserId(request)
  if (userId === undefined) return null

  const doctor = await getDoctorById(userId)
  if (doctor) return doctor

  return null
}
