// import * as React from 'react'

// import { Loader, MultiSelect, Select, TextInput } from '@mantine/core'
// import { DatePickerInput } from '@mantine/dates'
// import { UserRole } from '@prisma/client'
// import { type ActionFunctionArgs, json } from '@remix-run/node'
// import { CONDITIONS } from '~/data/conditions'
// import { CalendarIcon } from 'lucide-react'
// import { redirectWithSuccess } from 'remix-toast'

// import { type BaseModalProps } from '~/components/global-modals'
// import { CustomButton } from '~/components/ui/custom-button'
// import { CustomModal } from '~/components/ui/custom-modal'
// import { getAvailableLabs } from '~/lib/lab.server'
// import { createPatient } from '~/lib/patient.server'
// import { getUsers } from '~/lib/user.server'
// import { useCallbackOnRouteChange } from '~/utils/hooks/use-callback-on-route-change'
// import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
// import { badRequest } from '~/utils/misc.server'
// import EasyModal from '~/utils/modal-manager'
// import { Gender, PurposeOfVisit } from '~/utils/prisma-enums'
// import type { inferErrors } from '~/utils/validation'
// import { validateAction } from '~/utils/validation'
// import { createPatientSchema } from '~/utils/zod.schema'

// const CREATE_PATIENT_ROUTE = '/resources/create-patient'
// const CREATE_PATIENT_FORM_ID = 'create-patient-form'

// export interface ActionData {
//   fieldErrors?: inferErrors<typeof createPatientSchema>
//   success: boolean
// }

// export const loader = async () => {
//   const [_doctors, labs] = await Promise.all([
//     getUsers(UserRole.DOCTOR),
//     getAvailableLabs(),
//   ])

//   const doctors = _doctors.map(doctor => ({
//     id: doctor.id,
//     name: doctor.name,
//   }))

//   return json({
//     doctors,
//     labs,
//   })
// }

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const { fieldErrors, fields } = await validateAction(
//     request,
//     createPatientSchema,
//   )

//   if (fieldErrors) {
//     return badRequest({ fieldErrors, success: false })
//   }

//   const createdPatient = await createPatient(fields)

//   return redirectWithSuccess(
//     `/admin/patients/${createdPatient.id}/appointments`,
//     'Patient registered successfully!',
//   )
// }

// interface ICreatePatientModal extends BaseModalProps {}

// export const CreatePatientModal = EasyModal.create(
//   (props: ICreatePatientModal) => {
//     const { afterClose, afterOpen, onClose, ...modalProps } = props

//     const fetcher = useFetcherCallback<ActionData>()

//     const [purposeOfVisit, setPurposeOfVisit] =
//       React.useState<PurposeOfVisit | null>(null)

//     const doctorsFetcher = useFetcherCallback<typeof loader>()
//     const doctors = doctorsFetcher.data?.doctors || []
//     const isFetchingDoctors = doctorsFetcher.isPending || !doctorsFetcher.data

//     const onModalClose = () => {
//       onClose?.()
//       setPurposeOfVisit(null)
//       modalProps.hide()
//     }

//     React.useEffect(() => {
//       doctorsFetcher.load(CREATE_PATIENT_ROUTE)
//       // We don't want to re-fetch doctors on every render
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     useCallbackOnRouteChange(() => onModalClose())

//     return (
//       <>
//         <CustomModal
//           afterClose={() => afterClose?.()}
//           afterOpen={() => afterOpen?.()}
//           closeOnClickOutside={false}
//           footerSection={({ close }) => (
//             <div className="flex items-center justify-end gap-4">
//               <CustomButton
//                 disabled={fetcher.isPending}
//                 onClick={() => close()}
//                 variant="subtle"
//               >
//                 Cancel
//               </CustomButton>

//               <CustomButton
//                 disabled={isFetchingDoctors}
//                 form={CREATE_PATIENT_FORM_ID}
//                 loading={fetcher.isPending}
//                 type="submit"
//               >
//                 Create
//               </CustomButton>
//             </div>
//           )}
//           onClose={() => onModalClose()}
//           open={modalProps.visible}
//           title="Register Patient"
//         >
//           <fetcher.Form
//             action={CREATE_PATIENT_ROUTE}
//             className="mx-auto flex max-w-lg flex-col gap-4"
//             id={CREATE_PATIENT_FORM_ID}
//             method="POST"
//           >
//             <TextInput
//               data-autofocus
//               error={fetcher.data?.fieldErrors?.name}
//               label="Name"
//               name="name"
//               placeholder="Enter name"
//               required
//             />

//             <div className="grid grid-cols-6 gap-4">
//               <Select
//                 className="col-span-2"
//                 data={Object.values(Gender).map(gender => ({
//                   label: gender,
//                   value: gender,
//                 }))}
//                 error={fetcher.data?.fieldErrors?.gender}
//                 label="Gender"
//                 name="gender"
//                 placeholder="Select a gender"
//                 required
//                 searchable
//               />

//               <TextInput
//                 className="col-span-4"
//                 error={fetcher.data?.fieldErrors?.phone}
//                 label="Phone"
//                 name="phone"
//                 pattern="[0-9]{10}"
//                 placeholder="Enter phone"
//                 required
//                 title="Phone number should be 10 digits long and should not contain any special characters."
//               />
//             </div>

//             <DatePickerInput
//               clearable
//               defaultLevel="decade"
//               dropdownType="popover"
//               error={fetcher.data?.fieldErrors?.dob}
//               label="Date of birth"
//               leftSection={<CalendarIcon className="text-gray-400" size={14} />}
//               leftSectionPointerEvents="none"
//               maxDate={new Date()}
//               name="dob"
//               placeholder="Choose date of birth"
//               popoverProps={{
//                 withinPortal: true,
//               }}
//               required
//               valueFormat="DD-MMM-YYYY"
//             />

//             <Select
//               comboboxProps={{ withinPortal: true }}
//               data={Object.values(PurposeOfVisit).map(purpose => ({
//                 label: purpose,
//                 value: purpose,
//               }))}
//               error={fetcher.data?.fieldErrors?.purpose}
//               label="Purpose"
//               name="purpose"
//               onChange={val => setPurposeOfVisit(val as PurposeOfVisit | null)}
//               placeholder="Select purpose of visit"
//               required
//               value={purposeOfVisit}
//             />

//             {purposeOfVisit === PurposeOfVisit.CONSULTATION ? (
//               <>
//                 <MultiSelect
//                   comboboxProps={{ withinPortal: true }}
//                   data={Object.entries(CONDITIONS).map(([key, value]) => ({
//                     label: value,
//                     value: key,
//                   }))}
//                   error={fetcher.data?.fieldErrors?.conditions}
//                   label="Conditions"
//                   name="conditions"
//                   placeholder="Select conditions"
//                   searchable
//                 />

//                 <Select
//                   clearable
//                   comboboxProps={{ withinPortal: true }}
//                   data={doctors.map(doctor => ({
//                     label: doctor.name,
//                     value: doctor.id,
//                   }))}
//                   disabled={isFetchingDoctors}
//                   label="Primary Doctor"
//                   name="doctorId"
//                   placeholder="Select doctor"
//                   rightSection={
//                     isFetchingDoctors ? <Loader size={16} /> : undefined
//                   }
//                   searchable
//                 />
//               </>
//             ) : null}

//             {purposeOfVisit === PurposeOfVisit.LAB ? (
//               <MultiSelect
//                 comboboxProps={{ withinPortal: true }}
//                 data={Object.entries(CONDITIONS).map(([key, value]) => ({
//                   label: value,
//                   value: key,
//                 }))}
//                 error={fetcher.data?.fieldErrors?.conditions}
//                 label="Labs"
//                 name="labs"
//                 placeholder="Select labs"
//                 required
//                 searchable
//               />
//             ) : null}
//           </fetcher.Form>
//         </CustomModal>
//       </>
//     )
//   },
// )
