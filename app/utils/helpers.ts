import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  Gender,
  MedicationType,
  MedicationUnit,
  OrderStatus,
} from '~/utils/prisma-enums'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type LiteralUnion<T extends U, U = string> = T | (U & {})

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type PropsFrom<TComponent> =
  TComponent extends React.FC<infer Props>
    ? Props
    : TComponent extends React.Component<infer Props>
      ? Props
      : never

export type DateToString<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K]
} & {}

/**
 * `DashboardView` enum label lookup
 */
export const DashboardView = {
  expanded: 'expanded',
  standard: 'standard',
} as const

export type DashboardView = (typeof DashboardView)[keyof typeof DashboardView]

/**
 * `MedicationUnit` enum label lookup
 */
export const medicationUnitLabelLookup = {
  MG: 'mg',
  ML: 'ml',
} satisfies Record<MedicationUnit, string>

/**
 * `MedicationType` enum label lookup
 */
export const medicationTypeLabelLookup = {
  TABLET: 'Tablet',
  CAPSULE: 'Capsule',
  SYRUP: 'Syrup',
} satisfies Record<MedicationType, string>

/**
 * `Gender` enum label lookup
 */
export const genderLabelLookup = {
  FEMALE: 'Female',
  MALE: 'Male',
  OTHER: 'Other',
} satisfies Record<Gender, string>

export function statusLabelLookup(status: OrderStatus) {
  return {
    [OrderStatus.IN_PROGRESS]: 'In Progress',
    [OrderStatus.COMPLETED]: 'Completed',
    [OrderStatus.OUT_OF_STOCK]: 'Out of Stock',
  }[status]
}

export const doctorSpecializationLabelLookup = {
  CARDIOLOGIST: 'Cardiologist',
  DERMATOLOGIST: 'Dermatologist',
  GYNECOLOGIST: 'Gynecologist',
  NEUROLOGIST: 'Neurologist',
  ORTHOPEDIC: 'Orthopedic',
  PEDIATRICIAN: 'Pediatrician',
  PSYCHIATRIST: 'Psychiatrist',
  UROLOGIST: 'Urologist',
}

export const doctorQualificationLabelLookup = {
  MD: 'MD',
  MDDM: 'MDDM',
  DSO: 'DSO',
  GENERAL_SURGEON: 'General Surgeon',
  GENERAL_MEDICINE: 'General Medicine',
}
