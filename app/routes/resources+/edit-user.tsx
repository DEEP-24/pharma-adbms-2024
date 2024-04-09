// import { PasswordInput, TextInput } from '@mantine/core'
// import { type ActionFunctionArgs, redirect } from '@remix-run/node'
// import { jsonWithSuccess } from 'remix-toast'

// import { type BaseModalProps } from '~/components/global-modals'
// import { CustomButton } from '~/components/ui/custom-button'
// import { CustomModal } from '~/components/ui/custom-modal'
// import { Label } from '~/components/ui/label'
// import { Switch } from '~/components/ui/switch'
// import { type User } from '~/lib/column-def/user-column-def'
// import { editUser } from '~/lib/user.server'
// import { userRoleLabelLookup } from '~/utils/helpers'
// import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
// import { badRequest } from '~/utils/misc.server'
// import EasyModal from '~/utils/modal-manager'
// import { AccountStatus } from '~/utils/prisma-enums'
// import type { inferErrors } from '~/utils/validation'
// import { validateAction } from '~/utils/validation'
// import { editUserSchema } from '~/utils/zod.schema'

// const EDIT_USER_ROUTE = '/resources/edit-user'
// const EDIT_USER_FORM_ID = 'edit-user-form'

// interface ActionData {
//   fieldErrors?: inferErrors<typeof editUserSchema>
//   success: boolean
// }

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const { fieldErrors, fields } = await validateAction(request, editUserSchema)

//   if (fieldErrors) {
//     return badRequest({ fieldErrors, success: false })
//   }

//   const user = await editUser(fields)
//   return jsonWithSuccess(
//     { success: true },
//     `${userRoleLabelLookup[user.role]} updated successfully!`,
//   )
// }

// export const loader = async () => {
//   return redirect('/')
// }

// interface IEditUserModal extends BaseModalProps {
//   user: User
// }

// export const EditUserModal = EasyModal.create((props: IEditUserModal) => {
//   const { afterClose, afterOpen, onClose, user, ...modalProps } = props

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
//           <div className="flex items-center justify-end">
//             <CustomButton onClick={() => handleClose()} variant="transparent">
//               Cancel
//             </CustomButton>
//             <CustomButton
//               form={EDIT_USER_FORM_ID}
//               loading={fetcher.isPending}
//               type="submit"
//               variant="filled"
//             >
//               Update
//             </CustomButton>
//           </div>
//         }
//         onClose={() => handleClose()}
//         open={modalProps.visible}
//         title={`Edit ${user.name}`}
//       >
//         <fetcher.Form
//           action={EDIT_USER_ROUTE}
//           className="flex flex-col gap-4"
//           id={EDIT_USER_FORM_ID}
//           method="POST"
//         >
//           <input defaultValue={user.id} hidden name="userId" />
//           <div className="flex items-center gap-4">
//             <TextInput
//               defaultValue={user.prefix || ''}
//               error={fetcher.data?.fieldErrors?.prefix}
//               label="Prefix"
//               name="prefix"
//               placeholder="(Optional)"
//             />

//             <TextInput
//               className="w-full"
//               data-autofocus
//               defaultValue={user.name}
//               error={fetcher.data?.fieldErrors?.name}
//               label="Name"
//               name="name"
//               placeholder="Enter name"
//               required
//             />
//           </div>

//           <TextInput
//             defaultValue={user.email}
//             error={fetcher.data?.fieldErrors?.email}
//             label="Email"
//             name="email"
//             placeholder="Enter email"
//             required
//             type="email"
//           />

//           <PasswordInput
//             error={fetcher.data?.fieldErrors?.password}
//             label="Password"
//             name="password"
//             placeholder="Leave blank to keep the same password"
//           />

//           {user.status !== AccountStatus.DELETED ? (
//             <div className="flex items-center gap-2">
//               <Label htmlFor="user-disabled">Disabled</Label>

//               <Switch
//                 defaultChecked={user.disabled}
//                 id="user-disabled"
//                 name="disabled"
//               />
//             </div>
//           ) : null}
//         </fetcher.Form>
//       </CustomModal>
//     </>
//   )
// })
