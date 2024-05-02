import type { Pharmacist } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { db } from '~/lib/db.server'
import { getPharmacistId, getUserId, logout } from '~/lib/session.server'

export async function verifyPharmacistLogin({
  email,
  password,
}: {
  email: Pharmacist['email']
  password: string
}) {
  const pharmacistWithPassword = await db.pharmacist.findUnique({
    where: { email },
  })

  if (!pharmacistWithPassword || !pharmacistWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(
    password,
    pharmacistWithPassword.password,
  )

  if (!isValid) {
    return null
  }

  const { password: _password, ...pharmacistWithoutPassword } =
    pharmacistWithPassword

  return pharmacistWithoutPassword
}

export async function getPharmacistById(id: Pharmacist['id']) {
  return db.pharmacist.findUnique({
    where: { id },
  })
}

export async function getPharmacistByEmail(email: Pharmacist['email']) {
  return db.pharmacist.findUnique({
    where: { email },
  })
}

export async function getPharmacist(request: Request) {
  const pharmacistId = await getPharmacistId(request)
  if (pharmacistId === undefined) return null

  const pharmacist = await getPharmacistById(pharmacistId)
  if (pharmacist) return pharmacist

  throw await logout(request)
}

export async function getOptionalPharmacist(
  request: Request,
): Promise<Awaited<ReturnType<typeof getPharmacistById>> | null> {
  const userId = await getUserId(request)
  if (userId === undefined) return null

  const pharmacist = await getPharmacistById(userId)
  if (pharmacist) return pharmacist

  return null
}

export async function getPharmacists() {
  return db.pharmacist.findMany({
    orderBy: {
      firstName: 'asc',
    },
  })
}
