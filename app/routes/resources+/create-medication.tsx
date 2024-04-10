import { NumberInput, Select, Switch, TextInput } from '@mantine/core'
import { type ActionFunctionArgs } from '@remix-run/node'
import { jsonWithSuccess } from 'remix-toast'

import { type BaseModalProps } from '~/components/global-modals'
import { CustomButton } from '~/components/ui/custom-button'
import { CustomModal } from '~/components/ui/custom-modal'
import { Label } from '~/components/ui/label'
import { createMedication } from '~/lib/medication.server'
import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
import { badRequest } from '~/utils/misc.server'
import EasyModal, { useModal } from '~/utils/modal-manager'
import { MedicationUnit } from '~/utils/prisma-enums'
import type { inferErrors } from '~/utils/validation'
import { validateAction } from '~/utils/validation'
import { createMedicationSchema } from '~/utils/zod.schema'

interface CreateMedicationActionData {
  fieldErrors?: inferErrors<typeof createMedicationSchema>
  success: boolean
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { fieldErrors, fields } = await validateAction(
    request,
    createMedicationSchema,
  )

  if (fieldErrors) {
    return badRequest({ fieldErrors, success: false })
  }

  await createMedication(fields)

  return jsonWithSuccess({ success: true }, 'Medication created successfully')
}

interface ICreateMedicationModal extends BaseModalProps {}

const CREATE_MEDICATION_ROUTE = '/resources/create-medication'
const CREATE_MEDICATION_FORM_ID = 'create-medication-form'

export const CreateMedicationModal = EasyModal.create(
  (props: ICreateMedicationModal) => {
    const { afterClose, afterOpen, onClose } = props
    const modal = useModal()

    const handleClose = async () => {
      onClose?.()
      modal.hide()
    }

    const fetcher = useFetcherCallback<CreateMedicationActionData>({
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
                form={CREATE_MEDICATION_FORM_ID}
                loading={fetcher.isPending}
                type="submit"
              >
                Create
              </CustomButton>
            </div>
          }
          onClose={() => handleClose()}
          open={modal.visible}
          title="Create Medication"
        >
          <fetcher.Form
            action={CREATE_MEDICATION_ROUTE}
            className="flex flex-col gap-4"
            id={CREATE_MEDICATION_FORM_ID}
            method="POST"
          >
            <TextInput
              data-autofocus
              error={fetcher.data?.fieldErrors?.name}
              label="Name"
              name="name"
              placeholder="Enter name"
              required
            />

            <TextInput
              error={fetcher.data?.fieldErrors?.brand}
              label="Brand"
              name="brand"
              placeholder="Enter brand"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                error={fetcher.data?.fieldErrors?.dosage}
                label="Dosage"
                name="dosage"
                placeholder="Enter dosage"
                required
              />
              <Select
                comboboxProps={{ withinPortal: true }}
                data={Object.values(MedicationUnit).map(unit => ({
                  label: unit,
                  value: unit,
                }))}
                error={fetcher.data?.fieldErrors?.unit}
                label="Unit"
                name="unit"
                placeholder="Select unit"
                required
                searchable
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                error={fetcher.data?.fieldErrors?.quantity}
                label="Quantity"
                min={0}
                name="quantity"
                placeholder="Enter quantity"
                required
              />

              <NumberInput
                error={fetcher.data?.fieldErrors?.price}
                label="Price"
                left="₹"
                min={0}
                name="price"
                placeholder="Enter price"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm" htmlFor="prescriptionRequired">
                Is Prescription Required
              </Label>

              <Switch id="prescriptionRequired" name="prescriptionRequired" />
            </div>
          </fetcher.Form>
        </CustomModal>
      </>
    )
  },
)
