import bcrypt from 'bcryptjs'
import type { Admin } from '@prisma/client'
import { db } from '~/lib/db.server'
import { getAdminId, getUserId, logout } from '~/lib/session.server'
import { useOptionalUser } from '~/utils/hooks/use-auth'

export async function verifyAdminLogin({
  email,
  password,
}: {
  email: Admin['email']
  password: string
}) {
  const adminWithPassword = await db.admin.findUnique({
    where: { email },
  })

  if (!adminWithPassword || !adminWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(password, adminWithPassword.password)

  if (!isValid) {
    return null
  }

  const { password: _password, ...adminWithoutPassword } = adminWithPassword

  return adminWithoutPassword
}

export async function getAdminById(id: Admin['id']) {
  return db.admin.findUnique({
    where: { id },
  })
}

export async function getAdmin(request: Request) {
  const adminId = await getAdminId(request)
  if (adminId === undefined) return null

  const admin = await getAdminById(adminId)
  if (admin) return admin

  throw await logout(request)
}

export async function getOptionalAdmin(
  request: Request,
): Promise<Awaited<ReturnType<typeof getAdminById>> | null> {
  const userId = await getUserId(request)
  if (userId === undefined) return null

  const admin = await getAdminById(userId)
  if (admin) return admin

  return null
}
