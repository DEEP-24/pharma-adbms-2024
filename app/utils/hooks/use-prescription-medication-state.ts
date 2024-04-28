import * as React from 'react'

import _ from 'lodash'
import { z } from 'zod'

import { type MedicineComboboxItem } from '~/routes/resources+/search-medication'
import { useSafeDispatch } from '~/utils/hooks/use-safe-dispatch'
import { createId } from '~/utils/misc'
import { MedicationUnit } from '~/utils/prisma-enums'

export enum DoseFrequency {
  ALTERNATE_DAYS = 'Alternate Days',
  ALTERNATE_NIGHTS = 'Alternate Nights',
  FIVE_TIMES_A_DAY = 'Five Times a Day',
  FOUR_TIMES_A_DAY = 'Four Times a Day',
  None = 'None',
  ONCE_A_DAY = 'Once a Day',
  ONCE_A_MONTH = 'Once a Month',
  ONCE_A_WEEK = 'Once a Week',
  SIX_TIMES_A_DAY = 'Six Times a Day',
  SOS = 'SOS',
  THRICE_A_DAY = 'Thrice a Day',
  THRICE_A_WEEK = 'Thrice a Week',
  TWICE_A_DAY = 'Twice a Day',
  TWICE_A_WEEK = 'Twice a Week',
}
export enum DoseTiming {
  AFTER_BREAKFAST = 'After Breakfast',
  AFTER_DINNER = 'After Dinner',
  AFTER_FOOD = 'After Food',
  AFTER_LUNCH = 'After Lunch',
  BEFORE_BREAKFAST = 'Before Breakfast',
  BEFORE_DINNER = 'Before Dinner',
  BEFORE_FOOD = 'Before Food',
  BEFORE_LUNCH = 'Before Lunch',
  EMPTY_STOMACH = 'Empty Stomach',
  NONE = 'None',
  WITH_FOOD = 'With Food',
  WITH_TEA = 'With Tea',
}

export enum PrescriptionDurationUnits {
  DAYS = 'day(s)',
  MONTHS = 'month(s)',
  SOS = 's.o.s',
  STAT = 'STAT',
  TO_BE_CONTINUED = 'To be continued',
  WEEKS = 'week(s)',
  YEARS = 'year(s)',
}

export type PrescriptionItem = {
  dosage: number
  durationNumber: number
  durationUnit: PrescriptionDurationUnits
  frequency: DoseFrequency
  frequencyTimings: [number, number, number, number]
  id: string
  medication?: MedicineComboboxItem
  remarks?: string
  timing: DoseTiming
  unit?: MedicationUnit
}

export const prescriptionMedicationSchema = z
  .object({
    dosage: z.coerce.number(),
    durationNumber: z.coerce.number(),
    durationUnit: z.nativeEnum(PrescriptionDurationUnits),
    frequency: z.nativeEnum(DoseFrequency),
    frequencyTimings: z.tuple([
      z.coerce.number(),
      z.coerce.number(),
      z.coerce.number(),
      z.coerce.number(),
    ]),
    id: z.string(),
    medication: z.object({
      dosage: z.string(),
      id: z.string(),
      name: z.string(),
      brand: z.string(),
      unit: z.nativeEnum(MedicationUnit),
    }),
    timing: z.nativeEnum(DoseTiming),
    unit: z.nativeEnum(MedicationUnit),
    remarks: z.string().default(''),
  })
  .strip()

export type PrescriptionMedication = z.infer<
  typeof prescriptionMedicationSchema
>

type State = {
  initialItems?: Array<PrescriptionItem>
  isDirty: boolean
  items: Array<PrescriptionItem>
  name: string
  startDate: string
  expiryDate: string
}

enum ActionTypes {
  ADD_ITEM = 'ADD_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
  RESET = 'RESET',
  UPDATE_ITEM = 'UPDATE_ITEM',
  RESET_TO_INITIAL = 'RESET_TO_INITIAL',
  SET_NAME = 'SET_NAME',
  SET_START_DATE = 'SET_START_DATE',
  SET_EXPIRY_DATE = 'SET_EXPIRY_DATE',
}

type UpdateItemAction<K extends keyof PrescriptionItem> = {
  id: string
  key: K
  type: ActionTypes.UPDATE_ITEM
  value: PrescriptionItem[K]
}

type Action =
  | { id: string; type: ActionTypes.REMOVE_ITEM }
  | { item: PrescriptionItem; type: ActionTypes.ADD_ITEM }
  | { items: PrescriptionItem[]; type: ActionTypes.RESET_TO_INITIAL }
  | { type: ActionTypes.RESET }
  | UpdateItemAction<keyof PrescriptionItem>
  | { type: ActionTypes.SET_NAME; name: string }
  | { type: ActionTypes.SET_START_DATE; startDate: string }
  | { type: ActionTypes.SET_EXPIRY_DATE; expiryDate: string }

const makeItem = (item?: Partial<PrescriptionItem>): PrescriptionItem => ({
  dosage: 0,
  durationNumber: 0,
  durationUnit: PrescriptionDurationUnits.DAYS,
  frequency: DoseFrequency.ONCE_A_DAY,
  frequencyTimings: [0, 0, 0, 0],
  id: createId(),
  timing: DoseTiming.BEFORE_FOOD,
  ...item,
})

const updateMedication = ({
  medication,
  prescriptionItem,
}: {
  medication?: MedicineComboboxItem
  prescriptionItem: PrescriptionItem
}) => {
  console.log({
    medication,
    prescriptionItem,
  })

  return {
    ...prescriptionItem,
    dosage: medication ? Number(medication.dosage) : 0,
    unit: medication?.unit as MedicationUnit | undefined,
  }
}

const checkIsDirty = ({
  items,
  initialState,
}: {
  items: State['items']
  initialState: State['initialItems']
}) => {
  return !_.isEqual(items, initialState)
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.UPDATE_ITEM: {
      const item = state.items.find(item => item.id === action.id)

      if (!item) {
        return state
      }

      let updatedItem = {
        ...item,
        [action.key]: action.value,
      }

      if (action.key === 'medication') {
        updatedItem = updateMedication({
          medication: action.value as MedicineComboboxItem | undefined,
          prescriptionItem: updatedItem,
        })
      }

      const updatedItems = state.items.map(item =>
        item.id === action.id ? updatedItem : item,
      )

      return {
        ...state,
        isDirty: checkIsDirty({
          items: updatedItems,
          initialState: state.initialItems,
        }),
        items: updatedItems,
      }
    }

    case ActionTypes.ADD_ITEM: {
      const newItem = updateMedication({
        medication: action.item.medication,
        prescriptionItem: action.item,
      })

      const updatedItems = [...state.items, newItem]

      return {
        ...state,
        isDirty: checkIsDirty({
          items: updatedItems,
          initialState: state.initialItems,
        }),
        items: updatedItems,
      }
    }

    case ActionTypes.REMOVE_ITEM: {
      const updatedItems = state.items.filter(item => item.id !== action.id)

      if (updatedItems.length === 0) {
        return {
          ...state,
          isDirty: false,
          items: [],
        }
      }

      return {
        ...state,
        isDirty: checkIsDirty({
          items: updatedItems,
          initialState: state.initialItems,
        }),
        items: state.items.filter(item => item.id !== action.id),
      }
    }

    case ActionTypes.RESET_TO_INITIAL: {
      return {
        ...state,
        isDirty: false,
        items: action.items,
      }
    }

    case ActionTypes.RESET:
      return {
        ...state,
        isDirty: checkIsDirty({
          items: [],
          initialState: state.initialItems,
        }),
        items: [],
      }

    case ActionTypes.SET_NAME:
      return {
        ...state,
        name: action.name,
        isDirty: checkIsDirty({
          items: state.items,
          initialState: state.initialItems,
        }),
      }

    case ActionTypes.SET_START_DATE:
      return {
        ...state,
        startDate: action.startDate,
        isDirty: checkIsDirty({
          items: state.items,
          initialState: state.initialItems,
        }),
      }

    case ActionTypes.SET_EXPIRY_DATE:
      return {
        ...state,
        expiryDate: action.expiryDate,
        isDirty: checkIsDirty({
          items: state.items,
          initialState: state.initialItems,
        }),
      }

    default:
      return state
  }
}

export default function usePrescriptionMedicationState(
  initialMedications?: PrescriptionItem[],
) {
  const [state, dispatch] = React.useReducer(reducer, {
    initialItems: initialMedications ?? [],
    isDirty: false,
    items:
      initialMedications && initialMedications.length > 0
        ? initialMedications
        : [],
    name: '',
    startDate: '',
    expiryDate: '',
  })

  const safeDispatch = useSafeDispatch(dispatch)

  const updateItem = React.useCallback(
    <K extends keyof PrescriptionItem>(
      id: string,
      key: K,
      value: PrescriptionItem[K],
    ) => safeDispatch({ id, key, type: ActionTypes.UPDATE_ITEM, value }),
    [safeDispatch],
  )

  const addItem = React.useCallback(
    (item?: PrescriptionItem) =>
      safeDispatch({
        item: item ?? makeItem(),
        type: ActionTypes.ADD_ITEM,
      }),
    [safeDispatch],
  )

  const addFrequentItem = React.useCallback(
    (medication: NonNullable<PrescriptionItem['medication']>) =>
      safeDispatch({
        item: makeItem({
          medication,
        }),
        type: ActionTypes.ADD_ITEM,
      }),
    [safeDispatch],
  )

  const removeItem = React.useCallback(
    (id: PrescriptionItem['id']) =>
      safeDispatch({ id, type: ActionTypes.REMOVE_ITEM }),
    [safeDispatch],
  )

  const clearItems = React.useCallback(
    () => safeDispatch({ type: ActionTypes.RESET }),
    [safeDispatch],
  )

  const resetToInitial = React.useCallback(
    () =>
      safeDispatch({
        type: ActionTypes.RESET_TO_INITIAL,
        items:
          initialMedications && initialMedications.length > 0
            ? initialMedications
            : [],
      }),
    [initialMedications, safeDispatch],
  )

  const setName = React.useCallback(
    (name: string) => safeDispatch({ name, type: ActionTypes.SET_NAME }),
    [safeDispatch],
  )

  const setStartDate = React.useCallback(
    (startDate: string) =>
      safeDispatch({ startDate, type: ActionTypes.SET_START_DATE }),
    [safeDispatch],
  )

  const setExpiryDate = React.useCallback(
    (expiryDate: string) =>
      safeDispatch({ expiryDate, type: ActionTypes.SET_EXPIRY_DATE }),
    [safeDispatch],
  )

  const setState = {
    addFrequentItem,
    addItem,
    removeItem,
    clearItems,
    updateItem,
    resetToInitial,
    setName,
    setStartDate,
    setExpiryDate,
  }

  return [state, setState] as const
}
