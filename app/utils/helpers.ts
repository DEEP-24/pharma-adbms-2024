import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Gender, MedicationUnit } from '~/utils/prisma-enums'

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
  CAPSULE: 'capsule(s)',
  DROP: 'drop(s)',
  G: 'g',
  IU: 'IU',
  L: 'l',
  MCG: 'mcg',
  MEQ: 'mEq',
  MG: 'mg',
  ML: 'ml',
  MMOL: 'mmol',
  PERCENT: '%',
  PILL: 'pill(s)',
  TABLET: 'tablet(s)',
  UNIT: 'unit(s)',
} satisfies Record<MedicationUnit, string>

/**
 * `Gender` enum label lookup
 */
export const genderLabelLookup = {
  FEMALE: 'Female',
  MALE: 'Male',
  OTHER: 'Other',
} satisfies Record<Gender, string>
