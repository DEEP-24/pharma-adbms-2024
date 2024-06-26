import * as React from 'react'

import { Divider, NumberInput, TextInput } from '@mantine/core'
import { type ActionFunctionArgs } from '@remix-run/node'
import {
  CalendarIcon,
  MoonIcon,
  PlusIcon,
  SaveIcon,
  SunIcon,
  SunriseIcon,
  SunsetIcon,
  Trash2Icon,
} from 'lucide-react'
import { $params, $path } from 'remix-routes'
import { jsonWithError, redirectWithSuccess } from 'remix-toast'
import { toast } from 'sonner'

import { FourOhFour } from '~/components/404'
import { GeneralErrorBoundary } from '~/components/GeneralErrorBoundary'
import { CollapsibleList } from '~/components/collapsible-list'
import { ConfirmationPopover } from '~/components/confirmation-popover'
import { useNavigationBlocker } from '~/components/global-blocker-modal'
import { SubSection } from '~/components/section'
import { SectionFooter } from '~/components/section-footer'
import { ActionIconButton } from '~/components/ui/action-icon-button'
import { CustomButton } from '~/components/ui/custom-button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

import { DatePickerInput } from '@mantine/dates'
import { createOrderWithoutPayment } from '~/lib/order.server'
import { upsertMedicationsInPrescription } from '~/lib/prescription.server'
import { requireUserId } from '~/lib/session.server'
import { MedicineCombobox } from '~/routes/resources+/search-medication'
import { cn, medicationUnitLabelLookup } from '~/utils/helpers'
import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
import usePrescriptionMedicationState, {
  DoseFrequency,
  DoseTiming,
  PrescriptionDurationUnits,
  prescriptionMedicationSchema,
  type PrescriptionItem,
} from '~/utils/hooks/use-prescription-medication-state'
import { MedicationUnit, OrderStatus } from '~/utils/prisma-enums'
import { db } from '~/lib/db.server'

interface ActionData {
  success: boolean
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const doctorId = await requireUserId(request)
  const { patientId, appointmentId } = $params(
    '/doctor/patients/:patientId/:appointmentId/create-prescription',
    params,
  )

  const formData = await request.formData()
  const medicationsString = formData.get('medications') as null | string
  const prescriptionName = formData.get('name')
  const prescriptionStartDate = formData.get('startDate')
  const prescriptionExpiryDate = formData.get('expiryDate')

  if (!medicationsString) {
    return jsonWithError({ success: false }, 'Please provide medications')
  }

  if (!prescriptionName) {
    return jsonWithError({ success: false }, 'Please provide prescription name')
  }

  if (!prescriptionStartDate || !prescriptionExpiryDate) {
    return jsonWithError(
      { success: false },
      'Please provide start and expiry date',
    )
  }

  try {
    const parsedMeds = JSON.parse(medicationsString)

    if (!Array.isArray(parsedMeds)) {
      return jsonWithError({ success: false }, 'Invalid medications')
    }

    const validMeds = parsedMeds
      .map(medication => {
        const result = prescriptionMedicationSchema.safeParse(medication)

        if (!result.success) {
          return null
        }

        return result.data
      })
      .filter(Boolean)

    await upsertMedicationsInPrescription({
      doctorId,
      name: prescriptionName as string,
      startDate: new Date(prescriptionStartDate as string),
      expiryDate: new Date(prescriptionExpiryDate as string),
      medications: validMeds,
      appointmentId,
      patientId,
    })
    const order = await db.order.create({
      data: {
        patient: {
          connect: {
            id: patientId,
          },
        },
        totalAmount: validMeds.reduce(
          (acc, med) => acc + med.medication.price,
          0,
        ),
        status: OrderStatus.IN_PROGRESS,
      },
    })

    await db.medicationOrder.createMany({
      data: validMeds.map(med => ({
        medicationId: med.medication.id,
        quantity: med.quantity,
        brand: med.medication.brand,
        dosage: med.dosage.toString(),
        price: med.medication.price,
        orderId: order.id,
      })),
    })

    return redirectWithSuccess(
      $path('/doctor/patients/:patientId/:appointmentId/prescriptions', {
        patientId,
        appointmentId,
      }),
      'Prescription created successfully!',
    )
  } catch (error) {
    return jsonWithError(
      { success: false },
      'Something went wrong. Please try again!',
    )
  }
}

export default function PatientPrescription() {
  const [
    state,
    {
      addItem,
      removeItem,
      clearItems,
      updateItem,
      resetToInitial,
      setName,
      setExpiryDate,
      setStartDate,
    },
  ] = usePrescriptionMedicationState([])

  const saveFetcher = useFetcherCallback<ActionData>({
    onSuccess: () => resetToInitial(),
  })

  useNavigationBlocker({
    condition: state.isDirty || saveFetcher.isPending,
  })

  const updateTimings = (
    item: PrescriptionItem,
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    let timings = item.frequencyTimings || [0, 0, 0, 0]
    timings = [...timings]

    if (e.type === 'blur') {
      if (!timings[idx]) {
        timings[idx] = 0
      }

      updateItem(item.id, 'frequencyTimings', timings)
    } else if (e.type === 'change') {
      timings[idx] = e.target.valueAsNumber
      updateItem(item.id, 'frequencyTimings', timings)
    }
  }

  return (
    <>
      <SubSection className="flex flex-col gap-4 p-3">
        <div className="m3-2 ml-2 grid grid-cols-12 items-center justify-center gap-2">
          <TextInput
            className="col-span-4"
            placeholder="Enter prescription name"
            label="Prescription Name"
            onChange={e => setName(e.currentTarget.value)}
            value={state.name}
            type="text"
            name="name"
            required
            withAsterisk={false}
          />

          <DatePickerInput
            className="col-span-4"
            clearable
            defaultLevel="decade"
            dropdownType="popover"
            label="Start Date"
            leftSection={<CalendarIcon className="text-gray-400" size={14} />}
            value={state.startDate ? new Date(state.startDate) : undefined}
            onChange={val => {
              console.log('Val', val?.toDateString() ?? '')
              setStartDate(val?.toDateString() ?? '')
              console.log('Start Date', state.startDate)
            }}
            leftSectionPointerEvents="none"
            minDate={new Date()}
            name="startDate"
            placeholder="Choose state date"
            popoverProps={{
              withinPortal: true,
            }}
            required
            valueFormat="MM-DD-YYYY"
            withAsterisk={false}
          />

          <DatePickerInput
            className="col-span-4"
            clearable
            defaultLevel="decade"
            dropdownType="popover"
            label="Expiry Date"
            value={state.expiryDate ? new Date(state.expiryDate) : undefined}
            leftSection={<CalendarIcon className="text-gray-400" size={14} />}
            onChange={val => setExpiryDate(val?.toDateString() ?? '')}
            leftSectionPointerEvents="none"
            minDate={new Date()}
            name="expiryDate"
            placeholder="Choose expiry date"
            popoverProps={{
              withinPortal: true,
            }}
            required
            valueFormat="MM-DD-YYYY"
            withAsterisk={false}
          />
        </div>
        {state.items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {state.items.map((item, index) => {
              const firstitem = index === 0
              const lastItem = index === state.items.length - 1

              return (
                <CollapsibleList
                  className={({ isOpen }) =>
                    cn(
                      'rounded-md ring-2 ring-gray-200',
                      isOpen ? 'bg-white ring-blue-300' : 'bg-gray-50',
                    )
                  }
                  classNames={{
                    trigger: 'text-sm py-2',
                    container: 'px-2',
                  }}
                  defaultExpanded={state.isDirty ? lastItem : firstitem}
                  key={item.id}
                  title={item.medication ? item.medication.name : 'Medication'}
                >
                  <div
                    className="flex flex-col gap-4 rounded border bg-gray-50 px-3 pb-4 pt-4"
                    key={item.id}
                  >
                    {/* Medicine */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1">
                        <Label className="text-xsm font-medium">Medicine</Label>
                        <MedicineCombobox
                          className="w-full min-w-72"
                          inputProps={{
                            emptyState: 'No medicine found.',
                            placeholder: 'Search',
                          }}
                          onChange={value =>
                            updateItem(item.id, 'medication', value)
                          }
                          placeholder="Medication"
                          value={item.medication}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="text-xsm font-medium">
                          Unit Per Dose
                        </Label>
                        <div className="flex items-center bg-white">
                          <Input
                            className="remove-arrow h-7 w-16 min-w-0 rounded-br-none rounded-tr-none border-r-transparent pl-3 pr-1 font-mono tabular-nums focus-visible:ring-transparent"
                            min={0}
                            onChange={event =>
                              updateItem(
                                item.id,
                                'dosage',
                                event.currentTarget.valueAsNumber,
                              )
                            }
                            type="number"
                            value={item.dosage}
                          />

                          <Select
                            onValueChange={value =>
                              updateItem(
                                item.id,
                                'unit',
                                value as MedicationUnit,
                              )
                            }
                            value={item.unit}
                          >
                            <SelectTrigger className="w-full select-none rounded-bl-none rounded-tl-none focus-visible:ring-transparent">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>

                            <SelectContent className="w-full">
                              {Object.values(MedicationUnit).map(unit => (
                                <SelectItem key={unit} value={unit}>
                                  {medicationUnitLabelLookup[unit]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm">
                          <Label className="w-full text-xsm font-medium">
                            Frequency
                          </Label>

                          <div className="flex items-center">
                            <div className="flex w-10 items-center justify-center">
                              <SunriseIcon className="" size={16} />
                            </div>
                            <div className="flex w-10 items-center justify-center">
                              <SunIcon className="" size={16} />
                            </div>
                            <div className="flex w-10 items-center justify-center">
                              <SunsetIcon className="" size={16} />
                            </div>
                            <div className="flex w-10 items-center justify-center">
                              <MoonIcon className="" size={16} />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Select
                            defaultValue={item.frequency}
                            onValueChange={value =>
                              updateItem(
                                item.id,
                                'frequency',
                                value as DoseFrequency,
                              )
                            }
                          >
                            <SelectTrigger className="w-full select-none rounded-br-none rounded-tr-none bg-white focus-visible:ring-transparent">
                              <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(DoseFrequency).map(frequency => (
                                <SelectItem key={frequency} value={frequency}>
                                  {frequency}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {Array.from({ length: 4 }).map((_, index) => (
                            <Input
                              className={cn(
                                'remove-arrow h-7 w-10',
                                'rounded-bl-none rounded-tl-none',
                                'border-l-transparent pl-3 pr-1 font-mono tabular-nums focus-visible:ring-transparent',
                                'white rounded-br-none rounded-tr-none last:rounded-br-md last:rounded-tr-md',
                                'bg-white',
                              )}
                              key={index}
                              min={0}
                              onBlur={e => updateTimings(item, e, index)}
                              onChange={e => updateTimings(item, e, index)}
                              placeholder="-"
                              type="number"
                              value={item.frequencyTimings?.[index]}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quantity,Timing & Duration */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1">
                        <Label className="text-xsm font-medium">Quantity</Label>
                        <NumberInput
                          defaultValue={item.quantity?.toString()}
                          onValueChange={value =>
                            updateItem(item.id, 'quantity', Number(value))
                          }
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-xsm font-medium">Timing</Label>
                        <Select
                          defaultValue={item.timing}
                          onValueChange={value =>
                            updateItem(item.id, 'timing', value as DoseTiming)
                          }
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Timing" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(DoseTiming).map(timing => (
                              <SelectItem key={timing} value={timing}>
                                {timing}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="text-xsm font-medium">Duration</Label>
                        <div className="flex items-center">
                          <Input
                            className="remove-arrow h-7 w-16 min-w-0 rounded-br-none rounded-tr-none border-r-transparent bg-white pl-3 pr-1 font-mono tabular-nums focus-visible:ring-transparent"
                            min={0}
                            disabled
                            placeholder="-"
                            type="number"
                            value={item.durationNumber}
                          />
                          <Select
                            defaultValue={item.durationUnit}
                            disabled
                            // onValueChange={value =>
                            //   updateItem(
                            //     item.id,
                            //     'durationUnit',
                            //     value as PrescriptionDurationUnits,
                            //   )
                            // }
                          >
                            <SelectTrigger className="w-full rounded-bl-none rounded-tl-none bg-white">
                              <SelectValue placeholder="Duration" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(PrescriptionDurationUnits).map(
                                duration => (
                                  <SelectItem key={duration} value={duration}>
                                    {duration}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="text-xsm font-medium">Remarks</Label>
                        <Input
                          className="h-7 bg-white text-sm"
                          onChange={event => {
                            const val = event.currentTarget.value

                            updateItem(item.id, 'remarks', val ?? '')
                          }}
                          placeholder="Remarks"
                          value={item.remarks}
                        />
                      </div>
                    </div>

                    <Divider />

                    <div className="flex items-center justify-end">
                      <ConfirmationPopover
                        onConfirm={() => removeItem(item.id)}
                      >
                        <ActionIconButton color="red" variant="light">
                          <Trash2Icon size={14} />
                        </ActionIconButton>
                      </ConfirmationPopover>
                    </div>
                  </div>
                </CollapsibleList>
              )
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-slate-400 bg-slate-50/75 py-4 text-center">
            <div className="space-y-8">
              <p>No medications added yet!</p>
              <div className="space-x-4">
                <CustomButton
                  className={cn('font-normal')}
                  color="dark"
                  leftSection={<PlusIcon size={14} />}
                  onClick={() => addItem()}
                  size="compact-sm"
                  variant="filled"
                >
                  Add New Medication
                </CustomButton>
              </div>
            </div>
          </div>
        )}
      </SubSection>

      <SectionFooter sticky>
        <div className={cn('flex items-center justify-between gap-4')}>
          <div className="flex items-center gap-4">
            {state.isDirty ? (
              <>
                <ConfirmationPopover onConfirm={() => clearItems()}>
                  <CustomButton
                    className={cn('font-normal')}
                    color="red"
                    disabled={saveFetcher.isPending}
                    size="compact-sm"
                    variant="subtle"
                  >
                    Clear
                  </CustomButton>
                </ConfirmationPopover>

                <CustomButton
                  className={cn('font-normal')}
                  color="red"
                  disabled={saveFetcher.isPending}
                  onClick={() => resetToInitial()}
                  size="compact-sm"
                  variant="light"
                >
                  Reset To Initial
                </CustomButton>
              </>
            ) : null}
          </div>

          <div className="space-x-4">
            <CustomButton
              className="font-normal"
              disabled={saveFetcher.isPending}
              leftSection={<PlusIcon size={14} />}
              onClick={() => addItem()}
              size="compact-sm"
              variant="subtle"
            >
              Add New Row
            </CustomButton>

            <CustomButton
              className="font-normal"
              color="indigo"
              disabled={!state.isDirty}
              leftSection={<SaveIcon size={14} />}
              onClick={() => {
                const hasInvalidItems = state.items.some(item => {
                  if (!item.medication) {
                    toast.error('Please select a medication.')
                    return true
                  }

                  console.log('Item', item)

                  const result = prescriptionMedicationSchema.safeParse(item)
                  if (!result.success) {
                    console.log(result.error)

                    toast.error('Issue with parsing the medications.')
                    return true
                  }

                  return false
                })

                if (hasInvalidItems) {
                  toast.error(
                    'Please fill all the required fields before saving.',
                  )
                  return
                }

                if (!state.name) {
                  toast.error('Please provide prescription name.')
                  return
                }

                if (state.name.length < 3) {
                  toast.error(
                    'Prescription name must be at least 3 characters long.',
                  )
                  return
                }

                if (!state.startDate || !state.expiryDate) {
                  toast.error('Please provide start and expiry date.')
                  return
                }

                saveFetcher.submit(
                  {
                    medications: JSON.stringify(state.items),
                    name: state.name,
                    startDate: state.startDate,
                    expiryDate: state.expiryDate,
                  },
                  {
                    method: 'POST',
                  },
                )
              }}
              size="compact-sm"
              variant="light"
            >
              Save
            </CustomButton>
          </div>
        </div>
      </SectionFooter>
    </>
  )
}

export function ErrorBoundary() {
  return (
    <>
      <GeneralErrorBoundary
        className="flex flex-1 items-center justify-center p-2"
        statusHandlers={{
          403: error => (
            <div>
              <h1>Forbidden</h1>
              <div className="my-4" />
              <pre>
                <code className="whitespace-pre text-xs">
                  {JSON.stringify(error, null, 2)}
                </code>
              </pre>
            </div>
          ),
          404: () => <FourOhFour />,
        }}
      />
    </>
  )
}
