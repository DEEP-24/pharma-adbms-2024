import { type z } from 'zod'

import { db } from '~/lib/db.server'
import { UserRole } from '~/enums'
import { createPasswordHash } from '~/utils/misc.server'
import { type createUserSchema, type editUserSchema } from '~/utils/zod.schema'

// export async function getUsers(role: UserRole) {
//   return cachify({
//     getFreshValue: async () => {
//       return db.user.findMany({
//         orderBy: {
//           name: 'asc',
//         },
//         select: {
//           disabled: true,
//           email: true,
//           id: true,
//           name: true,
//           prefix: true,
//           status: true,
//         },
//         where: {
//           role,
//         },
//       })
//     },
//     key: CACHE_KEY.users(role),
//   })
// }

// export async function doesUserExist(email: string) {
//   const user = await db.user.findFirst({
//     where: {
//       email,
//     },
//   })

//   if (user) {
//     return true
//   }

//   return false
// }

export async function createUser(
  data: Omit<z.infer<typeof createUserSchema>, 'confirmPassword'>,
) {
  if (data.role === UserRole.DOCTOR) {
    const createdDoctor = await db.doctor.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: await createPasswordHash(data.password),
        gender: data.gender,
        dob: data.dob,
        phone: data.phone,
        address: data.address,
        age: data.age,
        specialization: data.specialization!,
        qualification: data.qualification!,
      },
    })

    return createdDoctor
  } else if (data.role === UserRole.PATIENT) {
    const createdPatient = await db.patient.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        age: data.age,
        height: data.height!,
        weight: data.weight!,
        password: await createPasswordHash(data.password),
        gender: data.gender,
        dob: data.dob,
        phone: data.phone,
      },
    })

    return createdPatient
  }
}

// export async function editUser(data: z.infer<typeof editUserSchema>) {
//   const updatedUser = await db.user.update({
//     data: {
//       disabled: data.disabled,
//       email: data.email,
//       name: data.name,
//       password: data.password
//         ? await createPasswordHash(data.password)
//         : undefined,
//       prefix: data.prefix,
//       status: data.disabled ? AccountStatus.DISABLED : AccountStatus.ACTIVE,
//     },
//     select: {
//       role: true,
//     },
//     where: {
//       id: data.userId,
//     },
//   })

//   return updatedUser
// }
