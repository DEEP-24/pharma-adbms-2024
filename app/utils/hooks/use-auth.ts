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
      id: data.admin.id,
      //combine the firstName and lastName to get the name
      name: `${data.admin.firstName} ${data.admin.lastName}`,
      firstName: data.admin.firstName,
      lastName: data.admin.lastName,
      email: data.admin.email,
      role: UserRole.ADMIN,
      dob: data.admin.dob,
      phoneNo: data.admin.phone,
      address: data.admin.address,
      age: data.admin.age,
    }
  } else if (data.pharmacist) {
    return {
      id: data.pharmacist.id,
      name: `${data.pharmacist.firstName} ${data.pharmacist.lastName}`,
      firstName: data.pharmacist.firstName,
      lastName: data.pharmacist.lastName,
      email: data.pharmacist.email,
      role: UserRole.PHARMACIST,
      dob: data.pharmacist.dob,
      phoneNo: data.pharmacist.phone,
      address: data.pharmacist.address,
      age: data.pharmacist.age,
    }
  } else if (data.doctor) {
    return {
      id: data.doctor.id,
      name: `${data.doctor.firstName} ${data.doctor.lastName}`,
      firstName: data.doctor.firstName,
      lastName: data.doctor.lastName,
      email: data.doctor.email,
      role: UserRole.DOCTOR,
      dob: data.doctor.dob,
      phoneNo: data.doctor.phone,
      address: data.doctor.address,
      age: data.doctor.age,
    }
  } else if (data.patient) {
    return {
      id: data.patient.id,
      name: `${data.patient.firstName} ${data.patient.lastName}`,
      firstName: data.patient.firstName,
      lastName: data.patient.lastName,
      email: data.patient.email,
      role: UserRole.PATIENT,
      dob: data.patient.dob,
      phoneNo: data.patient.phone,
      address: data.patient.address,
      age: data.patient.age,
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
