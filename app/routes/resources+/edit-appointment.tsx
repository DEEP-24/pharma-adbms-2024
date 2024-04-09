// import * as React from 'react'

// import { Loader, MultiSelect, Select } from '@mantine/core'
// import { type ActionFunctionArgs, json } from '@remix-run/node'
// import { CONDITIONS } from '~/data/conditions'
// import { $path, $routeId } from 'remix-routes'
// import { jsonWithSuccess } from 'remix-toast'

// import { type BaseModalProps } from '~/components/global-modals'
// import { CustomButton } from '~/components/ui/custom-button'
// import { CustomModal } from '~/components/ui/custom-modal'
// import { updateAppointment } from '~/lib/appointment.server'
// import { type Appointment } from '~/lib/column-def/appointments-column-def'
// import { getAvailableLabs } from '~/lib/lab.server'
// import { patientActivityLogger } from '~/lib/patient-activity.server'
// import { getUsers } from '~/lib/user.server'
// import { purposeOfVisitLabelLookup } from '~/utils/helpers'
// import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
// import { badRequest } from '~/utils/misc.server'
// import EasyModal from '~/utils/modal-manager'
// import {
//   PatientActivityAction,
//   PurposeOfVisit,
//   UserRole,
// } from '~/utils/prisma-enums'
// import type { inferErrors } from '~/utils/validation'
// import { validateAction } from '~/utils/validation'
// import { editAppointmentSchema } from '~/utils/zod.schema'

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
//   fieldErrors?: inferErrors<typeof editAppointmentSchema>
//   success: boolean
// }

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const { fieldErrors, fields } = await validateAction(
//     request,
//     editAppointmentSchema,
//   )

//   if (fieldErrors) {
//     return badRequest({ fieldErrors, success: false })
//   }

//   const updatedAppointment = await updateAppointment(fields)

//   await patientActivityLogger(updatedAppointment.patientId, {
//     type: PatientActivityAction.APPOINTMENT_UPDATED,
//   })

//   return jsonWithSuccess<ActionData>(
//     { success: true },
//     'Appointment updated successfully!',
//   )
// }

// interface IEditAppointmentModal extends BaseModalProps {
//   appointment: Appointment
// }

// const ROUTE = $path('/resources/edit-appointment')
// const FORM_ID = $routeId('routes/resources+/edit-appointment')

// export const EditAppointmentModal = EasyModal.create(
//   (props: IEditAppointmentModal) => {
//     const { afterClose, afterOpen, appointment, onClose, ...modalProps } = props

//     const [purposeOfVisit, setPurposeOfVisit] =
//       React.useState<PurposeOfVisit | null>(appointment.purpose)

//     const onModalClose = async () => {
//       onClose?.()
//       setPurposeOfVisit(appointment.purpose)
//       modalProps.hide()
//     }

//     const fetcher = useFetcherCallback<ActionData>({
//       key: ROUTE,
//       onSuccess: () => onModalClose(),
//     })

//     const loaderFetcher = useFetcherCallback<typeof loader>()
//     const doctors = loaderFetcher.data?.doctors || []
//     const labs = loaderFetcher.data?.labs || []
//     const isFetchingLoader = loaderFetcher.isPending || !loaderFetcher.data

//     React.useEffect(() => {
//       loaderFetcher.load(ROUTE)
//       // We don't want to re-fetch doctors on every render
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     return (
//       <CustomModal
//         afterClose={() => afterClose?.()}
//         afterOpen={() => afterOpen?.()}
//         footerSection={({ close }) => (
//           <div className="flex items-center justify-end gap-4">
//             <CustomButton
//               disabled={fetcher.isPending}
//               onClick={() => close()}
//               variant="subtle"
//             >
//               Cancel
//             </CustomButton>

//             <CustomButton
//               disabled={isFetchingLoader}
//               form={FORM_ID}
//               loading={fetcher.isPending}
//               type="submit"
//             >
//               Update
//             </CustomButton>
//           </div>
//         )}
//         onClose={() => onModalClose()}
//         open={modalProps.visible}
//         title="Update Appointment"
//       >
//         <fetcher.Form
//           action={ROUTE}
//           className="flex flex-col gap-4"
//           id={FORM_ID}
//           method="POST"
//         >
//           <input defaultValue={appointment.id} hidden name="appointmentId" />

//           <Select
//             className="pointer-events-none"
//             comboboxProps={{ withinPortal: true }}
//             data={Object.values(PurposeOfVisit).map(purpose => ({
//               label: purposeOfVisitLabelLookup[purpose],
//               value: purpose,
//             }))}
//             defaultValue={appointment.purpose}
//             description="Purpose of visit cannot be changed"
//             error={fetcher.data?.fieldErrors?.purpose}
//             label="Purpose"
//             name="purpose"
//             onChange={val => setPurposeOfVisit(val as PurposeOfVisit | null)}
//             placeholder="Select purpose of visit"
//             readOnly
//             searchable
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
//                 defaultValue={appointment.conditions}
//                 error={fetcher.data?.fieldErrors?.conditions}
//                 label="Conditions"
//                 name="conditions"
//                 placeholder="Select conditions"
//                 searchable
//               />

//               <Select
//                 className="pointer-events-none"
//                 clearable
//                 comboboxProps={{ withinPortal: true }}
//                 data={doctors.map(doctor => ({
//                   label: doctor.name,
//                   value: doctor.id,
//                 }))}
//                 defaultValue={appointment.doctorId}
//                 description="Primary doctor cannot be changed"
//                 disabled={isFetchingLoader}
//                 // This is to force re-render the component when doctors are fetched
//                 key={Math.random()}
//                 label="Primary Doctor"
//                 name="doctorId"
//                 placeholder="Select doctor"
//                 readOnly
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
//               defaultValue={appointment.labs.map(({ lab }) => lab.id)}
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
