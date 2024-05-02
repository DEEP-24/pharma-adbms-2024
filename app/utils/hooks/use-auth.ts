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
      //combine the firstName and lastName to get the name
      name: `${data.admin.firstName} ${data.admin.lastName}`,
      email: data.admin.email,
      role: UserRole.ADMIN,
    }
  } else if (data.pharmacist) {
    return {
      name: `${data.pharmacist.firstName} ${data.pharmacist.lastName}`,
      email: data.pharmacist.email,
      role: UserRole.PHARMACIST,
    }
  } else if (data.doctor) {
    return {
      name: `${data.doctor.firstName} ${data.doctor.lastName}`,
      email: data.doctor.email,
      role: UserRole.DOCTOR,
    }
  } else if (data.patient) {
    return {
      name: `${data.patient.firstName} ${data.patient.lastName}`,
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
