// import * as React from 'react'

// import { Loader, MultiSelect, Select } from '@mantine/core'
// import { type Patient, UserRole } from '@prisma/client'
// import { type ActionFunctionArgs, json } from '@remix-run/node'
// import { CONDITIONS } from '~/data/conditions'
// import { $path } from 'remix-routes'
// import { redirectWithSuccess } from 'remix-toast'

// import { type BaseModalProps } from '~/components/global-modals'
// import { CustomButton } from '~/components/ui/custom-button'
// import { CustomModal } from '~/components/ui/custom-modal'
// import { createAppointment } from '~/lib/appointment.server'
// import { getAvailableLabs } from '~/lib/lab.server'
// import { getUsers } from '~/lib/user.server'
// import { useCallbackOnRouteChange } from '~/utils/hooks/use-callback-on-route-change'
// import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
// import { badRequest } from '~/utils/misc.server'
// import EasyModal from '~/utils/modal-manager'
// import { PurposeOfVisit } from '~/utils/prisma-enums'
// import type { inferErrors } from '~/utils/validation'
// import { validateAction } from '~/utils/validation'
// import { createAppointmentSchema } from '~/utils/zod.schema'

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

// interface ActionData {
//   fieldErrors?: inferErrors<typeof createAppointmentSchema>
//   success: boolean
// }

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const { fieldErrors, fields } = await validateAction(
//     request,
//     createAppointmentSchema,
//   )

//   if (fieldErrors) {
//     return badRequest({ fieldErrors, success: false })
//   }

//   const createdAppointment = await createAppointment(fields)

//   return redirectWithSuccess(
//     $path('/admin/patients/:patientId/:appointmentId/overview', {
//       appointmentId: createdAppointment.id,
//       patientId: fields.patientId,
//     }),
//     'Appointment created successfully!',
//   )
// }

// interface ICreateAppointmentModal extends BaseModalProps {
//   patientId: Patient['id']
// }

// const CREATE_APPOINTMENT_ROUTE = '/resources/create-appointment'
// const CREATE_APPOINTMENT_FORM_ID = 'create-appointment-form'

// export const CreateAppointmentModal = EasyModal.create(
//   (props: ICreateAppointmentModal) => {
//     const {
//       afterClose,
//       afterOpen,
//       onClose,
//       patientId,

//       ...modalProps
//     } = props

//     const [purposeOfVisit, setPurposeOfVisit] =
//       React.useState<PurposeOfVisit | null>(null)

//     const onModalClose = async () => {
//       onClose?.()
//       setPurposeOfVisit(null)
//       modalProps.hide()
//     }

//     const fetcher = useFetcherCallback<ActionData>()

//     const loaderFetcher = useFetcherCallback<typeof loader>()
//     const doctors = loaderFetcher.data?.doctors || []
//     const labs = loaderFetcher.data?.labs || []
//     const isFetchingLoader = loaderFetcher.isPending || !loaderFetcher.data

//     React.useEffect(() => {
//       loaderFetcher.load(CREATE_APPOINTMENT_ROUTE)
//       // We don't want to re-fetch doctors on every render
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     useCallbackOnRouteChange(() => onModalClose())

//     return (
//       <CustomModal
//         afterClose={() => afterClose?.()}
//         afterOpen={() => afterOpen?.()}
//         footerSection={
//           <div className="flex items-center justify-end gap-4">
//             <CustomButton
//               disabled={fetcher.isPending}
//               onClick={() => onModalClose()}
//               variant="subtle"
//             >
//               Cancel
//             </CustomButton>

//             <CustomButton
//               disabled={isFetchingLoader}
//               form={CREATE_APPOINTMENT_FORM_ID}
//               loading={fetcher.isPending}
//               type="submit"
//             >
//               Create
//             </CustomButton>
//           </div>
//         }
//         onClose={() => onModalClose()}
//         open={modalProps.visible}
//         title="Create Appointment"
//       >
//         <fetcher.Form
//           action={CREATE_APPOINTMENT_ROUTE}
//           className="flex flex-col gap-4"
//           id={CREATE_APPOINTMENT_FORM_ID}
//           method="POST"
//         >
//           <input defaultValue={patientId} hidden name="patientId" />

//           <Select
//             comboboxProps={{ withinPortal: true }}
//             data={Object.values(PurposeOfVisit).map(purpose => ({
//               label: purpose,
//               value: purpose,
//             }))}
//             data-autofocus
//             error={fetcher.data?.fieldErrors?.purpose}
//             label="Purpose"
//             name="purpose"
//             onChange={val => setPurposeOfVisit(val as PurposeOfVisit | null)}
//             placeholder="Select purpose of visit"
//             required
//             value={purposeOfVisit}
//           />

//           {purposeOfVisit === PurposeOfVisit.CONSULTATION ? (
//             <>
//               <MultiSelect
//                 comboboxProps={{ withinPortal: true }}
//                 data={Object.entries(CONDITIONS).map(([key, value]) => ({
//                   label: value,
//                   value: key,
//                 }))}
//                 error={fetcher.data?.fieldErrors?.conditions}
//                 label="Conditions"
//                 name="conditions"
//                 placeholder="Select conditions"
//                 searchable
//               />

//               <Select
//                 clearable
//                 comboboxProps={{ withinPortal: true }}
//                 data={doctors.map(doctor => ({
//                   label: doctor.name,
//                   value: doctor.id,
//                 }))}
//                 disabled={isFetchingLoader}
//                 label="Primary Doctor"
//                 name="doctorId"
//                 placeholder="Select doctor"
//                 required
//                 rightSection={
//                   isFetchingLoader ? <Loader size={16} /> : undefined
//                 }
//                 searchable
//               />
//             </>
//           ) : null}

//           {purposeOfVisit === PurposeOfVisit.LAB ||
//           purposeOfVisit === PurposeOfVisit.CONSULTATION ? (
//             <MultiSelect
//               comboboxProps={{ withinPortal: true }}
//               data={labs.map(lab => ({
//                 label: lab.name,
//                 value: lab.id,
//               }))}
//               disabled={isFetchingLoader}
//               error={fetcher.data?.fieldErrors?.labs}
//               label="Labs"
//               name="labs"
//               placeholder="Select labs"
//               required={purposeOfVisit === PurposeOfVisit.LAB}
//               rightSection={isFetchingLoader ? <Loader size={16} /> : undefined}
//               searchable
//             />
//           ) : null}
//         </fetcher.Form>
//       </CustomModal>
//     )
//   },
// )
