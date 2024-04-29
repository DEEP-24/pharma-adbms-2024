// This file was generated by a custom prisma generator, do not edit manually.
export const OrderStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const PaymentMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  CASH: "CASH",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const MedicationUnit = {
  CAPSULE: "CAPSULE",
  DROP: "DROP",
  G: "G",
  IU: "IU",
  L: "L",
  MCG: "MCG",
  MEQ: "MEQ",
  MG: "MG",
  ML: "ML",
  MMOL: "MMOL",
  PERCENT: "PERCENT",
  PILL: "PILL",
  TABLET: "TABLET",
  UNIT: "UNIT",
} as const;

export type MedicationUnit = (typeof MedicationUnit)[keyof typeof MedicationUnit];
