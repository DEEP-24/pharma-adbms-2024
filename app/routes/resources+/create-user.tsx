import {
  NumberInput,
  PasswordInput,
  Select,
  TextInput,
  Textarea,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Gender } from '@prisma/client'
import { type ActionFunctionArgs, redirect } from '@remix-run/node'
import { jsonWithSuccess } from 'remix-toast'
import { z } from 'zod'

import { type BaseModalProps } from '~/components/global-modals'
import { CustomButton } from '~/components/ui/custom-button'
import { CustomModal } from '~/components/ui/custom-modal'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { UserRole } from '~/enums'
import { db } from '~/lib/db.server'
import { createUser } from '~/lib/user.server'
import { genderLabelLookup } from '~/utils/helpers'

import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
import { userRoleLabelLookup } from '~/utils/misc'
import { badRequest, createPasswordHash } from '~/utils/misc.server'
import EasyModal from '~/utils/modal-manager'

import type { inferErrors } from '~/utils/validation'
import { validateAction } from '~/utils/validation'

const ADD_USER_ROUTE = '/resources/create-user'
const CREATE_USER_FORM_ID = 'create-user-form'

const CreateUserSchema = z
  .object({
    email: z.string().trim().email('Invalid email address'),
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters'),
    firstName: z.string().trim().min(3, 'First name is required'),
    lastName: z.string().trim().min(3, 'Last name is required'),
    address: z.string().trim().min(3, 'Address is required'),
    gender: z.nativeEnum(Gender),
    age: z.preprocess(Number, z.number().min(0, 'Age must be greater than 0')),
    dob: z.string().trim().min(10, 'Date of birth is required'),
    phone: z
      .string()
      .trim()
      .min(10, 'Phone number should be at least 10 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword', 'password'],
      })
    }
    return true
  })

export interface ActionData {
  fieldErrors?: inferErrors<typeof CreateUserSchema>
  success: boolean
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { fieldErrors, fields } = await validateAction(
    request,
    CreateUserSchema,
  )

  if (fieldErrors) {
    return badRequest({ fieldErrors, success: false })
  }

  const userExists = await db.pharmacist.findFirst({
    where: {
      email: fields.email,
    },
  })

  if (userExists) {
    return badRequest({
      fieldErrors: {
        email: 'User with this email already exists',
      },
      success: false,
    })
  }

  await db.pharmacist.create({
    data: {
      email: fields.email,
      firstName: fields.firstName,
      lastName: fields.lastName,
      address: fields.address,
      age: fields.age,
      gender: fields.gender,
      dob: new Date(fields.dob),
      phone: fields.phone,
      password: await createPasswordHash(fields.password),
    },
  })
  return jsonWithSuccess({ success: true }, `Created successfully!`)
}

export const loader = async () => {
  return redirect('/')
}

interface ICreateUserModal extends BaseModalProps {
  userRole: UserRole
}

export const CreateUserModal = EasyModal.create((props: ICreateUserModal) => {
  const { afterClose, afterOpen, onClose, userRole, ...modalProps } = props

  const handleClose = async () => {
    onClose?.()
    modalProps.hide()
  }

  const fetcher = useFetcherCallback<ActionData>({
    onSuccess: () => handleClose(),
  })

  return (
    <>
      <CustomModal
        afterClose={() => afterClose?.()}
        afterOpen={() => afterOpen?.()}
        footerSection={
          <div className="flex items-center justify-end gap-4">
            <CustomButton
              disabled={fetcher.isPending}
              onClick={() => handleClose()}
              variant="subtle"
            >
              Cancel
            </CustomButton>

            <CustomButton
              form={CREATE_USER_FORM_ID}
              loading={fetcher.isPending}
              type="submit"
            >
              Create
            </CustomButton>
          </div>
        }
        onClose={() => handleClose()}
        open={modalProps.visible}
        title={`Create ${userRoleLabelLookup[userRole]}`}
      >
        <fetcher.Form
          action={ADD_USER_ROUTE}
          className="mx-auto flex max-w-lg flex-col gap-4"
          id={CREATE_USER_FORM_ID}
          method="POST"
        >
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              error={fetcher.data?.fieldErrors?.firstName}
              label="First Name"
              name="firstName"
              placeholder="Enter first name"
              required
            />

            <TextInput
              error={fetcher.data?.fieldErrors?.lastName}
              label="Last Name"
              name="lastName"
              placeholder="Enter last name"
              required
            />
          </div>

          <TextInput
            type="email"
            error={fetcher.data?.fieldErrors?.email}
            label="Email"
            name="email"
            placeholder="Enter email"
            required
          />

          <PasswordInput
            error={fetcher.data?.fieldErrors?.password}
            label="Password"
            name="password"
            placeholder="Enter password"
          />

          <PasswordInput
            error={fetcher.data?.fieldErrors?.confirmPassword}
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm password"
          />

          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              error={fetcher.data?.fieldErrors?.age}
              label="Age"
              name="age"
              min={0}
              placeholder="Enter age"
              required
            />

            <Select
              error={fetcher.data?.fieldErrors?.gender}
              label="Gender"
              name="gender"
              placeholder="Select a gender"
              data={Object.values(Gender).map(gender => ({
                label: genderLabelLookup[gender],
                value: gender,
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DatePickerInput
              error={fetcher.data?.fieldErrors?.dob}
              label="Date of birth"
              name="dob"
              placeholder="Choose date of birth"
              required
            />

            <TextInput
              error={fetcher.data?.fieldErrors?.phone}
              label="Phone Number"
              name="phone"
              placeholder="Enter phone number"
              required
            />
          </div>

          <Textarea
            error={fetcher.data?.fieldErrors?.address}
            label="Address"
            name="address"
            placeholder="Enter address"
            required
          />
        </fetcher.Form>
      </CustomModal>
    </>
  )
})
