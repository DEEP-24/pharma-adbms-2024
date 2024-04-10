import { NumberInput, Select, TextInput } from '@mantine/core'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { jsonWithSuccess } from 'remix-toast'

import { type BaseModalProps } from '~/components/global-modals'
import { CustomButton } from '~/components/ui/custom-button'
import { CustomModal } from '~/components/ui/custom-modal'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { type Medication } from '~/lib/column-def/medication-column-def'
import { editMedication } from '~/lib/medication.server'
import { medicationUnitLabelLookup } from '~/utils/helpers'
import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
import { badRequest } from '~/utils/misc.server'
import EasyModal from '~/utils/modal-manager'
import { MedicationUnit } from '~/utils/prisma-enums'
import type { inferErrors } from '~/utils/validation'
import { validateAction } from '~/utils/validation'
import { editMedicationSchema } from '~/utils/zod.schema'

const EDIT_MEDICATION_ROUTE = '/resources/edit-medication'
const EDIT_MEDICATION_FORM_ID = 'edit-medication-form'

export interface ActionData {
  fieldErrors?: inferErrors<typeof editMedicationSchema>
  success: boolean
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { fieldErrors, fields } = await validateAction(
    request,
    editMedicationSchema,
  )

  if (fieldErrors) {
    return badRequest({ fieldErrors, success: false })
  }

  await editMedication(fields)

  return json({ success: true })
}

interface IEditMedicationModalProps extends BaseModalProps {
  medication: Medication
}

export const EditMedicationModal = EasyModal.create(
  (props: IEditMedicationModalProps) => {
    const { afterClose, afterOpen, medication, onClose, ...modalProps } = props

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
                form={EDIT_MEDICATION_FORM_ID}
                loading={fetcher.isPending}
                type="submit"
              >
                Update
              </CustomButton>
            </div>
          }
          onClose={() => handleClose()}
          open={modalProps.visible}
          title="Edit Medication"
        >
          <fetcher.Form
            action={EDIT_MEDICATION_ROUTE}
            className="mx-auto flex max-w-lg flex-col gap-4"
            id={EDIT_MEDICATION_FORM_ID}
            method="POST"
          >
            <input defaultValue={medication.id} hidden name="medicationId" />
            <TextInput
              data-1p-ignore="true"
              data-autofocus
              defaultValue={medication.name}
              error={fetcher.data?.fieldErrors?.name}
              label="Name"
              name="name"
              placeholder="Enter name"
              required
            />

            <TextInput
              defaultValue={medication.brand}
              error={fetcher.data?.fieldErrors?.brand}
              label="Brand"
              name="brand"
              placeholder="Enter brand"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                defaultValue={medication.dosage}
                error={fetcher.data?.fieldErrors?.dosage}
                hideControls
                label="Dosage"
                min={0}
                name="dosage"
                placeholder="Enter dosage"
                required
              />
              <Select
                comboboxProps={{ withinPortal: true }}
                data={Object.values(MedicationUnit).map(unit => ({
                  label: medicationUnitLabelLookup[unit],
                  value: unit,
                }))}
                defaultValue={medication.unit}
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
                defaultValue={medication.quantity}
                error={fetcher.data?.fieldErrors?.quantity}
                label="Quantity"
                min={0}
                name="quantity"
                placeholder="Enter quantity"
                required
              />

              <NumberInput
                defaultValue={medication.price}
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

              <Switch
                id="prescriptionRequired"
                name="prescriptionRequired"
                defaultChecked={medication.prescriptionRequired}
              />
            </div>
          </fetcher.Form>
        </CustomModal>
      </>
    )
  },
)
