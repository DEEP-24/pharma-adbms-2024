// import { Select, TextInput } from '@mantine/core'
// import { DatePickerInput } from '@mantine/dates'
// import { type Patient } from '@prisma/client'
// import { type ActionFunctionArgs } from '@remix-run/node'
// import { CalendarIcon } from 'lucide-react'
// import { jsonWithSuccess } from 'remix-toast'

// import { type BaseModalProps } from '~/components/global-modals'
// import { CustomButton } from '~/components/ui/custom-button'
// import { CustomModal } from '~/components/ui/custom-modal'
// import { db } from '~/lib/db.server'
// import { genderLabelLookup } from '~/utils/helpers'
// import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
// import { badRequest } from '~/utils/misc.server'
// import EasyModal from '~/utils/modal-manager'
// import { Gender } from '~/utils/prisma-enums'
// import type { inferErrors } from '~/utils/validation'
// import { validateAction } from '~/utils/validation'
// import { editPatientSchema } from '~/utils/zod.schema'

// const EDIT_PATIENT_ROUTE = '/resources/edit-patient'
// const EDIT_PATIENT_FORM_ID = 'edit-patient-form'

// export interface ActionData {
//   fieldErrors?: inferErrors<typeof editPatientSchema>
//   success: boolean
// }

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const { fieldErrors, fields } = await validateAction(
//     request,
//     editPatientSchema,
//   )

//   if (fieldErrors) {
//     return badRequest({ fieldErrors, success: false })
//   }

//   await db.patient.update({
//     data: {
//       dob: fields.dob,
//       email: fields.email,
//       fccId: `FMG-1284-${fields.phone}`,
//       gender: fields.gender,
//       name: fields.name,
//       phone: fields.phone,
//     },
//     where: {
//       id: fields.patientId,
//     },
//   })

//   return jsonWithSuccess({ success: true }, 'Patient updated successfully!')
// }

// interface IEditPatientModal extends BaseModalProps {
//   patient: Patient
// }

// export const EditPatientModal = EasyModal.create((props: IEditPatientModal) => {
//   const { afterClose, afterOpen, onClose, patient, ...modalProps } = props

//   const handleClose = async () => {
//     onClose?.()
//     modalProps.hide()
//   }

//   const fetcher = useFetcherCallback<ActionData>({
//     onSuccess: () => handleClose(),
//   })

//   return (
//     <>
//       <CustomModal
//         afterClose={() => afterClose?.()}
//         afterOpen={() => afterOpen?.()}
//         footerSection={
//           <div className="flex items-center justify-end gap-4">
//             <CustomButton
//               disabled={fetcher.isPending}
//               onClick={() => handleClose()}
//               variant="subtle"
//             >
//               Cancel
//             </CustomButton>

//             <CustomButton
//               form={EDIT_PATIENT_FORM_ID}
//               loading={fetcher.isPending}
//               type="submit"
//             >
//               Update
//             </CustomButton>
//           </div>
//         }
//         onClose={() => handleClose()}
//         open={modalProps.visible}
//         title="Edit Patient"
//       >
//         <fetcher.Form
//           action={EDIT_PATIENT_ROUTE}
//           className="mx-auto flex max-w-lg flex-col gap-4"
//           id={EDIT_PATIENT_FORM_ID}
//           method="POST"
//         >
//           <input defaultValue={patient.id} hidden name="patientId" />
//           <TextInput
//             data-autofocus
//             defaultValue={patient.name}
//             error={fetcher.data?.fieldErrors?.name}
//             label="Name"
//             name="name"
//             placeholder="Enter name"
//             required
//           />

//           <div className="grid grid-cols-6 gap-4">
//             <Select
//               className="col-span-2"
//               data={Object.values(Gender).map(gender => ({
//                 label: genderLabelLookup[gender],
//                 value: gender,
//               }))}
//               defaultValue={patient.gender}
//               error={fetcher.data?.fieldErrors?.gender}
//               label="Gender"
//               name="gender"
//               placeholder="Select a gender"
//               required
//             />

//             <TextInput
//               className="col-span-4"
//               defaultValue={patient.phone}
//               error={fetcher.data?.fieldErrors?.phone}
//               label="Phone"
//               name="phone"
//               placeholder="Enter phone"
//               required
//             />
//           </div>

//           <DatePickerInput
//             clearable
//             defaultLevel="decade"
//             defaultValue={new Date(patient.dob)}
//             dropdownType="popover"
//             error={fetcher.data?.fieldErrors?.dob}
//             label="Date of birth"
//             leftSection={<CalendarIcon className="text-gray-400" size={14} />}
//             leftSectionPointerEvents="none"
//             locale="en-IN"
//             maxDate={new Date()}
//             name="dob"
//             placeholder="Choose date of birth"
//             popoverProps={{
//               withinPortal: true,
//             }}
//             required
//             valueFormat="DD-MMM-YYYY"
//           />
//         </fetcher.Form>
//       </CustomModal>
//     </>
//   )
// })
