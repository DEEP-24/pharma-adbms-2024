import { Admin, Doctor, Patient, Pharmacist } from '@prisma/client'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { match } from 'ts-pattern'
import { serverEnv } from '~/lib/env.server'
import { UserRole } from '~/enums'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    maxAge: 0,
    name: '__pharma_session',
    path: '/',
    sameSite: 'lax',
    secrets: [serverEnv.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const USER_SESSION_KEY = 'userId'
const USER_ROLE_KEY = 'userRole'
const fourteenDaysInSeconds = 60 * 60 * 24 * 14
const thirtyDaysInSeconds = 60 * 60 * 24 * 30

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

/**
 * Returns the userId from the session.
 */
export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getSession(request)
  const userId = session.get(USER_SESSION_KEY)
  return userId
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const userId = await getUserId(request)
  if (!userId) {
    throw redirect('/login')
  }

  return userId
}

export async function getAdminId(
  request: Request,
): Promise<Admin['id'] | undefined> {
  const session = await getSession(request)
  const adminId = session.get(USER_SESSION_KEY)
  return adminId
}

export async function getPharmacistId(
  request: Request,
): Promise<Pharmacist['id'] | undefined> {
  const session = await getSession(request)
  const pharmacistId = session.get(USER_SESSION_KEY)
  return pharmacistId
}

export async function getDoctorId(
  request: Request,
): Promise<Doctor['id'] | undefined> {
  const session = await getSession(request)
  const doctorId = session.get(USER_SESSION_KEY)
  return doctorId
}

export async function getPatientId(
  request: Request,
): Promise<Patient['id'] | undefined> {
  const session = await getSession(request)
  const patientId = session.get(USER_SESSION_KEY)
  return patientId
}

export async function getUserRole(
  request: Request,
): Promise<UserRole | undefined> {
  const session = await getSession(request)
  const userRole = session.get(USER_ROLE_KEY)
  return userRole
}

// export async function requireUser(
//   request: Request,
//   redirectTo: string = new URL(request.url).pathname,
// ) {
//   const userId = await requireUserId(request, redirectTo)
//   const user = await getUserById(userId)
//   if (user) {
//     return user
//   }

//   throw await logout(request)
// }

export async function createUserSession({
  redirectTo,
  remember = false,
  request,
  role,
  userId,
}: {
  redirectTo: string
  remember?: boolean
  request: Request
  role: UserRole
  userId: string
}) {
  const session = await getSession(request)
  session.set(USER_SESSION_KEY, userId)
  session.set(USER_ROLE_KEY, role)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: remember ? thirtyDaysInSeconds : fourteenDaysInSeconds,
      }),
    },
  })
}

export async function logout(request: Request) {
  const session = await getSession(request)

  // For some reason destroySession isn't removing session keys
  // So, unsetting the keys manually
  session.unset(USER_SESSION_KEY)
  session.unset(USER_ROLE_KEY)

  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}

export async function isAdmin(request: Request) {
  const session = await getSession(request)
  return session.get(USER_ROLE_KEY) === UserRole.ADMIN
}

export async function isPharmacist(request: Request) {
  const session = await getSession(request)
  return session.get(USER_ROLE_KEY) === UserRole.PHARMACIST
}

export async function isDoctor(request: Request) {
  const session = await getSession(request)
  return session.get(USER_ROLE_KEY) === UserRole.DOCTOR
}

export async function isPatient(request: Request) {
  const session = await getSession(request)
  return session.get(USER_ROLE_KEY) === UserRole.PATIENT
}

export async function validateUserRole(
  request: Request,
  role: UserRole | null,
) {
  const existingUserRole = await getUserRole(request)

  if (!existingUserRole) {
    return redirect('/login')
  }

  if (role !== null && existingUserRole === role) {
    return
  }

  return redirectUser(existingUserRole)
}

const redirectUser = (role: UserRole) => {
  return match(role)
    .with(UserRole.ADMIN, () => {
      throw redirect('/admin')
    })
    .with(UserRole.PHARMACIST, () => {
      throw redirect('/pharmacist')
    })
    .with(UserRole.DOCTOR, () => {
      throw redirect('/doctor')
    })
    .with(UserRole.PATIENT, () => {
      throw redirect('/patient')
    })
    .exhaustive()
}
