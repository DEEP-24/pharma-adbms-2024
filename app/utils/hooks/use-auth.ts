import { useRouteLoaderData, useSubmit } from '@remix-run/react'
import { UserRole } from '~/enums'
import type { RootLoaderData } from '~/root'

export function useOptionalUser() {
  const data = useRouteLoaderData('root') as RootLoaderData

  if (Object.values(data).every(v => v === null)) {
    return null
  }

  if (data.admin) {
    return {
      name: data.admin.name,
      email: data.admin.email,
      role: UserRole.ADMIN,
    }
  } else if (data.pharmacist) {
    return {
      name: data.pharmacist.name,
      email: data.pharmacist.email,
      role: UserRole.PHARMACIST,
    }
  } else if (data.doctor) {
    return {
      name: data.doctor.name,
      email: data.doctor.email,
      role: UserRole.DOCTOR,
    }
  } else if (data.patient) {
    return {
      name: data.patient.name,
      email: data.patient.email,
      role: UserRole.PATIENT,
    }
  }

  return null
}

export function useUser() {
  const user = useOptionalUser()

  if (!user) {
    throw new Error('No user found')
  }

  return {
    ...user,
  }
}

export const useAuth = () => {
  const submit = useSubmit()
  const user = useUser()

  const signOut = () => {
    return submit(null, {
      action: '/logout',
      method: 'POST',
    })
  }

  return { signOut, user }
}
