import { Select, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Doctor, Pharmacist } from '@prisma/client'
import { type ActionFunctionArgs } from '@remix-run/node'
import { CalendarIcon } from 'lucide-react'
import { jsonWithSuccess } from 'remix-toast'

import { type BaseModalProps } from '~/components/global-modals'
import { CustomButton } from '~/components/ui/custom-button'
import { CustomModal } from '~/components/ui/custom-modal'
import { db } from '~/lib/db.server'
import { genderLabelLookup } from '~/utils/helpers'
import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
import { badRequest } from '~/utils/misc.server'
import EasyModal from '~/utils/modal-manager'
import { Gender } from '~/utils/prisma-enums'
import type { inferErrors } from '~/utils/validation'
import { validateAction } from '~/utils/validation'
import { editPharmacistSchema } from '~/utils/zod.schema'

const EDIT_PHARMACIST_ROUTE = '/resources/edit-pharmacist'
const EDIT_PHARMACIST_FORM_ID = 'edit-doctor-form'

export interface ActionData {
  fieldErrors?: inferErrors<typeof editPharmacistSchema>
  success: boolean
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { fieldErrors, fields } = await validateAction(
    request,
    editPharmacistSchema,
  )

  if (fieldErrors) {
    return badRequest({ fieldErrors, success: false })
  }

  await db.pharmacist.update({
    data: {
      dob: fields.dob,
      email: fields.email,
      gender: fields.gender,
      name: fields.name,
      phone: fields.phone,
    },
    where: {
      id: fields.pharmacistId,
    },
  })

  return jsonWithSuccess({ success: true }, 'Pharmacist updated successfully!')
}

interface IEditPharmacistModal extends BaseModalProps {
  pharmacist: Pharmacist
}

export const EditPharmacistModal = EasyModal.create(
  (props: IEditPharmacistModal) => {
    const { afterClose, afterOpen, onClose, pharmacist, ...modalProps } = props

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
                form={EDIT_PHARMACIST_FORM_ID}
                loading={fetcher.isPending}
                type="submit"
              >
                Update
              </CustomButton>
            </div>
          }
          onClose={() => handleClose()}
          open={modalProps.visible}
          title="Edit Pharmacist"
        >
          <fetcher.Form
            action={EDIT_PHARMACIST_ROUTE}
            className="mx-auto flex max-w-lg flex-col gap-4"
            id={EDIT_PHARMACIST_FORM_ID}
            method="POST"
          >
            <input defaultValue={pharmacist.id} hidden name="pharmacistId" />
            <TextInput
              data-autofocus
              defaultValue={pharmacist.name}
              error={fetcher.data?.fieldErrors?.name}
              label="Name"
              name="name"
              placeholder="Enter name"
              required
            />

            <div className="grid grid-cols-6 gap-4">
              <Select
                className="col-span-2"
                data={Object.values(Gender).map(gender => ({
                  label: genderLabelLookup[gender],
                  value: gender,
                }))}
                defaultValue={pharmacist.gender}
                error={fetcher.data?.fieldErrors?.gender}
                label="Gender"
                name="gender"
                placeholder="Select a gender"
                required
              />

              <TextInput
                className="col-span-4"
                defaultValue={pharmacist.phone}
                error={fetcher.data?.fieldErrors?.phone}
                label="Phone"
                name="phone"
                placeholder="Enter phone"
                required
              />
            </div>

            <DatePickerInput
              clearable
              defaultLevel="decade"
              defaultValue={new Date(pharmacist.dob)}
              dropdownType="popover"
              error={fetcher.data?.fieldErrors?.dob}
              label="Date of birth"
              leftSection={<CalendarIcon className="text-gray-400" size={14} />}
              leftSectionPointerEvents="none"
              locale="en-IN"
              maxDate={new Date()}
              name="dob"
              placeholder="Choose date of birth"
              popoverProps={{
                withinPortal: true,
              }}
              required
              valueFormat="DD-MMM-YYYY"
            />
          </fetcher.Form>
        </CustomModal>
      </>
    )
  },
)
