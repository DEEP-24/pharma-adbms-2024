// import { PasswordInput, TextInput } from '@mantine/core'
// import { type ActionFunctionArgs, redirect } from '@remix-run/node'
// import { jsonWithSuccess } from 'remix-toast'

// import { type BaseModalProps } from '~/components/global-modals'
// import { CustomButton } from '~/components/ui/custom-button'
// import { CustomModal } from '~/components/ui/custom-modal'
// import { Label } from '~/components/ui/label'
// import { Switch } from '~/components/ui/switch'
// import { createUser, doesUserExist } from '~/lib/user.server'
// import { userRoleLabelLookup } from '~/utils/helpers'
// import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
// import { badRequest } from '~/utils/misc.server'
// import EasyModal from '~/utils/modal-manager'
// import { type UserRole } from '~/utils/prisma-enums'
// import type { inferErrors } from '~/utils/validation'
// import { validateAction } from '~/utils/validation'
// import { createUserSchema } from '~/utils/zod.schema'

// const ADD_USER_ROUTE = '/resources/create-user'
// const CREATE_USER_FORM_ID = 'create-user-form'

// export interface ActionData {
//   fieldErrors?: inferErrors<typeof createUserSchema>
//   success: boolean
// }

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const { fieldErrors, fields } = await validateAction(
//     request,
//     createUserSchema,
//   )

//   if (fieldErrors) {
//     return badRequest({ fieldErrors, success: false })
//   }

//   const userExists = await doesUserExist(fields.email)

//   if (userExists) {
//     return badRequest({
//       fieldErrors: {
//         email: 'User with this email already exists',
//       },
//       success: false,
//     })
//   }

//   const createdUser = await createUser(fields)
//   return jsonWithSuccess(
//     { success: true },
//     `${userRoleLabelLookup[createdUser.role]} created successfully!`,
//   )
// }

// export const loader = async () => {
//   return redirect('/')
// }

// interface ICreateUserModal extends BaseModalProps {
//   userRole: UserRole
// }

// export const CreateUserModal = EasyModal.create((props: ICreateUserModal) => {
//   const { afterClose, afterOpen, onClose, userRole, ...modalProps } = props

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
//               form={CREATE_USER_FORM_ID}
//               loading={fetcher.isPending}
//               type="submit"
//             >
//               Create
//             </CustomButton>
//           </div>
//         }
//         onClose={() => handleClose()}
//         open={modalProps.visible}
//         title={`Create ${userRoleLabelLookup[userRole]}`}
//       >
//         <fetcher.Form
//           action={ADD_USER_ROUTE}
//           className="mx-auto flex max-w-lg flex-col gap-4"
//           id={CREATE_USER_FORM_ID}
//           method="POST"
//         >
//           <input defaultValue={userRole} hidden name="userRole" />
//           <div className="flex items-center gap-4">
//             <TextInput
//               error={fetcher.data?.fieldErrors?.prefix}
//               label="Prefix"
//               name="prefix"
//               placeholder="(Optional)"
//             />

//             <TextInput
//               className="w-full"
//               data-autofocus
//               error={fetcher.data?.fieldErrors?.name}
//               label="Name"
//               name="name"
//               placeholder="Enter name"
//               required
//             />
//           </div>

//           <TextInput
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
//             placeholder="Enter password"
//           />

//           <PasswordInput
//             error={fetcher.data?.fieldErrors?.confirmPassword}
//             label="Confirm Password"
//             name="confirmPassword"
//             placeholder="Confirm password"
//           />

//           <div className="flex items-center gap-2">
//             <Label className="text-sm" htmlFor="user-disabled">
//               Disabled
//             </Label>

//             <Switch id="user-disabled" name="disabled" />
//           </div>
//         </fetcher.Form>
//       </CustomModal>
//     </>
//   )
// })
