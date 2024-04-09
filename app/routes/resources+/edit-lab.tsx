// import { NumberInput, Select, TextInput, Textarea } from '@mantine/core'
// import { type Lab } from '@prisma/client'
// import { type ActionFunctionArgs } from '@remix-run/node'
// import { $path, $routeId } from 'remix-routes'
// import { jsonWithSuccess } from 'remix-toast'

// import { type BaseModalProps } from '~/components/global-modals'
// import { CustomButton } from '~/components/ui/custom-button'
// import { CustomModal } from '~/components/ui/custom-modal'
// import { editLab } from '~/lib/lab.server'
// import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
// import { titleCase } from '~/utils/misc'
// import { badRequest } from '~/utils/misc.server'
// import EasyModal from '~/utils/modal-manager'
// import { Department } from '~/utils/prisma-enums'
// import type { inferErrors } from '~/utils/validation'
// import { validateAction } from '~/utils/validation'
// import { editLabSchema } from '~/utils/zod.schema'

// interface ActionData {
//   fieldErrors?: inferErrors<typeof editLabSchema>
//   success: boolean
// }

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const { fieldErrors, fields } = await validateAction(request, editLabSchema)

//   if (fieldErrors) {
//     return badRequest({ fieldErrors, success: false })
//   }

//   await editLab(fields)
//   return jsonWithSuccess({ success: true }, 'Lab updated successfully!')
// }

// interface IEditLabModal extends BaseModalProps {
//   lab: Lab
// }

// const ROUTE = $path('/resources/edit-lab')
// const FORM_ID = $routeId('routes/resources+/edit-lab')

// export const EditLabModal = EasyModal.create((props: IEditLabModal) => {
//   const { afterClose, afterOpen, lab, onClose, ...modalProps } = props

//   const onModalClose = async () => {
//     onClose?.()
//     modalProps.hide()
//   }

//   const fetcher = useFetcherCallback<ActionData>({
//     onSuccess: () => onModalClose(),
//   })

//   return (
//     <>
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
//         title="Edit Lab"
//       >
//         <fetcher.Form
//           action={ROUTE}
//           className="flex flex-col gap-4"
//           id={FORM_ID}
//           method="POST"
//         >
//           <input defaultValue={lab.id} hidden name="labId" />
//           <TextInput
//             data-autofocus
//             defaultValue={lab.name}
//             error={fetcher.data?.fieldErrors?.name}
//             label="Name"
//             name="name"
//             placeholder="Enter name"
//             required
//           />

//           <NumberInput
//             defaultValue={lab.price}
//             error={fetcher.data?.fieldErrors?.price}
//             hideControls
//             label="Price"
//             leftSection="₹"
//             min={0}
//             name="price"
//             placeholder="Enter price"
//             required
//           />

//           <Textarea
//             defaultValue={lab.description}
//             error={fetcher.data?.fieldErrors?.description}
//             label="Description"
//             name="description"
//             placeholder="Enter description"
//             required
//           />

//           <Select
//             comboboxProps={{ withinPortal: false }}
//             data={Object.values(Department).map(department => ({
//               label: titleCase(department),
//               value: department,
//             }))}
//             defaultValue={lab.department}
//             error={fetcher.data?.fieldErrors?.department}
//             label="Department"
//             name="department"
//             placeholder="Select department"
//             required
//             searchable
//           />
//         </fetcher.Form>
//       </CustomModal>
//     </>
//   )
// })
