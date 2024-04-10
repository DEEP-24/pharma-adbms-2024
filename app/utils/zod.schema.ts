import { Gender } from '@prisma/client'
import { min } from 'lodash'
import { z } from 'zod'
import { UserRole } from '~/enums'

const nameSchema = z.string().trim().min(3, 'Name is required')
const email = z.string().trim().email('Invalid email')
const password = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters')

export const loginSchema = z.object({
  email,
  password,
  role: z.nativeEnum(UserRole),
  redirectTo: z.string().trim().default('/'),
  remember: z.enum(['on']).optional(),
})

export const ManageProductSchema = z.object({
  description: z.string().trim().min(1, 'Description is required'),
  image: z.string().trim().url('Invalid URL'),
  name: nameSchema,
  price: z.preprocess(
    Number,
    z.number().min(0, 'Price must be greater than 0'),
  ),
  productId: z.string().trim().optional(),
})

const baseUserSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  name: nameSchema,
  password: z.string().trim().min(8, 'Password must be at least 8 characters'),
  gender: z.nativeEnum(Gender),
  dob: z.string().trim().min(10, 'Date of birth is required'),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone number should be at least 10 characters'),
  role: z.nativeEnum(UserRole).optional(),
})

export const createUserSchema = baseUserSchema
  .extend({
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword', 'password'],
      })
    }
    return true
  })

export const createPatientSchema = z
  .object({
    dob: z.string().trim().min(10, 'Date of birth is required'),
    email: z.string().trim().email('Invalid email address').optional(),
    gender: z.nativeEnum(Gender, {
      errorMap: () => ({
        message: 'Gender is required',
      }),
    }),
    name: z.string().trim().min(3, 'Name is required'),
    phone: z.string().trim().min(10, 'Phone number is required'),
  })
  .extend({
    patientId: z.string().trim().optional(),
  })

export const editUserSchema = baseUserSchema.extend({
  password: z.union([
    z.string().trim().min(8, 'Password must be at least 8 characters'),
    z.literal(''),
  ]),
  userId: z.string().trim(),
})

export const editPatientSchema = z.object({
  dob: z.coerce
    .date({
      errorMap: () => ({
        message: 'Date of birth is required',
      }),
    })
    .max(new Date(), 'Date of birth cannot be in the past'),
  email: z.string().trim().email('Invalid email address').optional(),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({
      message: 'Gender is required',
    }),
  }),
  name: z.string().trim().min(3, 'Name is required'),
  patientId: z.string().trim(),
  phone: z.string().trim().min(10, 'Phone number is required'),
})

export const createMedicationSchema = z.object({
  brand: z.string().trim().min(3, 'Brand is required'),
  dosage: z.string().trim().min(3, 'Dosage is required'),
  name: z.string().trim().min(3, 'Name is required'),
  quantity: z.preprocess(Number, z.number().min(0, 'Quantity is required')),
  price: z.preprocess(Number, z.number().min(0, 'Price is required')),
  unit: z.string().trim().min(1, 'Unit is required'),
  prescriptionRequired: z
    .enum(['on', 'off'])
    .optional()
    .transform(val => val === 'on'),
})

export const editMedicationSchema = createMedicationSchema.extend({
  medicationId: z.string().trim().min(1, 'Medication ID is required'),
})
